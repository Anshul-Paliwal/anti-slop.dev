#!/usr/bin/env node
import { Command } from 'commander';
import { runScanPipeline } from './orchestrator';
import { logger } from './utils/logger';

const program = new Command();

program
  .name('antislop')
  .description('AI Slop Detection & Auto-Remediation Platform for Vibe-Coded Codebases')
  .version('0.1.0');

program
  .command('scan [path]')
  .description('Scan a workspace or file for AI slop')
  .option('-o, --output <file>', 'Output report file path (default: antislop-report.md)')
  .option('-c, --concurrency <number>', 'Number of concurrent worker threads', (val) => parseInt(val, 10))
  .option('-e, --extensions <exts...>', 'Custom file extensions to include (e.g. .ts .tsx .js)')
  .option('--ignore <patterns...>', 'Additional ignore patterns')
  .option('--max-file-size <kb>', 'Maximum file size in KB to analyze (default: 1024)', (val) => parseInt(val, 10))
  .option('--dry-run', 'Run Stage 1 discovery and file inventory without full analysis', false)
  .option('--verbose', 'Show detailed diagnostic timings and worker logs', false)
  .action(async (targetPath = '.', options) => {
    try {
      const result = await runScanPipeline({
        targetPath,
        output: options.output,
        concurrency: options.concurrency,
        includeExtensions: options.extensions,
        ignorePatterns: options.ignore,
        maxFileSizeKb: options.maxFileSize,
        dryRun: options.dryRun,
        verbose: options.verbose || options.dryRun,
      });

      if (!options.dryRun && result.discovery.totalCount > 0) {
        logger.success(`Stage 1 scan complete. ${result.totalProcessedFiles} file(s) ready for analysis.`);
      }
    } catch (err: any) {
      logger.error(err?.message || 'Scan failed with an unknown error');
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
