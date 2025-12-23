#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

/**
 * Version consistency checker for monorepo packages
 * Validates that all packages maintain consistent versions and dependencies
 */

const WORKSPACE_ROOT = process.cwd();
const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function readPackageJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    log(`Error reading ${path}: ${error.message}`, 'red');
    return null;
  }
}

function findPackages() {
  const packagePaths = glob.sync('packages/*/package.json', { cwd: WORKSPACE_ROOT });
  const examplePaths = glob.sync('examples/*/package.json', { cwd: WORKSPACE_ROOT });
  
  return [...packagePaths, ...examplePaths].map(path => {
    const fullPath = join(WORKSPACE_ROOT, path);
    const pkg = readPackageJson(fullPath);
    return pkg ? { path: fullPath, pkg, relativePath: path } : null;
  }).filter(Boolean);
}

function checkVersionConsistency(packages) {
  log('\n📦 Checking version consistency...', 'blue');
  
  const versions = new Map();
  let hasInconsistency = false;

  // Collect all versions
  packages.forEach(({ pkg, relativePath }) => {
    if (!versions.has(pkg.name)) {
      versions.set(pkg.name, []);
    }
    versions.get(pkg.name).push({ version: pkg.version, path: relativePath });
  });

  // Check for inconsistencies
  versions.forEach((entries, packageName) => {
    const uniqueVersions = [...new Set(entries.map(e => e.version))];
    
    if (uniqueVersions.length > 1) {
      hasInconsistency = true;
      log(`❌ ${packageName} has inconsistent versions:`, 'red');
      entries.forEach(({ version, path }) => {
        log(`   ${version} in ${path}`, 'yellow');
      });
    } else {
      log(`✅ ${packageName}: ${uniqueVersions[0]}`, 'green');
    }
  });

  return !hasInconsistency;
}

function checkDependencyConsistency(packages) {
  log('\n🔗 Checking dependency consistency...', 'blue');
  
  const dependencyVersions = new Map();
  let hasInconsistency = false;

  // Collect all dependency versions
  packages.forEach(({ pkg, relativePath }) => {
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies
    };

    Object.entries(allDeps).forEach(([depName, version]) => {
      if (!dependencyVersions.has(depName)) {
        dependencyVersions.set(depName, []);
      }
      dependencyVersions.get(depName).push({ 
        version, 
        path: relativePath, 
        packageName: pkg.name 
      });
    });
  });

  // Check for inconsistencies (excluding workspace:* references)
  dependencyVersions.forEach((entries, depName) => {
    const nonWorkspaceEntries = entries.filter(e => !e.version.startsWith('workspace:'));
    const uniqueVersions = [...new Set(nonWorkspaceEntries.map(e => e.version))];
    
    if (uniqueVersions.length > 1) {
      hasInconsistency = true;
      log(`❌ ${depName} has inconsistent versions:`, 'red');
      nonWorkspaceEntries.forEach(({ version, path, packageName }) => {
        log(`   ${version} in ${packageName} (${path})`, 'yellow');
      });
    } else if (nonWorkspaceEntries.length > 0) {
      log(`✅ ${depName}: ${uniqueVersions[0]}`, 'green');
    }
  });

  return !hasInconsistency;
}

function checkWorkspaceReferences(packages) {
  log('\n🏢 Checking workspace references...', 'blue');
  
  const packageNames = new Set(packages.map(p => p.pkg.name));
  let hasIssues = false;

  packages.forEach(({ pkg, relativePath }) => {
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies
    };

    Object.entries(allDeps).forEach(([depName, version]) => {
      if (packageNames.has(depName)) {
        if (!version.startsWith('workspace:')) {
          hasIssues = true;
          log(`❌ ${pkg.name} should use workspace:* for internal dependency ${depName}`, 'red');
          log(`   Current: ${version} in ${relativePath}`, 'yellow');
        } else {
          log(`✅ ${pkg.name} -> ${depName}: ${version}`, 'green');
        }
      }
    });
  });

  return !hasIssues;
}

function generateReport(packages) {
  log('\n📊 Version Management Report', 'blue');
  log('='.repeat(50), 'blue');
  
  log(`\nTotal packages: ${packages.length}`);
  
  const mainPackages = packages.filter(p => p.relativePath.includes('packages/') || p.relativePath.includes('packages\\'));
  const examplePackages = packages.filter(p => p.relativePath.includes('examples/') || p.relativePath.includes('examples\\'));
  
  log(`Main packages: ${mainPackages.length}`);
  log(`Example packages: ${examplePackages.length}`);
  
  log('\nMain packages:', 'blue');
  mainPackages.forEach(({ pkg, relativePath }) => {
    log(`  ${pkg.name}@${pkg.version} (${relativePath})`);
  });
  
  if (examplePackages.length > 0) {
    log('\nExample packages:', 'blue');
    examplePackages.forEach(({ pkg, relativePath }) => {
      log(`  ${pkg.name}@${pkg.version} (${relativePath})`);
    });
  }
}

async function main() {
  log('🔍 Vite Enhance Kit - Version Consistency Checker', 'blue');
  log('='.repeat(50), 'blue');

  const packages = findPackages();
  
  if (packages.length === 0) {
    log('❌ No packages found!', 'red');
    process.exit(1);
  }

  const versionConsistent = checkVersionConsistency(packages);
  const dependencyConsistent = checkDependencyConsistency(packages);
  const workspaceRefsValid = checkWorkspaceReferences(packages);
  
  generateReport(packages);
  
  const allChecksPass = versionConsistent && dependencyConsistent && workspaceRefsValid;
  
  if (allChecksPass) {
    log('\n✅ All version consistency checks passed!', 'green');
    process.exit(0);
  } else {
    log('\n❌ Version consistency issues found!', 'red');
    log('Run `pnpm version:sync` to fix dependency issues', 'yellow');
    process.exit(1);
  }
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});