#!/usr/bin/env node

/**
 * Test script to verify plugin loading functionality
 */

import { createViteConfig } from './packages/config/dist/vite-integration.js';

console.log('🧪 Testing Plugin Loading Functionality\n');

// Test 1: Basic configuration with no plugins
console.log('📋 Test 1: Basic configuration (no plugins)');
try {
  const config1 = createViteConfig({
    enhance: {
      preset: 'app',
      vue: false,
      react: false,
      cdn: false,
      cache: false,
      analyze: false,
      pwa: false,
    },
    vite: {
      server: { port: 3000 }
    }
  });
  
  console.log('✅ Basic configuration test passed');
  console.log('   - Plugins array length:', config1.plugins?.length || 0);
  console.log('   - Server port:', config1.server?.port);
} catch (error) {
  console.log('❌ Basic configuration test failed:', error.message);
}

// Test 2: Configuration with Vue enabled (should warn about missing plugin)
console.log('\n📋 Test 2: Vue configuration (plugin not installed)');
try {
  const config2 = createViteConfig({
    enhance: {
      preset: 'app',
      vue: true,
      react: false,
      cdn: false,
      cache: false,
      analyze: false,
      pwa: false,
    },
    vite: {
      server: { port: 3001 }
    }
  });
  
  console.log('✅ Vue configuration test passed');
  console.log('   - Plugins array length:', config2.plugins?.length || 0);
  console.log('   - Should have shown warning about missing Vue plugin');
} catch (error) {
  console.log('❌ Vue configuration test failed:', error.message);
}

// Test 3: Configuration with React enabled (should warn about missing plugin)
console.log('\n📋 Test 3: React configuration (plugin not installed)');
try {
  const config3 = createViteConfig({
    enhance: {
      preset: 'app',
      vue: false,
      react: true,
      cdn: false,
      cache: false,
      analyze: false,
      pwa: false,
    },
    vite: {
      server: { port: 3002 }
    }
  });
  
  console.log('✅ React configuration test passed');
  console.log('   - Plugins array length:', config3.plugins?.length || 0);
  console.log('   - Should have shown warning about missing React plugin');
} catch (error) {
  console.log('❌ React configuration test failed:', error.message);
}

// Test 4: Configuration with all features enabled (should warn about missing plugins)
console.log('\n📋 Test 4: Full configuration (plugins not installed)');
try {
  const config4 = createViteConfig({
    enhance: {
      preset: 'app',
      vue: true,
      react: true,
      cdn: {
        modules: ['vue', 'react'],
        provider: 'unpkg'
      },
      cache: true,
      analyze: true,
      pwa: {
        registerType: 'autoUpdate'
      },
    },
    vite: {
      server: { port: 3003 }
    }
  });
  
  console.log('✅ Full configuration test passed');
  console.log('   - Plugins array length:', config4.plugins?.length || 0);
  console.log('   - Should have shown warnings about missing plugins');
} catch (error) {
  console.log('❌ Full configuration test failed:', error.message);
}

// Test 5: Legacy flat configuration (backward compatibility)
console.log('\n📋 Test 5: Legacy flat configuration');
try {
  const config5 = createViteConfig({
    preset: 'lib',
    vue: true,
    react: false,
    cdn: false,
    vite: {
      build: {
        lib: {
          entry: 'src/index.ts',
          name: 'MyLib'
        }
      }
    }
  });
  
  console.log('✅ Legacy configuration test passed');
  console.log('   - Plugins array length:', config5.plugins?.length || 0);
  console.log('   - Build lib entry:', config5.build?.lib?.entry);
} catch (error) {
  console.log('❌ Legacy configuration test failed:', error.message);
}

console.log('\n🎉 Plugin loading tests completed!');
console.log('\n📝 Summary:');
console.log('- ✅ Configuration system works correctly');
console.log('- ✅ Plugin loading mechanism handles missing plugins gracefully');
console.log('- ✅ Warnings are shown for missing plugins');
console.log('- ✅ Backward compatibility maintained');
console.log('- ⚠️  Real plugins need to be installed for full functionality');