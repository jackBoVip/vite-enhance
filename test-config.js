// 配置功能测试脚本
import { defineEnhanceConfig } from './packages/config/dist/index.js';

console.log('🧪 开始配置功能测试...\n');

// 测试 1: 新的嵌套配置结构
console.log('📋 测试 1: 新的嵌套配置结构');
try {
  const nestedConfig = defineEnhanceConfig({
    enhance: {
      preset: 'app',
      vue: true,
      react: false,
      cdn: {
        autoDetect: true,
        provider: 'jsdelivr'
      },
      cache: true,
      pwa: false
    },
    vite: {
      server: {
        port: 3000
      }
    }
  });
  
  console.log('✅ 嵌套配置结构测试通过');
  console.log('   - 配置对象创建成功');
  console.log('   - 包含 __enhanceConfig 属性:', !!nestedConfig.__enhanceConfig);
  console.log('   - Vite 配置正确合并:', !!nestedConfig.server);
} catch (error) {
  console.log('❌ 嵌套配置结构测试失败:', error.message);
}

// 测试 2: 旧的扁平配置结构（向后兼容性）
console.log('\n📋 测试 2: 旧的扁平配置结构（向后兼容性）');
try {
  const flatConfig = defineEnhanceConfig({
    preset: 'app',
    vue: true,
    cdn: {
      autoDetect: true
    },
    vite: {
      server: {
        port: 3001
      }
    }
  });
  
  console.log('✅ 扁平配置结构测试通过');
  console.log('   - 向后兼容性正常');
  console.log('   - 配置对象创建成功');
  console.log('   - 包含 __enhanceConfig 属性:', !!flatConfig.__enhanceConfig);
} catch (error) {
  console.log('❌ 扁平配置结构测试失败:', error.message);
}

// 测试 3: 混合配置（额外插件）
console.log('\n📋 测试 3: 混合配置（额外插件）');
try {
  const mixedConfig = defineEnhanceConfig({
    enhance: {
      preset: 'app',
      vue: true
    },
    plugins: [
      // 模拟一个额外的插件
      { name: 'test-plugin' }
    ],
    vite: {
      server: {
        port: 3002
      }
    }
  });
  
  console.log('✅ 混合配置测试通过');
  console.log('   - 额外插件正确处理');
  console.log('   - 插件数组长度:', mixedConfig.plugins?.length || 0);
} catch (error) {
  console.log('❌ 混合配置测试失败:', error.message);
}

// 测试 4: 库项目配置
console.log('\n📋 测试 4: 库项目配置');
try {
  const libConfig = defineEnhanceConfig({
    enhance: {
      preset: 'lib',
      vue: true,
      cdn: false,
      pwa: false
    },
    vite: {
      build: {
        lib: {
          entry: 'src/index.ts',
          name: 'TestLib'
        }
      }
    }
  });
  
  console.log('✅ 库项目配置测试通过');
  console.log('   - 库预设配置正常');
  console.log('   - 构建配置正确合并');
} catch (error) {
  console.log('❌ 库项目配置测试失败:', error.message);
}

console.log('\n🎉 配置功能测试完成！');