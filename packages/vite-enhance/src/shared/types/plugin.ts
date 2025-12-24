import type { ViteDevServer, Plugin as VitePlugin } from 'vite';
import type { ResolvedEnhanceConfig } from './config';
import type { BuildContext } from './hooks';
import type { Logger } from '../logger';

export interface EnhancePlugin {
  name: string;
  version?: string;
  enforce?: 'pre' | 'post';
  apply?: 'serve' | 'build' | 'both';
  
  // 生命周期钩子
  configResolved?: (config: ResolvedEnhanceConfig) => void | Promise<void>;
  buildStart?: (context: BuildContext) => void | Promise<void>;
  buildEnd?: (context: BuildContext) => void | Promise<void>;
  configureServer?: (server: ViteDevServer) => void | Promise<void>;
  
  // 返回 Vite 插件
  vitePlugin?: () => VitePlugin | VitePlugin[];
}

export interface PluginContext {
  root: string;
  mode: 'development' | 'production';
  command: 'serve' | 'build';
  projectType: ProjectType;
  framework: FrameworkType;
  logger: Logger;
}

export type ProjectType = 'app' | 'lib' | 'monorepo';
export type FrameworkType = 'vue' | 'react' | 'svelte' | 'solid' | 'lit' | 'preact' | 'vanilla' | 'unknown';