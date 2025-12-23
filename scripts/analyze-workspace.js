#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import yaml from 'js-yaml';

/**
 * Workspace analysis tool for monorepo packages
 * Analyzes pnpm workspace structure and generates dependency reports
 */

const WORKSPACE_ROOT = process.cwd();
const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
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

function readWorkspaceConfig() {
  try {
    const workspaceFile = join(WORKSPACE_ROOT, 'pnpm-workspace.yaml');
    const content = readFileSync(workspaceFile, 'utf8');
    return yaml.load(content);
  } catch (error) {
    log(`Error reading workspace config: ${error.message}`, 'red');
    return null;
  }
}

function findPackages() {
  const workspaceConfig = readWorkspaceConfig();
  if (!workspaceConfig || !workspaceConfig.packages) {
    log('No workspace configuration found', 'red');
    return [];
  }

  const allPackages = [];
  
  workspaceConfig.packages.forEach(pattern => {
    const packagePaths = glob.sync(`${pattern}/package.json`, { cwd: WORKSPACE_ROOT });
    packagePaths.forEach(path => {
      const fullPath = join(WORKSPACE_ROOT, path);
      const pkg = readPackageJson(fullPath);
      if (pkg) {
        allPackages.push({
          path: fullPath,
          pkg,
          relativePath: path,
          pattern,
          type: getPackageType(path, pkg)
        });
      }
    });
  });

  return allPackages;
}

function getPackageType(path, pkg) {
  if (path.includes('examples/')) return 'example';
  if (path.includes('packages/plugins/')) return 'plugin';
  if (path.includes('packages/')) return 'core';
  if (pkg.private) return 'private';
  return 'unknown';
}

function buildDependencyGraph(packages) {
  const graph = new Map();
  const packageNames = new Set(packages.map(p => p.pkg.name));
  
  packages.forEach(({ pkg }) => {
    const deps = new Set();
    
    // Collect all dependencies
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies
    };
    
    Object.keys(allDeps).forEach(depName => {
      if (packageNames.has(depName)) {
        deps.add(depName);
      }
    });
    
    graph.set(pkg.name, {
      package: pkg,
      dependencies: deps,
      dependents: new Set()
    });
  });
  
  // Build reverse dependencies
  graph.forEach((node, packageName) => {
    node.dependencies.forEach(depName => {
      if (graph.has(depName)) {
        graph.get(depName).dependents.add(packageName);
      }
    });
  });
  
  return graph;
}

function analyzePackagesByType(packages) {
  const byType = new Map();
  
  packages.forEach(pkg => {
    if (!byType.has(pkg.type)) {
      byType.set(pkg.type, []);
    }
    byType.get(pkg.type).push(pkg);
  });
  
  return byType;
}

function findCircularDependencies(graph) {
  const visited = new Set();
  const recursionStack = new Set();
  const cycles = [];
  
  function dfs(packageName, path = []) {
    if (recursionStack.has(packageName)) {
      const cycleStart = path.indexOf(packageName);
      cycles.push([...path.slice(cycleStart), packageName]);
      return;
    }
    
    if (visited.has(packageName)) return;
    
    visited.add(packageName);
    recursionStack.add(packageName);
    path.push(packageName);
    
    const node = graph.get(packageName);
    if (node) {
      node.dependencies.forEach(depName => {
        dfs(depName, [...path]);
      });
    }
    
    recursionStack.delete(packageName);
  }
  
  graph.forEach((_, packageName) => {
    if (!visited.has(packageName)) {
      dfs(packageName);
    }
  });
  
  return cycles;
}

function generateWorkspaceReport(packages, graph, byType) {
  log('\n📊 Workspace Analysis Report', 'blue');
  log('='.repeat(50), 'blue');
  
  log(`\nTotal packages: ${packages.length}`);
  
  // Package breakdown by type
  log('\nPackage breakdown:', 'cyan');
  byType.forEach((pkgs, type) => {
    log(`  ${type}: ${pkgs.length}`, 'yellow');
    pkgs.forEach(pkg => {
      log(`    - ${pkg.pkg.name} (${pkg.relativePath})`);
    });
  });
  
  // Dependency analysis
  log('\nDependency analysis:', 'cyan');
  const internalDeps = new Map();
  const externalDeps = new Map();
  
  packages.forEach(({ pkg }) => {
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies
    };
    
    Object.entries(allDeps).forEach(([depName, version]) => {
      if (graph.has(depName)) {
        // Internal dependency
        if (!internalDeps.has(depName)) {
          internalDeps.set(depName, []);
        }
        internalDeps.get(depName).push(pkg.name);
      } else {
        // External dependency
        if (!externalDeps.has(depName)) {
          externalDeps.set(depName, new Set());
        }
        externalDeps.get(depName).add(version);
      }
    });
  });
  
  log(`  Internal dependencies: ${internalDeps.size}`);
  internalDeps.forEach((dependents, depName) => {
    log(`    ${depName} <- [${dependents.join(', ')}]`, 'green');
  });
  
  log(`  External dependencies: ${externalDeps.size}`);
  const topExternalDeps = Array.from(externalDeps.entries())
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 10);
  
  topExternalDeps.forEach(([depName, versions]) => {
    const versionList = Array.from(versions).join(', ');
    log(`    ${depName}: ${versionList}`, 'yellow');
  });
  
  // Circular dependencies
  const cycles = findCircularDependencies(graph);
  if (cycles.length > 0) {
    log('\n⚠️  Circular dependencies found:', 'red');
    cycles.forEach((cycle, index) => {
      log(`  ${index + 1}. ${cycle.join(' -> ')}`, 'red');
    });
  } else {
    log('\n✅ No circular dependencies found', 'green');
  }
}

function generateDependencyVisualization(graph) {
  log('\n🔗 Dependency Graph Visualization', 'blue');
  log('='.repeat(50), 'blue');
  
  // Simple text-based visualization
  graph.forEach((node, packageName) => {
    const deps = Array.from(node.dependencies);
    const dependents = Array.from(node.dependents);
    
    log(`\n📦 ${packageName}`, 'cyan');
    
    if (deps.length > 0) {
      log(`  Dependencies (${deps.length}):`, 'yellow');
      deps.forEach(dep => {
        log(`    └─ ${dep}`, 'green');
      });
    }
    
    if (dependents.length > 0) {
      log(`  Dependents (${dependents.length}):`, 'yellow');
      dependents.forEach(dependent => {
        log(`    └─ ${dependent}`, 'magenta');
      });
    }
    
    if (deps.length === 0 && dependents.length === 0) {
      log(`  (No internal dependencies)`, 'yellow');
    }
  });
}

async function main() {
  log('🔍 Vite Enhance Kit - Workspace Analyzer', 'blue');
  log('='.repeat(50), 'blue');

  const packages = findPackages();
  
  if (packages.length === 0) {
    log('❌ No packages found!', 'red');
    process.exit(1);
  }

  log(`\nFound ${packages.length} packages in workspace`);
  
  const graph = buildDependencyGraph(packages);
  const byType = analyzePackagesByType(packages);
  
  generateWorkspaceReport(packages, graph, byType);
  generateDependencyVisualization(graph);
  
  log('\n✅ Workspace analysis completed!', 'green');
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});