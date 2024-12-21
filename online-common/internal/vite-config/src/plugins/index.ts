import * as process from 'node:process';
import { resolve } from 'node:path';
import type { PluginOption } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import viteVueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import viteVueDevTools from 'vite-plugin-vue-devtools';
import { visualizer as viteVisualizerPlugin } from 'rollup-plugin-visualizer';
import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import viteDtsPlugin from 'vite-plugin-dts';
import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin as viteHtmlPlugin } from 'vite-plugin-html';
import viteCompressPlugin from 'vite-plugin-compression';
import viteUnocssPlugin from 'unocss/vite';
import viteAutoImportPlugin from 'unplugin-auto-import/vite';
import viteComponentsPlugin from 'unplugin-vue-components/vite';
// import viteGenerateConfigPlugin from 'unplugin-config/vite';
import AntdvResolver from 'antdv-component-resolver';

import type { ApplicationPluginOptions, ConditionPlugin, LibraryPluginOptions } from '../types';
import { viteBuildInfoPlugin } from './build-info';
import { viteInjectAppLoadingPlugin } from './app-loading';
import { viteExtraAppConfigPlugin } from './extra-app-config';

/**
 * 过滤符合条件的插件
 * @param conditionPlugins
 * @returns PluginOption[]
 */
async function filterConditionPlugins(conditionPlugins: ConditionPlugin[]) {
  const plugins: PluginOption[] = [];
  for (const conditionPlugin of conditionPlugins) {
    if (conditionPlugin.condition) {
      const realPlugins = await conditionPlugin.plugins();
      plugins.push(...realPlugins);
    }
  }
  return plugins.flat();
}

/**
 * 通用vite插件
 */
async function loadCommonPlugins(
  options: ApplicationPluginOptions
): Promise<ConditionPlugin[]> {
  const {
    devTools,
    buildInfo,
    buildInfoOptions,
    build,
    autoImport,
    visualizer
  } = options;

  return [
    {
      condition: true,
      plugins: () => [
        vue({
          script: {
            defineModel: true
            // propsDestructure: true,
          }
        }),
        vueJsx()
      ]
    },
    {
      condition: buildInfo,
      plugins: () => [
        viteBuildInfoPlugin(buildInfoOptions || {})
      ]
    },
    // 自动引入
    {
      condition: autoImport,
      plugins: () => [viteAutoImportPlugin({
        dts: 'types/auto-imports.d.ts',
        imports: []
      })]
    },
    // 【仅开发环境】 vue调试工具
    {
      condition: !build && devTools,
      plugins: () => [viteVueDevTools()]
    },
    // 【仅生产环境】 打包后依赖大小、引用关系可视化工具
    {
      condition: build && visualizer,
      plugins: () => [<PluginOption>viteVisualizerPlugin({
        filename: './node_modules/.cache/visualizer/stats.html',
        gzipSize: true,
        open: true
      } as PluginVisualizerOptions)]
    }
  ];
}

/**
 * 根据条件获取库类型的vite插件
 */
async function loadLibraryPlugins(
  options: LibraryPluginOptions
): Promise<PluginOption[]> {
  // 单独取，否则commonOptions拿不到
  const build = options.build;
  const { dts, ...commonOptions } = options;
  const commonPlugins = await loadCommonPlugins(commonOptions);
  return await filterConditionPlugins([
    ...commonPlugins,
    {
      condition: build && !!dts,
      plugins: () => [viteDtsPlugin({ logLevel: 'error' })]
    }
  ]);
}
/**
 * 根据条件获取应用类型的vite插件
 */
async function loadApplicationPlugins(
  options: ApplicationPluginOptions
): Promise<PluginOption[]> {
  // 单独取，否则commonOptions拿不到
  const build = options.build;
  const env = options.env;

  const {
    compress,
    compressTypes,
    extraAppConfig,
    html,
    i18n,
    injectAppLoading,
    license,
    nitroMock,
    nitroMockOptions,
    pwa,
    pwaOptions,
    components,
    unocss,
    ...commonOptions
  } = options;

  const commonPlugins = await loadCommonPlugins(commonOptions);

  return await filterConditionPlugins([
    ...commonPlugins,
    // 不刷新页面的情况下动态切换国际化
    {
      condition: i18n,
      plugins: async () => {
        return [
          viteVueI18nPlugin({
            include: resolve(process.cwd(), './src/locales/**')
            // compositionOnly: true,
            // fullInstall: true,
            // runtimeOnly: true
          })
        ];
      }
    },
    // {
    //   condition: nitroMock,
    //   plugins: async () => {
    //     return [await viteNitroMockPlugin(nitroMockOptions)];
    //   }
    // },
    {
      condition: injectAppLoading,
      plugins: async () => [await viteInjectAppLoadingPlugin(!!build, env)]
    },
    // {
    //   condition: license,
    //   plugins: async () => [await viteLicensePlugin()]
    // },
    {
      condition: pwa,
      plugins: () =>
        VitePWA({
          injectRegister: false,
          workbox: {
            globPatterns: []
          },
          ...pwaOptions,
          manifest: {
            display: 'standalone',
            start_url: '/',
            theme_color: '#ffffff',
            ...pwaOptions?.manifest
          }
        })
    },
    {
      condition: components,
      plugins: async () => [
        viteComponentsPlugin({
          resolvers: [AntdvResolver()],
          dts: 'types/components.d.ts',
          dirs: ['src/components']
        })
      ]
    },
    {
      condition: build && compress,
      plugins: () => {
        const compressPlugins: PluginOption[] = [];
        if (compressTypes?.includes('brotli')) {
          compressPlugins.push(
            viteCompressPlugin({
              deleteOriginFile: false,
              ext: '.br',
              algorithm: 'brotliCompress',
              threshold: 1024 * 50
            })
          );
        }
        if (compressTypes?.includes('gzip')) {
          compressPlugins.push(
            viteCompressPlugin({
              deleteOriginFile: false,
              ext: '.gz',
              algorithm: 'gzip',
              threshold: 1024 * 50
            })
          );
        }
        return compressPlugins;
      }
    },
    {
      condition: !!html,
      plugins: () => [viteHtmlPlugin({ minify: true })]
    },
    {
      condition: build && extraAppConfig,
      plugins: async () => [
        await viteExtraAppConfigPlugin({ isBuild: true, root: process.cwd() })
      ]
    },
    {
      condition: unocss,
      plugins: async () => [
        viteUnocssPlugin()
      ]
    }
  ]);
}

export { loadCommonPlugins, loadLibraryPlugins, loadApplicationPlugins, viteDtsPlugin, viteHtmlPlugin };
