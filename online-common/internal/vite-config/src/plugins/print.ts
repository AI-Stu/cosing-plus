import type { PluginOption } from 'vite';

import { colors } from '@cosing/node-utils';
import type { PrintPluginOptions } from '../types';

/**
 * 自定义插件
 * @description 用于打印插件配置
 * @returns Promise
 */
export function vitePrintPlugin(options: PrintPluginOptions = {}): PluginOption {
  const { infoMap = {} } = options;

  return {
    configureServer(server) {
      const _printUrls = server.printUrls;
      server.printUrls = () => {
        _printUrls();

        for (const [key, value] of Object.entries(infoMap)) {
          console.log(
            `  ${colors.green('➜')}  ${colors.bold(key)}: ${colors.cyan(value)}`
          );
        }
      };
    },
    enforce: 'pre',
    name: 'vite:print-info'
  };
}
