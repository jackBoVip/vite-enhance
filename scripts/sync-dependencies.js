#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

/**
 * Dependency synchronization script for monorepo packages
 * Ensures all packages use consistent versions for shared dependencies
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

function writePackageJson(path, pkg) {
  try {
    writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    return true;
  } catch (error) {
    log(`Error writing ${path}: ${error.message}`, 'red');
    return false;
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

function collectDependencyVersions(packages) {
  const dependencyVersions = new Map();
  
  packages.forEach(({ pkg }) => {
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies
    };

    Object.entries(allDeps).forEach(([depName, version]) => {
      // Skip workspace references
      if (version.startsWith('workspace:')) return;
      
      if (!dependencyVersions.has(depName)) {
        dependencyVersions.set(depName, new Map());
      }
      
      const versionMap = dependencyVersions.get(depName);
      const count = versionMap.get(version) || 0;
      versionMap.set(version, count + 1);
    });
  });

  return dependencyVersions;
}

function selectPreferredVersions(dependencyVersions) {
  const preferredVersions = new Map();
  
  dependencyVersions.forEach((versionMap, depName) => {
    // Sort versions by usage count (descending) and then by semver (latest first)
    const sortedVersions = Array.from(versionMap.entries())
      .sort((a, b) => {
        // First by count (descending)
        if (b[1] !== a[1]) return b[1] - a[1];
        
        // Then by version (prefer latest)
        return compareVersions(b[0], a[0]);
      });
    
    const preferredVersion = sortedVersions[0][0];
    preferredVersions.set(depName, preferredVersion);
    
    if (sortedVersions.length > 1) {
      log(`📌 ${depName}: selected ${preferredVersion} (used ${sortedVersions[0][1]} times)`, 'blue');
      sortedVersions.slice(1).forEach(([version, count]) => {
        log(`   replacing ${version} (used ${count} times)`, 'yellow');
      });
    }
  });
  
  return preferredVersions;
}

function compareVersions(a, b) {
  // Simple version comparison - in a real implementation, use semver library
  const aParts = a.replace(/[^\d.]/g, '').split('.').map(Number);
  const bParts = b.replace(/[^\d.]/g, '').split('.').map(Number);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;
    
    if (aPart !== bPart) {
      return aPart - bPart;
    }
  }
  
  return 0;
}

function updatePackageDependencies(packages, preferredVersions) {
  let updatedCount = 0;
  const packageNames = new Set(packages.map(p => p.pkg.name));
  
  packages.forEach(({ path, pkg, relativePath }) => {
    let hasChanges = false;
    const newPkg = { ...pkg };
    
    // Update dependencies
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (!newPkg[depType]) return;
      
      Object.entries(newPkg[depType]).forEach(([depName, currentVersion]) => {
        // Handle internal workspace dependencies
        if (packageNames.has(depName) && !currentVersion.startsWith('workspace:')) {
          newPkg[depType][depName] = 'workspace:*';
          hasChanges = true;
          log(`🔗 ${pkg.name}: ${depName} -> workspace:*`, 'green');
        }
        // Handle external dependencies
        else if (preferredVersions.has(depName) && !currentVersion.startsWith('workspace:')) {
          const preferredVersion = preferredVersions.get(depName);
          if (currentVersion !== preferredVersion) {
            newPkg[depType][depName] = preferredVersion;
            hasChanges = true;
            log(`📦 ${pkg.name}: ${depName} ${currentVersion} -> ${preferredVersion}`, 'green');
          }
        }
      });
    });
    
    if (hasChanges) {
      if (writePackageJson(path, newPkg)) {
        updatedCount++;
        log(`✅ Updated ${relativePath}`, 'green');
      } else {
        log(`❌ Failed to update ${relativePath}`, 'red');
      }
    }
  });
  
  return updatedCount;
}

function generateSyncReport(packages, preferredVersions, updatedCount) {
  log('\n📊 Dependency Synchronization Report', 'blue');
  log('='.repeat(50), 'blue');
  
  log(`\nTotal packages: ${packages.length}`);
  log(`Updated packages: ${updatedCount}`);
  log(`Synchronized dependencies: ${preferredVersions.size}`);
  
  if (preferredVersions.size > 0) {
    log('\nPreferred versions:', 'blue');
    Array.from(preferredVersions.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([depName, version]) => {
        log(`  ${depName}: ${version}`);
      });
  }
}

async function main() {
  log('🔄 Vite Enhance Kit - Dependency Synchronizer', 'blue');
  log('='.repeat(50), 'blue');

  const packages = findPackages();
  
  if (packages.length === 0) {
    log('❌ No packages found!', 'red');
    process.exit(1);
  }

  log(`\nFound ${packages.length} packages`);
  
  // Collect and analyze dependency versions
  const dependencyVersions = collectDependencyVersions(packages);
  
  if (dependencyVersions.size === 0) {
    log('✅ No external dependencies to synchronize', 'green');
    process.exit(0);
  }
  
  log(`\nAnalyzing ${dependencyVersions.size} unique dependencies...`);
  
  // Select preferred versions
  const preferredVersions = selectPreferredVersions(dependencyVersions);
  
  // Update package.json files
  log('\n🔄 Updating package.json files...');
  const updatedCount = updatePackageDependencies(packages, preferredVersions);
  
  generateSyncReport(packages, preferredVersions, updatedCount);
  
  if (updatedCount > 0) {
    log('\n✅ Dependency synchronization completed!', 'green');
    log('💡 Run `pnpm install` to update lock files', 'yellow');
  } else {
    log('\n✅ All dependencies are already synchronized!', 'green');
  }
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});