import type { ViteDevServer, Plugin as VitePlugin } from 'vite';
import type { ResolvedEnhanceConfig } from './config';
import type { BuildContext } from './hooks';
import type { Logger } from '../logger';
export interface EnhancePlugin {
    name: string;
    version?: string;
    enforce?: 'pre' | 'post';
    apply?: 'serve' | 'build' | 'both';
    configResolved?: (config: ResolvedEnhanceConfig) => void | Promise<void>;
    buildStart?: (context: BuildContext) => void | Promise<void>;
    buildEnd?: (context: BuildContext) => void | Promise<void>;
    configureServer?: (server: ViteDevServer) => void | Promise<void>;
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
export type FrameworkType = 'vue' | 'react' | 'vanilla' | 'unknown';
//# sourceMappingURL=plugin.d.ts.map