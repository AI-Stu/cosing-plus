/// <reference types="vitest" />
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as process from 'node:process';
import { type ConfigEnv, loadEnv } from 'vite';
import { defineConfig } from '@cosing/vite-config';
import viteAutoImportPlugin from 'unplugin-auto-import/vite';

const baseSrc = fileURLToPath(new URL('./src', import.meta.url));
// https://vitejs.dev/config/
export default defineConfig(async (config) => {
  const { mode } = config as ConfigEnv;
  const env = loadEnv(mode, process.cwd());
  const proxyObj = {};
  if (mode === 'development' && env.VITE_APP_BASE_API_DEV && env.VITE_APP_BASE_URL_DEV) {
    proxyObj[env.VITE_APP_BASE_API_DEV] = {
      target: env.VITE_APP_BASE_URL_DEV,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API_DEV}`), '')
    };
  }
  return {
    application: {
      buildInfoOptions: {
        configureServerOptions: {
          '接口文档地址': 'http://150.158.76.216:8085/doc.html#/home'
        }
      }
    },
    vite: {
      resolve: {
        alias: [
          {
            find: 'dayjs',
            replacement: 'dayjs/esm'
          },
          {
            find: 'vue-i18n',
            replacement: mode === 'development' ? 'vue-i18n/dist/vue-i18n.esm-browser.js' : 'vue-i18n/dist/vue-i18n.esm-bundler.js'
          },
          {
            find: /^ant-design-vue\/es$/,
            replacement: 'ant-design-vue/es'
          },
          {
            find: /^ant-design-vue\/dist$/,
            replacement: 'ant-design-vue/dist'
          },
          {
            find: /^ant-design-vue\/lib$/,
            replacement: 'ant-design-vue/es'
          },
          {
            find: /^ant-design-vue$/,
            replacement: 'ant-design-vue/es'
          },
          {
            find: 'lodash',
            replacement: 'lodash-es'
          },
          {
            find: '@',
            replacement: baseSrc
          },
          {
            find: '~#',
            replacement: resolve(baseSrc, './enums')
          }
        ]
      },
      plugins: [
        viteAutoImportPlugin({
          imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/core', 'pinia'],
          dts: 'types/auto-imports.d.ts',
          dirs: ['src/stores', 'src/composables']
        })
      ],
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
              antd: ['ant-design-vue', '@ant-design/icons-vue', 'dayjs']
            // lodash: ['loadsh-es'],
            }
          }
        }
      },
      server: {
        proxy: {
          ...proxyObj
        // [env.VITE_APP_BASE_API]: {
        //   target: env.VITE_APP_BASE_URL,
        // //   如果你是https接口，需要配置这个参数
        // //   secure: false,
        //   changeOrigin: true,
        //   rewrite: path => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ''),
        // },
        }
      }
    }
  };
}, 'application');
