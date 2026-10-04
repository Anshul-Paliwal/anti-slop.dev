/**
 * Supported language categories for syntax and heuristic analyzers.
 * Easily extensible for new languages (e.g., 'python', 'rust', 'go', 'html', etc.).
 */
export type LanguageCategory =
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'css'
  | 'vue'
  | 'svelte'
  | 'json'
  | 'markdown'
  | 'unknown';

export interface FileTypeDefinition {
  /** File extension including the leading dot, e.g. '.ts' */
  extension: string;
  /** Language category for parser routing */
  category: LanguageCategory;
  /** Human readable label, e.g. 'TypeScript' */
  label: string;
  /** Description or parser notes */
  description?: string;
}

/**
 * Built-in file type definitions.
 * Adding a new file type is as simple as adding an entry to this list or registering one dynamically.
 */
export const DEFAULT_FILE_TYPES: FileTypeDefinition[] = [
  // TypeScript
  { extension: '.ts', category: 'typescript', label: 'TypeScript' },
  { extension: '.tsx', category: 'tsx', label: 'TypeScript JSX' },
  { extension: '.mts', category: 'typescript', label: 'TypeScript Module' },
  { extension: '.cts', category: 'typescript', label: 'CommonJS TypeScript' },

  // JavaScript
  { extension: '.js', category: 'javascript', label: 'JavaScript' },
  { extension: '.jsx', category: 'jsx', label: 'JavaScript JSX' },
  { extension: '.mjs', category: 'javascript', label: 'JavaScript Module' },
  { extension: '.cjs', category: 'javascript', label: 'CommonJS' },

  // Styling & Components
  { extension: '.css', category: 'css', label: 'CSS' },
  { extension: '.vue', category: 'vue', label: 'Vue Component' },
  { extension: '.svelte', category: 'svelte', label: 'Svelte Component' },
];

/**
 * List of default extensions supported out-of-the-box.
 */
export const DEFAULT_EXTENSIONS: string[] = DEFAULT_FILE_TYPES.map((f) => f.extension);
