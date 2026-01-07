#!/usr/bin/env node

/**
 * 将版本号恢复为 catalog 协议引用
 * 在发布后运行此脚本，恢复开发时使用的 catalog: 协议
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import { load } from 'js-yaml';

function restoreCatalogRefs() {
  console.log('🔄 Restoring catalog references from actual versions...');

  // 读取 workspace 配置
  const workspaceConfigPath = join(process.cwd(), 'pnpm-workspace.yaml');
  const workspaceContent = readFileSync(workspaceConfigPath, 'utf8');
  const workspace = load(workspaceContent);

  if (!workspace.catalog) {
    console.log('⚠️ No catalog found in pnpm-workspace.yaml');
    return;
  }

  console.log(`📚 Found ${Object.keys(workspace.catalog).length} catalog entries`);

  // 获取所有包的 package.json 文件
  const packagePaths = glob.sync('packages/*/package.json');

  for (const packagePath of packagePaths) {
    console.log(`\n📦 Processing ${packagePath}...`);

    const packageJsonContent = readFileSync(packagePath, 'utf8');
    let packageJson = JSON.parse(packageJsonContent);

    let modified = false;

    // 处理 dependencies
    if (packageJson.dependencies) {
      for (const [depName, depVersion] of Object.entries(packageJson.dependencies)) {
        if (workspace.catalog[depName] && depVersion === workspace.catalog[depName]) {
          packageJson.dependencies[depName] = 'catalog:';
          console.log(`   ✅ ${depName}: ${depVersion} -> catalog:`);
          modified = true;
        }
      }
    }

    // 处理 devDependencies
    if (packageJson.devDependencies) {
      for (const [depName, depVersion] of Object.entries(packageJson.devDependencies)) {
        if (workspace.catalog[depName] && depVersion === workspace.catalog[depName]) {
          packageJson.devDependencies[depName] = 'catalog:';
          console.log(`   ✅ ${depName}: ${depVersion} -> catalog:`);
          modified = true;
        }
      }
    }

    // 处理 peerDependencies
    if (packageJson.peerDependencies) {
      for (const [depName, depVersion] of Object.entries(packageJson.peerDependencies)) {
        if (workspace.catalog[depName] && depVersion === workspace.catalog[depName]) {
          packageJson.peerDependencies[depName] = 'catalog:';
          console.log(`   ✅ ${depName}: ${depVersion} -> catalog:`);
          modified = true;
        }
      }
    }

    // 如果有修改，写回文件
    if (modified) {
      writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`   📝 Updated ${packagePath}`);
    } else {
      console.log(`   ✅ No catalog: references to restore`);
    }
  }

  console.log('\n✅ Catalog reference restoration completed!');
}

restoreCatalogRefs();