import * as vscode from 'vscode';
import { GoogleGenAI } from '@google/genai';

export interface ApiKeyStatus {
    configured: boolean;
    valid: boolean;
    source: 'secrets' | 'config' | 'env' | 'none';
    model: string;
    errorMessage?: string;
}

/**
 * Clean and sanitize raw API key strings (strips quotes, whitespace, Bearer, export prefixes).
 * Perfectly preserves both new "AQ." keys and legacy "AIza" keys.
 */
export function cleanApiKey(rawKey: string): string {
    let key = rawKey.trim();
    // Remove wrapping quotes or backticks
    if ((key.startsWith('"') && key.endsWith('"')) ||
        (key.startsWith("'") && key.endsWith("'")) ||
        (key.startsWith('`') && key.endsWith('`'))) {
        key = key.slice(1, -1).trim();
    }
    // Remove export KEY= or KEY= prefixes
    if (key.includes('=')) {
        key = key.split('=').pop()!.trim();
    }
    // Remove Bearer prefix
    if (key.toLowerCase().startsWith('bearer ')) {
        key = key.slice(7).trim();
    }
    return key;
}

export class GeminiService {
    private static instance: GeminiService | null = null;
    private genAI: GoogleGenAI | null = null;
    private activeModelName: string = 'gemini-3.8-flash';
    private lastRequestTimestamp: number = 0;
    private outputChannel: vscode.OutputChannel;

    private constructor(private context: vscode.ExtensionContext) {
        this.outputChannel = vscode.window.createOutputChannel('Anti-Slop: Gemini');
        this.refreshModelConfig();
    }

    static getInstance(context: vscode.ExtensionContext): GeminiService {
        if (!GeminiService.instance) {
            GeminiService.instance = new GeminiService(context);
        }
        return GeminiService.instance;
    }

    refreshModelConfig(): void {
        const config = vscode.workspace.getConfiguration('antiSlop');
        const configuredModel = config.get<string>('model');
        // Force upgrade away from deprecated 2.0 / 1.5 / exp models to gemini-3.8-flash
        if (!configuredModel || configuredModel.includes('2.0') || configuredModel.includes('1.5') || configuredModel.includes('exp')) {
            this.activeModelName = 'gemini-3.8-flash';
        } else {
            this.activeModelName = configuredModel;
        }
    }

    getActiveModelName(): string {
        return this.activeModelName;
    }

    /**
     * Resolve the Gemini API key from (1) SecretStorage, (2) workspace config, or (3) env vars.
     */
    async getApiKey(): Promise<{ key: string | undefined; source: ApiKeyStatus['source'] }> {
        // 1. VS Code SecretStorage (preferred & secure)
        try {
            const secretKey = await this.context.secrets.get('antiSlop.geminiApiKey');
            if (secretKey && secretKey.trim().length > 0) {
                return { key: cleanApiKey(secretKey), source: 'secrets' };
            }
        } catch {
            // fallback
        }

        // 2. Settings configuration
        const config = vscode.workspace.getConfiguration('antiSlop');
        const configKey = config.get<string>('geminiApiKey');
        if (configKey && configKey.trim().length > 0) {
            return { key: cleanApiKey(configKey), source: 'config' };
        }

        // 3. Environment variables
        const envKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (envKey && envKey.trim().length > 0) {
            return { key: cleanApiKey(envKey), source: 'env' };
        }

        return { key: undefined, source: 'none' };
    }

    /**
     * Store the user's API key securely.
     */
    async storeApiKey(apiKey: string): Promise<void> {
        const cleaned = cleanApiKey(apiKey);
        await this.context.secrets.store('antiSlop.geminiApiKey', cleaned);
        this.genAI = new GoogleGenAI({ apiKey: cleaned });
    }

    /**
     * Clear any stored API key.
     */
    async clearApiKey(): Promise<void> {
        await this.context.secrets.delete('antiSlop.geminiApiKey');
        const config = vscode.workspace.getConfiguration('antiSlop');
        await config.update('geminiApiKey', '', vscode.ConfigurationTarget.Global);
        this.genAI = null;
    }

    /**
     * Validate an API key against Gemini API using the official GoogleGenAI SDK.
     */
    async validateApiKey(keyToTest?: string): Promise<{ valid: boolean; error?: string }> {
        let key = keyToTest ? cleanApiKey(keyToTest) : undefined;
        if (!key) {
            const res = await this.getApiKey();
            key = res.key;
        }

        if (!key) {
            return { valid: false, error: 'No API key provided' };
        }

        const client = new GoogleGenAI({ apiKey: key });
        const modelsToTry = [this.activeModelName, 'gemini-2.5-flash', 'gemini-3.6-flash'];

        for (const candidateModel of modelsToTry) {
            try {
                const response = await client.models.generateContent({
                    model: candidateModel,
                    contents: 'Respond with OK',
                });

                if (response.text || response.candidates?.length) {
                    this.activeModelName = candidateModel;
                    return { valid: true };
                }
            } catch (err: any) {
                const msg = err?.message || String(err);

                // 503 High demand means authentication succeeded, but the specific model is temporarily busy
                if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand')) {
                    this.outputChannel.appendLine(`Candidate ${candidateModel} busy (503). Trying fallback...`);
                    continue;
                }

                // If invalid credentials, stop immediately
                if (msg.includes('API_KEY_INVALID') || msg.includes('INVALID_ARGUMENT')) {
                    return {
                        valid: false,
                        error: 'The provided Gemini API key is invalid. Please verify the key at https://aistudio.google.com/app/apikey'
                    };
                }

                if (msg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED') || msg.includes('401')) {
                    return {
                        valid: false,
                        error: 'Authentication error (401). Verify that your key was copied completely from Google AI Studio.'
                    };
                }

                // If 429 rate limit, authentication was verified
                if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
                    return {
                        valid: true,
                        error: 'Gemini Free Tier rate limit reached. Key is valid, but currently throttled.'
                    };
                }
            }
        }

        // If all candidate models were busy (503), the key itself is valid!
        return {
            valid: true,
            error: 'Google servers are temporarily experiencing high demand (503). Your key is valid and will retry automatically.'
        };
    }

    /**
     * Ensure the Gemini AI client is initialized.
     */
    async ensureInitialized(): Promise<boolean> {
        const { key } = await this.getApiKey();
        if (!key) {
            return false;
        }
        this.genAI = new GoogleGenAI({ apiKey: key });
        this.refreshModelConfig();
        return true;
    }

    /**
     * Execute a prompt with exponential backoff and rate limit/503 handling for Gemini Free Tier.
     */
    async generateWithRetry(
        prompt: string,
        customModel?: string,
        maxRetries: number = 5,
        onRetryNotice?: (msg: string) => void
    ): Promise<string> {
        const { key } = await this.getApiKey();
        if (!key) {
            throw new Error('Gemini API key is not configured.');
        }

        const client = new GoogleGenAI({ apiKey: key });
        let modelName = customModel || this.activeModelName;
        if (modelName.includes('2.0') || modelName.includes('1.5') || modelName.includes('exp')) {
            modelName = 'gemini-3.8-flash';
            this.activeModelName = 'gemini-3.8-flash';
        }

        // Throttle pacing for Free Tier (15 RPM max -> ensure at least 1.2s between consecutive requests)
        const now = Date.now();
        const timeSinceLast = now - this.lastRequestTimestamp;
        const minSpacingMs = 1200;
        if (timeSinceLast < minSpacingMs) {
            await new Promise(resolve => setTimeout(resolve, minSpacingMs - timeSinceLast));
        }

        let attempt = 0;
        let delayMs = 2500;

        while (attempt <= maxRetries) {
            try {
                this.lastRequestTimestamp = Date.now();
                const response = await client.models.generateContent({
                    model: modelName,
                    contents: prompt,
                });

                return response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || '';
            } catch (err: any) {
                const message = err?.message || String(err);

                // 1. Handle model deprecation (404)
                if (message.includes('404') && (message.includes('no longer available') || message.includes('gemini-3.8-flash'))) {
                    this.outputChannel.appendLine('Switched model to gemini-3.8-flash after 404 notification.');
                    modelName = 'gemini-3.8-flash';
                    this.activeModelName = 'gemini-3.8-flash';
                    attempt++;
                    continue;
                }

                // 2. Handle temporary high demand / server overload (503 Service Unavailable)
                const isOverloaded = message.includes('503') ||
                                     message.includes('UNAVAILABLE') ||
                                     message.includes('high demand');

                if (isOverloaded && attempt < maxRetries) {
                    attempt++;
                    const waitSec = Math.round(delayMs / 1000);
                    // On second attempt, fall back to gemini-2.5-flash to bypass the congested model
                    if (attempt >= 2 && modelName === 'gemini-3.8-flash') {
                        modelName = 'gemini-2.5-flash';
                        const notice = `Model gemini-3.8-flash busy (503). Switching to gemini-2.5-flash (attempt ${attempt}/${maxRetries})...`;
                        this.outputChannel.appendLine(notice);
                        if (onRetryNotice) onRetryNotice(notice);
                    } else {
                        const notice = `Gemini model high demand (503). Retrying in ${waitSec}s (attempt ${attempt}/${maxRetries})...`;
                        this.outputChannel.appendLine(notice);
                        if (onRetryNotice) onRetryNotice(notice);
                    }
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    delayMs *= 2;
                    continue;
                }

                // 3. Handle Free Tier rate limits (429 RESOURCE_EXHAUSTED)
                const isRateLimit = message.includes('429') ||
                                    message.includes('RESOURCE_EXHAUSTED') ||
                                    message.includes('rate limit');

                if (isRateLimit && attempt < maxRetries) {
                    attempt++;

                    // Dynamically hop to another flash model pool with a fresh 15 RPM quota!
                    if (modelName === 'gemini-3.8-flash') {
                        modelName = 'gemini-2.5-flash';
                        const notice = `15 RPM limit on gemini-3.8-flash. Switching to gemini-2.5-flash pool...`;
                        this.outputChannel.appendLine(notice);
                        if (onRetryNotice) onRetryNotice(notice);
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        continue;
                    } else if (modelName === 'gemini-2.5-flash') {
                        modelName = 'gemini-2.5-flash-lite';
                        const notice = `15 RPM limit on gemini-2.5-flash. Switching to gemini-2.5-flash-lite pool...`;
                        this.outputChannel.appendLine(notice);
                        if (onRetryNotice) onRetryNotice(notice);
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        continue;
                    }

                    const waitSec = Math.round(delayMs / 1000);
                    const notice = `Gemini Free Tier rate limit reached. Pausing for ${waitSec}s (retry ${attempt}/${maxRetries})...`;
                    this.outputChannel.appendLine(notice);
                    if (onRetryNotice) {
                        onRetryNotice(notice);
                    }
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                    delayMs = Math.min(15000, delayMs * 2);
                    continue;
                }

                if (isRateLimit) {
                    throw new Error(
                        'Gemini Free Tier quota/rate limit exceeded (15 RPM). Please wait 30-60 seconds before scanning again, or use Unified Scan to save requests.'
                    );
                } else if (isOverloaded) {
                    throw new Error(
                        'Google Gemini servers are temporarily experiencing high demand across flash models (503). Please wait a moment and try again.'
                    );
                } else if (message.includes('API_KEY_INVALID')) {
                    throw new Error(
                        'Invalid Gemini API key. Please reconfigure your key via "Anti-Slop: Configure Gemini API Key".'
                    );
                } else {
                    this.outputChannel.appendLine(`Gemini Error: ${message}`);
                    throw err;
                }
            }
        }

        throw new Error('Failed to generate content after retries.');
    }

    /**
     * Guide the user to acquire a Free Gemini API key.
     */
    static async openAiStudioForFreeKey(): Promise<void> {
        const url = vscode.Uri.parse('https://aistudio.google.com/app/apikey');
        await vscode.env.openExternal(url);
    }
}
