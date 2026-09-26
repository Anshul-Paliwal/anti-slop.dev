import pc from 'picocolors';
import { FileDiscoveryResult } from '@anti-slop/shared';

export const logger = {
  banner() {
    console.log(
      pc.bold(pc.cyan('\n🛡️  AntiSlop.dev')) +
      pc.dim(' — AI Slop Detection & Auto-Remediation Platform\n')
    );
  },

  info(message: string) {
    console.log(pc.blue('ℹ') + ' ' + message);
  },

  success(message: string) {
    console.log(pc.green('✔') + ' ' + pc.bold(message));
  },

  warn(message: string) {
    console.log(pc.yellow('⚠') + ' ' + message);
  },

  error(message: string) {
    console.error(pc.red('✖') + ' ' + pc.bold(message));
  },

  printDiscoverySummary(result: FileDiscoveryResult, concurrency: number) {
    console.log(pc.bold(pc.underline('Stage 1: Workspace Discovery & Scheduling')));
    console.log(
      `  • Files matched:    ${pc.green(pc.bold(result.totalCount.toString()))} files`
    );
    console.log(
      `  • Files ignored:    ${pc.dim(result.ignoredCount.toString())} (via .gitignore / ignore rules)`
    );
    console.log(
      `  • Discovery time:   ${pc.cyan(result.durationMs.toString() + 'ms')}`
    );
    console.log(
      `  • Worker threads:   ${pc.magenta(concurrency.toString())} concurrent workers`
    );

    if (Object.keys(result.extensionBreakdown).length > 0) {
      console.log(`  • Breakdown by extension:`);
      for (const [ext, count] of Object.entries(result.extensionBreakdown)) {
        console.log(`      ${pc.dim(ext.padEnd(8))} ${pc.bold(count.toString())}`);
      }
    }
    console.log('');
  },
};
