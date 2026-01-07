#!/usr/bin/env node

/**
 * Release script for Vite Enhance Kit
 * Handles the complete release process including version management and publishing
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function exec(command, options = {}) {
  log(`> ${command}`, 'cyan');
  try {
    return execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      ...options 
    });
  } catch (error) {
    log(`❌ Command failed: ${command}`, 'red');
    process.exit(1);
  }
}

function checkGitStatus() {
  log('📋 Checking git status...', 'blue');
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      log('❌ Working directory is not clean. Please commit or stash your changes.', 'red');
      log('Uncommitted changes:', 'yellow');
      console.log(status);
      process.exit(1);
    }
    log('✅ Working directory is clean', 'green');
  } catch (error) {
    log('❌ Failed to check git status', 'red');
    process.exit(1);
  }
}

function checkBranch() {
  log('🌿 Checking current branch...', 'blue');
  
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    if (branch !== 'main') {
      log(`❌ You are on branch '${branch}'. Please switch to 'main' branch for release.`, 'red');
      process.exit(1);
    }
    log('✅ On main branch', 'green');
  } catch (error) {
    log('❌ Failed to check current branch', 'red');
    process.exit(1);
  }
}

function runTests() {
  log('🧪 Running tests...', 'blue');
  
  try {
    // Run type checking
    exec('pnpm typecheck');
    
    // Run linting if available
    try {
      exec('pnpm lint');
    } catch (error) {
      log('⚠️  Linting not available, skipping...', 'yellow');
    }
    
    log('✅ All tests passed', 'green');
  } catch (error) {
    log('❌ Tests failed', 'red');
    process.exit(1);
  }
}

function buildPackages() {
  log('🔨 Building all packages...', 'blue');
  
  exec('pnpm clean');
  exec('pnpm build');
  
  log('✅ All packages built successfully', 'green');
}

function createChangeset() {
  log('📝 Creating changeset...', 'blue');
  
  try {
    const status = execSync('pnpm changeset status', { encoding: 'utf8' });
    if (status.includes('No changesets present')) {
      log('⚠️  No changesets found. Creating one now...', 'yellow');
      exec('pnpm changeset');
    } else {
      log('✅ Changesets found', 'green');
    }
  } catch (error) {
    log('❌ Failed to check changeset status', 'red');
    process.exit(1);
  }
}

function versionPackages() {
  log('📦 Versioning packages...', 'blue');
  
  exec('pnpm changeset version');
  
  // Check if there are version changes to commit
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      log('📝 Committing version changes...', 'blue');
      exec('git add .');
      exec('git commit -m "chore: version packages"');
    }
  } catch (error) {
    log('⚠️  No version changes to commit', 'yellow');
  }
  
  log('✅ Packages versioned', 'green');
}

function publishPackages() {
  log('🚀 Publishing packages...', 'blue');
  
  // Build again to ensure latest changes
  exec('pnpm build');
  
  // Publish packages
  exec('pnpm changeset publish');
  
  // Restore catalog references after publishing
  exec('pnpm restore-catalog-refs');
  
  log('✅ Packages published successfully', 'green');
}

function pushToGit() {
  log('📤 Pushing to git...', 'blue');
  
  exec('git push');
  exec('git push --tags');
  
  log('✅ Changes pushed to git', 'green');
}

function showSummary() {
  log('\n🎉 Release completed successfully!', 'green');
  log('\nWhat was done:', 'bright');
  log('  ✅ Checked git status and branch', 'green');
  log('  ✅ Ran tests and type checking', 'green');
  log('  ✅ Built all packages', 'green');
  log('  ✅ Created/updated changesets', 'green');
  log('  ✅ Versioned packages', 'green');
  log('  ✅ Published to npm', 'green');
  log('  ✅ Pushed to git with tags', 'green');
  
  log('\nNext steps:', 'bright');
  log('  📋 Check npm registry for published packages', 'cyan');
  log('  🔗 Create GitHub release from the new tags', 'cyan');
  log('  📢 Announce the release to your team/community', 'cyan');
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  
  log('🚀 Starting Vite Enhance Kit release process...', 'bright');
  
  if (isDryRun) {
    log('🔍 Running in dry-run mode (no actual publishing)', 'yellow');
  }
  
  // Pre-flight checks
  checkGitStatus();
  checkBranch();
  
  // Run tests
  runTests();
  
  // Build packages
  buildPackages();
  
  if (!isDryRun) {
    // Create changeset if needed
    createChangeset();
    
    // Version packages
    versionPackages();
    
    // Publish packages
    publishPackages();
    
    // Push to git
    pushToGit();
    
    // Show summary
    showSummary();
  } else {
    log('✅ Dry run completed successfully', 'green');
    log('Run without --dry-run to actually publish', 'yellow');
  }
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  log(`❌ Uncaught exception: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log(`❌ Unhandled rejection: ${reason}`, 'red');
  process.exit(1);
});

main().catch((error) => {
  log(`❌ Release failed: ${error.message}`, 'red');
  process.exit(1);
});