#!/usr/bin/env node

import { spawn } from 'child_process';
import { join } from 'path';

/**
 * Unified CLI for version management operations
 * Wraps Changesets and custom scripts with a consistent interface
 */

const WORKSPACE_ROOT = process.cwd();
const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function showHelp() {
  log('\n🔧 Vite Enhance Kit - Version Manager CLI', 'blue');
  log('='.repeat(50), 'blue');
  log('\nUsage: version-manager <command> [options]', 'cyan');
  log('\nCommands:', 'cyan');
  log('  check      Check version consistency across all packages', 'green');
  log('  sync       Synchronize dependency versions across packages', 'green');
  log('  analyze    Analyze workspace structure and dependencies', 'green');
  log('  status     Show changeset status (pending changes)', 'green');
  log('  add        Add a new changeset (interactive)', 'green');
  log('  version    Apply changesets and update package versions', 'green');
  log('  release    Build and publish packages', 'green');
  log('\nOptions:', 'cyan');
  log('  --dry-run  Show what would be done without making changes', 'yellow');
  log('  --help     Show this help message', 'yellow');
  log('\nExamples:', 'cyan');
  log('  version-manager check', 'yellow');
  log('  version-manager sync --dry-run', 'yellow');
  log('  version-manager version', 'yellow');
  log('  version-manager release', 'yellow');
}

function runScript(scriptPath, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath, ...args], {
      cwd: WORKSPACE_ROOT,
      stdio: 'inherit',
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script exited with code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

function runPnpmScript(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    // On Windows, we need to use pnpm.cmd
    const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
    
    const child = spawn(pnpmCmd, [scriptName, ...args], {
      cwd: WORKSPACE_ROOT,
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`pnpm script exited with code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

async function handleCommand(command, args, options) {
  const isDryRun = options.includes('--dry-run');
  
  try {
    switch (command) {
      case 'check':
        log('🔍 Checking version consistency...', 'blue');
        await runScript(join(WORKSPACE_ROOT, 'scripts/check-versions.js'));
        break;
        
      case 'sync':
        if (isDryRun) {
          log('🔄 [DRY RUN] Would synchronize dependencies...', 'yellow');
          log('Use without --dry-run to apply changes', 'yellow');
        } else {
          log('🔄 Synchronizing dependencies...', 'blue');
          await runScript(join(WORKSPACE_ROOT, 'scripts/sync-dependencies.js'));
        }
        break;
        
      case 'analyze':
        log('📊 Analyzing workspace...', 'blue');
        await runScript(join(WORKSPACE_ROOT, 'scripts/analyze-workspace.js'));
        break;
        
      case 'status':
        log('📋 Checking changeset status...', 'blue');
        await runPnpmScript('changeset:status');
        break;
        
      case 'add':
        log('➕ Adding new changeset...', 'blue');
        await runPnpmScript('changeset');
        break;
        
      case 'version':
        if (isDryRun) {
          log('📦 [DRY RUN] Would update package versions...', 'yellow');
          await runPnpmScript('changeset:status');
        } else {
          log('📦 Updating package versions...', 'blue');
          await runPnpmScript('changeset:version');
          log('✅ Versions updated! Review changes and commit.', 'green');
        }
        break;
        
      case 'release':
        if (isDryRun) {
          log('🚀 [DRY RUN] Would build and publish packages...', 'yellow');
          log('This would run: pnpm build && changeset publish', 'yellow');
        } else {
          log('🚀 Building and publishing packages...', 'blue');
          await runPnpmScript('version:release');
          log('✅ Packages published successfully!', 'green');
        }
        break;
        
      default:
        log(`❌ Unknown command: ${command}`, 'red');
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    log(`❌ Error executing command: ${error.message}`, 'red');
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  const command = args[0];
  const commandArgs = args.slice(1).filter(arg => !arg.startsWith('--'));
  const options = args.filter(arg => arg.startsWith('--'));
  
  await handleCommand(command, commandArgs, options);
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});