import * as fs from 'node:fs';
import * as path from 'node:path';
import { getPackageJson, getAllDependencies, type PackageJson } from '../shared/package-utils.js';
import { createLogger } from '../shared/logger.js';
import type { EnhanceFeatureConfig, FrameworkType, ProjectType } from '../shared/types/plugin.js';

const logger = createLogger('detectors');

/**
 * Detect framework from config or dependencies
 */
export function detectFramework(
  config: EnhanceFeatureConfig,
  root: string = process.cwd()
): FrameworkType {
  // Check explicit framework config first
  if (config.vue) return 'vue';
  if (config.react) return 'react';
  if (config.svelte) return 'svelte';
  if (config.solid) return 'solid';
  if (config.lit) return 'lit';
  if (config.preact) return 'preact';

  // Try to detect from dependencies
  const deps = getAllDependencies(root);
  
  // Vue detection
  if ('vue' in deps || '@vue/core' in deps) {
    return 'vue';
  }
  
  // React detection (check before Preact)
  if ('react' in deps || 'react-dom' in deps) {
    return 'react';
  }
  
  // Preact detection
  if ('preact' in deps || '@preact/preset-vite' in deps) {
    return 'preact';
  }
  
  // Svelte detection
  if ('svelte' in deps || '@sveltejs/vite-plugin-svelte' in deps) {
    return 'svelte';
  }
  
  // Solid detection
  if ('solid-js' in deps || 'vite-plugin-solid' in deps) {
    return 'solid';
  }
  
  // Lit detection
  if ('lit' in deps || 'lit-element' in deps || 'lit-html' in deps) {
    return 'lit';
  }

  return 'vanilla';
}

/**
 * Check if path points to a library output directory
 */
function isLibraryPath(filePath: string): boolean {
  return (
    filePath.includes('dist/') ||
    filePath.includes('lib/') ||
    filePath.includes('es/') ||
    filePath.includes('cjs/') ||
    filePath.includes('esm/')
  );
}

/**
 * Check if package.json has strong library indicators
 */
function hasStrongLibraryIndicators(pkg: PackageJson): boolean {
  // Check for library entry points - ensure values are strings
  const hasLibraryEntryPoints =
    (typeof pkg.main === 'string' && isLibraryPath(pkg.main)) ||
    (typeof pkg.module === 'string' && isLibraryPath(pkg.module)) ||
    Boolean(pkg.types) ||
    Boolean(pkg.typings);

  // Check for exports field (object structure indicates library, not null)
  const hasExportsField =
    pkg.exports !== undefined &&
    pkg.exports !== null &&
    typeof pkg.exports === 'object';

  return hasLibraryEntryPoints || hasExportsField;
}

/**
 * Check if project has app-specific indicators
 */
function hasAppIndicators(root: string): boolean {
  // Check for HTML entry files
  const htmlFiles = [
    'index.html',
    'public/index.html',
    'src/index.html',
  ];

  for (const htmlFile of htmlFiles) {
    const htmlPath = path.join(root, htmlFile);
    if (fs.existsSync(htmlPath)) {
      return true;
    }
  }

  // Check for common app directories
  const appDirs = ['public', 'assets', 'static'];
  for (const dir of appDirs) {
    const dirPath = path.join(root, dir);
    try {
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        return true;
      }
    } catch {
      // Ignore errors
    }
  }

  return false;
}

/**
 * Detect project preset (app or lib) from package.json and project structure
 */
export function detectPreset(root: string = process.cwd()): ProjectType {
  const pkg = getPackageJson(root);

  if (!pkg) {
    logger.warn('package.json not found, defaulting to app preset');
    return 'app';
  }

  // Check for strong library indicators first
  if (hasStrongLibraryIndicators(pkg)) {
    return 'lib';
  }

  // Check for app indicators
  if (hasAppIndicators(root)) {
    return 'app';
  }

  // Default to 'app' if no clear indicators found
  return 'app';
}

/**
 * Detect if running in a monorepo
 */
export function isMonorepo(root: string = process.cwd()): boolean {
  // Check for pnpm-workspace.yaml
  if (fs.existsSync(path.join(root, 'pnpm-workspace.yaml'))) {
    return true;
  }

  // Check for lerna.json
  if (fs.existsSync(path.join(root, 'lerna.json'))) {
    return true;
  }

  // Check for workspaces in package.json
  const pkg = getPackageJson(root);
  if (pkg?.workspaces) {
    return true;
  }

  return false;
}
