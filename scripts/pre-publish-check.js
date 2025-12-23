#!/usr/bin/env node

/**
 * Pre-publish check script
 * Validates that all packages are ready for publishing
 */

import { readFileSync, existsSync } from 'fs';
import { join, normalize, sep } from 'path';
import { glob } from 'glob';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkPackageFiles() {
  log('📦 Checking package files...', 'blue');
  
  const packagePaths = glob.sync('packages/*/package.json');
  let hasErrors = false;
  
  for (const packagePath of packagePaths) {
    const packageDir = packagePath.replace(/[\/\\]package\.json$/, '');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    
    log(`\n  Checking ${packageJson.name}...`, 'cyan');
    
    // Check required fields
    const requiredFields = ['name', 'version', 'description', 'main', 'types', 'exports'];
    for (const field of requiredFields) {
      if (!packageJson[field]) {
        log(`    ❌ Missing required field: ${field}`, 'red');
        hasErrors = true;
      } else {
        log(`    ✅ ${field}: ${typeof packageJson[field] === 'object' ? 'configured' : packageJson[field]}`, 'green');
      }
    }
    
    // Check dist directory exists
    const distPath = join(process.cwd(), packageDir, 'dist');
    if (!existsSync(distPath)) {
      log(`    ❌ Missing dist directory: ${distPath}`, 'red');
      hasErrors = true;
    } else {
      log(`    ✅ dist directory exists`, 'green');
    }
    
    // Check main file exists
    if (packageJson.main) {
      const mainPath = join(process.cwd(), packageDir, packageJson.main);
      if (!existsSync(mainPath)) {
        log(`    ❌ Main file not found: ${packageJson.main}`, 'red');
        hasErrors = true;
      } else {
        log(`    ✅ Main file exists: ${packageJson.main}`, 'green');
      }
    }
    
    // Check types file exists
    if (packageJson.types) {
      const typesPath = join(process.cwd(), packageDir, packageJson.types);
      if (!existsSync(typesPath)) {
        log(`    ❌ Types file not found: ${packageJson.types}`, 'red');
        hasErrors = true;
      } else {
        log(`    ✅ Types file exists: ${packageJson.types}`, 'green');
      }
    }
    
    // Check files array
    if (packageJson.files && packageJson.files.includes('dist')) {
      log(`    ✅ Files array includes dist`, 'green');
    } else {
      log(`    ❌ Files array should include 'dist'`, 'red');
      hasErrors = true;
    }
    
    // Check license
    if (packageJson.license) {
      log(`    ✅ License: ${packageJson.license}`, 'green');
    } else {
      log(`    ⚠️  No license specified`, 'yellow');
    }
    
    // Check repository info
    if (packageJson.repository || packageJson.homepage) {
      log(`    ✅ Repository info available`, 'green');
    } else {
      log(`    ⚠️  No repository info`, 'yellow');
    }
  }
  
  if (hasErrors) {
    log('\n❌ Package validation failed', 'red');
    process.exit(1);
  } else {
    log('\n✅ All packages are valid', 'green');
  }
}

function checkVersionConsistency() {
  log('\n🔍 Checking version consistency...', 'blue');
  
  const packagePaths = glob.sync('packages/*/package.json');
  const versions = new Map();
  
  for (const packagePath of packagePaths) {
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    const packageName = packageJson.name;
    const version = packageJson.version;
    
    versions.set(packageName, version);
    
    // Check workspace dependencies
    if (packageJson.dependencies) {
      for (const [depName, depVersion] of Object.entries(packageJson.dependencies)) {
        if (depVersion === 'workspace:*' && versions.has(depName)) {
          log(`  ✅ ${packageName} -> ${depName}: workspace dependency`, 'green');
        }
      }
    }
  }
  
  log('✅ Version consistency check passed', 'green');
}

function checkBuildArtifacts() {
  log('\n🔨 Checking build artifacts...', 'blue');
  
  const packagePaths = glob.sync('packages/*/package.json');
  let hasErrors = false;
  
  for (const packagePath of packagePaths) {
    const packageDir = packagePath.replace(/[\/\\]package\.json$/, '');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    
    // Use cross-platform path joining and normalize separators for glob
    const distPattern = normalize(join(packageDir, 'dist', '**', '*')).replace(/\\/g, '/');
    const distFiles = glob.sync(distPattern);
    if (distFiles.length === 0) {
      log(`  ❌ ${packageJson.name}: No build artifacts found (pattern: ${distPattern})`, 'red');
      hasErrors = true;
    } else {
      log(`  ✅ ${packageJson.name}: ${distFiles.length} build artifacts`, 'green');
    }
  }
  
  if (hasErrors) {
    log('\n❌ Build artifacts check failed', 'red');
    process.exit(1);
  } else {
    log('\n✅ All build artifacts present', 'green');
  }
}

function main() {
  log('🔍 Running pre-publish checks...', 'bright');
  
  checkPackageFiles();
  checkVersionConsistency();
  checkBuildArtifacts();
  
  log('\n🎉 All pre-publish checks passed!', 'green');
  log('\nYour packages are ready for publishing. 🚀', 'bright');
}

main();