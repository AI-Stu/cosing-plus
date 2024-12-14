import type { PluginOption } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteVueDevTools from 'vite-plugin-vue-isDevTools'
import { visualizer as viteVisualizerPlugin } from 'rollup-plugin-visualizer'
import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer'
import type { ApplicationPluginOptions, ConditionPlugin } from '../types'
import { viteMetadataPlugin } from './inject-metadata'

/**
 * 过滤符合条件的插件
 * @param conditionPlugins
 * @returns PluginOption[]
 */
async function filterConditionPlugins(conditionPlugins: ConditionPlugin[]) {
  const plugins: PluginOption[] = []
  for (const conditionPlugin of conditionPlugins) {
    if (conditionPlugin.condition) {
      const realPlugins = await conditionPlugin.plugins()
      plugins.push(...realPlugins)
    }
  }
  return plugins.flat()
}

/**
 * 通用vite插件
 */
async function loadCommonPlugins(
  options: ApplicationPluginOptions
): Promise<ConditionPlugin[]> {
  const { isDevTools, isInjectMetadata, isBuild, visualizer } = options

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
    // 注入metadata
    {
      condition: isInjectMetadata,
      plugins: async () => [await viteMetadataPlugin()]
    },
    // 【仅开发环境】 vue调试工具
    {
      condition: !isBuild && isDevTools,
      plugins: () => [viteVueDevTools()]
    },
    // 【仅开发环境】 打包后依赖大小、引用关系可视化工具
    {
      condition: isBuild && !!visualizer,
      plugins: () => [<PluginOption>viteVisualizerPlugin({
        filename: './node_modules/.cache/visualizer/stats.html',
        gzipSize: true,
        open: true,
        ...(typeof visualizer === 'object'
          ? {
              ...visualizer
            }
          : {})
      } as PluginVisualizerOptions)]
    }
  ]
}
