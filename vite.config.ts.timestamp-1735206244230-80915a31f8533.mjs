// vite.config.ts
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as process from "node:process";
import { loadEnv } from "file:///E:/zhihuishuijiang/111/cosing-plus-domian/node_modules/.pnpm/vite@5.4.11_@types+node@20.17.6_less@4.2.0_terser@5.36.0/node_modules/vite/dist/node/index.js";
import { defineConfig } from "file:///E:/zhihuishuijiang/111/cosing-plus-domian/online-common/internal/vite-config/dist/index.mjs";
import viteAutoImportPlugin from "file:///E:/zhihuishuijiang/111/cosing-plus-domian/node_modules/.pnpm/unplugin-auto-import@0.16.7_@vueuse+core@10.11.1_vue@3.5.12_typescript@5.5.4___rollup@4.26.0/node_modules/unplugin-auto-import/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///E:/zhihuishuijiang/111/cosing-plus-domian/cosing-plus/vite.config.ts";
var baseSrc = fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url));
var vite_config_default = defineConfig(async (config) => {
  const { mode } = config;
  const env = loadEnv(mode, process.cwd());
  const proxyObj = {};
  if (mode === "development" && env.VITE_APP_BASE_API_DEV && env.VITE_APP_BASE_URL_DEV) {
    proxyObj[env.VITE_APP_BASE_API_DEV] = {
      target: env.VITE_APP_BASE_URL_DEV,
      changeOrigin: true,
      rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API_DEV}`), "")
    };
  }
  return {
    application: {},
    vite: {
      resolve: {
        alias: [
          {
            find: "dayjs",
            replacement: "dayjs/esm"
          },
          // {
          //   find: /^dayjs\/locale/,
          //   replacement: 'dayjs/esm/locale'
          // },
          // {
          //   find: /^dayjs\/plugin/,
          //   replacement: 'dayjs/esm/plugin'
          // },
          {
            find: "vue-i18n",
            replacement: mode === "development" ? "vue-i18n/dist/vue-i18n.esm-browser.js" : "vue-i18n/dist/vue-i18n.esm-bundler.js"
          },
          {
            find: /^ant-design-vue\/es$/,
            replacement: "ant-design-vue/es"
          },
          {
            find: /^ant-design-vue\/dist$/,
            replacement: "ant-design-vue/dist"
          },
          {
            find: /^ant-design-vue\/lib$/,
            replacement: "ant-design-vue/es"
          },
          {
            find: /^ant-design-vue$/,
            replacement: "ant-design-vue/es"
          },
          {
            find: "lodash",
            replacement: "lodash-es"
          },
          {
            find: "@",
            replacement: baseSrc
          },
          {
            find: "~#",
            replacement: resolve(baseSrc, "./enums")
          }
        ]
      },
      plugins: [
        viteAutoImportPlugin({
          imports: ["vue", "vue-router", "vue-i18n", "@vueuse/core", "pinia"],
          dts: "types/auto-imports.d.ts",
          dirs: ["src/stores", "src/composables"]
        })
      ],
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vue: ["vue", "vue-router", "pinia", "vue-i18n", "@vueuse/core"],
              antd: ["ant-design-vue", "@ant-design/icons-vue", "dayjs"]
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
}, "application");
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx6aGlodWlzaHVpamlhbmdcXFxcMTExXFxcXGNvc2luZy1wbHVzLWRvbWlhblxcXFxjb3NpbmctcGx1c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcemhpaHVpc2h1aWppYW5nXFxcXDExMVxcXFxjb3NpbmctcGx1cy1kb21pYW5cXFxcY29zaW5nLXBsdXNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3poaWh1aXNodWlqaWFuZy8xMTEvY29zaW5nLXBsdXMtZG9taWFuL2Nvc2luZy1wbHVzL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJztcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcclxuaW1wb3J0ICogYXMgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnO1xyXG5pbXBvcnQgeyB0eXBlIENvbmZpZ0VudiwgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICdAY29zaW5nL3ZpdGUtY29uZmlnJztcclxuaW1wb3J0IHZpdGVBdXRvSW1wb3J0UGx1Z2luIGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xyXG5cclxuY29uc3QgYmFzZVNyYyA9IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKTtcclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKGFzeW5jIChjb25maWcpID0+IHtcclxuICBjb25zdCB7IG1vZGUgfSA9IGNvbmZpZyBhcyBDb25maWdFbnY7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKTtcclxuICBjb25zdCBwcm94eU9iaiA9IHt9O1xyXG4gIGlmIChtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmIGVudi5WSVRFX0FQUF9CQVNFX0FQSV9ERVYgJiYgZW52LlZJVEVfQVBQX0JBU0VfVVJMX0RFVikge1xyXG4gICAgcHJveHlPYmpbZW52LlZJVEVfQVBQX0JBU0VfQVBJX0RFVl0gPSB7XHJcbiAgICAgIHRhcmdldDogZW52LlZJVEVfQVBQX0JBU0VfVVJMX0RFVixcclxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICByZXdyaXRlOiAocGF0aDogc3RyaW5nKSA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7ZW52LlZJVEVfQVBQX0JBU0VfQVBJX0RFVn1gKSwgJycpXHJcbiAgICB9O1xyXG4gIH1cclxuICByZXR1cm4ge1xyXG4gICAgYXBwbGljYXRpb246IHt9LFxyXG4gICAgdml0ZToge1xyXG4gICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZmluZDogJ2RheWpzJyxcclxuICAgICAgICAgICAgcmVwbGFjZW1lbnQ6ICdkYXlqcy9lc20nXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgLy8ge1xyXG4gICAgICAgICAgLy8gICBmaW5kOiAvXmRheWpzXFwvbG9jYWxlLyxcclxuICAgICAgICAgIC8vICAgcmVwbGFjZW1lbnQ6ICdkYXlqcy9lc20vbG9jYWxlJ1xyXG4gICAgICAgICAgLy8gfSxcclxuICAgICAgICAgIC8vIHtcclxuICAgICAgICAgIC8vICAgZmluZDogL15kYXlqc1xcL3BsdWdpbi8sXHJcbiAgICAgICAgICAvLyAgIHJlcGxhY2VtZW50OiAnZGF5anMvZXNtL3BsdWdpbidcclxuICAgICAgICAgIC8vIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGZpbmQ6ICd2dWUtaTE4bicsXHJcbiAgICAgICAgICAgIHJlcGxhY2VtZW50OiBtb2RlID09PSAnZGV2ZWxvcG1lbnQnID8gJ3Z1ZS1pMThuL2Rpc3QvdnVlLWkxOG4uZXNtLWJyb3dzZXIuanMnIDogJ3Z1ZS1pMThuL2Rpc3QvdnVlLWkxOG4uZXNtLWJ1bmRsZXIuanMnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBmaW5kOiAvXmFudC1kZXNpZ24tdnVlXFwvZXMkLyxcclxuICAgICAgICAgICAgcmVwbGFjZW1lbnQ6ICdhbnQtZGVzaWduLXZ1ZS9lcydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGZpbmQ6IC9eYW50LWRlc2lnbi12dWVcXC9kaXN0JC8sXHJcbiAgICAgICAgICAgIHJlcGxhY2VtZW50OiAnYW50LWRlc2lnbi12dWUvZGlzdCdcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGZpbmQ6IC9eYW50LWRlc2lnbi12dWVcXC9saWIkLyxcclxuICAgICAgICAgICAgcmVwbGFjZW1lbnQ6ICdhbnQtZGVzaWduLXZ1ZS9lcydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGZpbmQ6IC9eYW50LWRlc2lnbi12dWUkLyxcclxuICAgICAgICAgICAgcmVwbGFjZW1lbnQ6ICdhbnQtZGVzaWduLXZ1ZS9lcydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGZpbmQ6ICdsb2Rhc2gnLFxyXG4gICAgICAgICAgICByZXBsYWNlbWVudDogJ2xvZGFzaC1lcydcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGZpbmQ6ICdAJyxcclxuICAgICAgICAgICAgcmVwbGFjZW1lbnQ6IGJhc2VTcmNcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGZpbmQ6ICd+IycsXHJcbiAgICAgICAgICAgIHJlcGxhY2VtZW50OiByZXNvbHZlKGJhc2VTcmMsICcuL2VudW1zJylcclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB2aXRlQXV0b0ltcG9ydFBsdWdpbih7XHJcbiAgICAgICAgICBpbXBvcnRzOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3Z1ZS1pMThuJywgJ0B2dWV1c2UvY29yZScsICdwaW5pYSddLFxyXG4gICAgICAgICAgZHRzOiAndHlwZXMvYXV0by1pbXBvcnRzLmQudHMnLFxyXG4gICAgICAgICAgZGlyczogWydzcmMvc3RvcmVzJywgJ3NyYy9jb21wb3NhYmxlcyddXHJcbiAgICAgICAgfSlcclxuICAgICAgXSxcclxuICAgICAgYnVpbGQ6IHtcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgICAgdnVlOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJywgJ3Z1ZS1pMThuJywgJ0B2dWV1c2UvY29yZSddLFxyXG4gICAgICAgICAgICAgIGFudGQ6IFsnYW50LWRlc2lnbi12dWUnLCAnQGFudC1kZXNpZ24vaWNvbnMtdnVlJywgJ2RheWpzJ11cclxuICAgICAgICAgICAgLy8gbG9kYXNoOiBbJ2xvYWRzaC1lcyddLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBwcm94eToge1xyXG4gICAgICAgICAgLi4ucHJveHlPYmpcclxuICAgICAgICAvLyBbZW52LlZJVEVfQVBQX0JBU0VfQVBJXToge1xyXG4gICAgICAgIC8vICAgdGFyZ2V0OiBlbnYuVklURV9BUFBfQkFTRV9VUkwsXHJcbiAgICAgICAgLy8gLy8gICBcdTU5ODJcdTY3OUNcdTRGNjBcdTY2MkZodHRwc1x1NjNBNVx1NTNFM1x1RkYwQ1x1OTcwMFx1ODk4MVx1OTE0RFx1N0Y2RVx1OEZEOVx1NEUyQVx1NTNDMlx1NjU3MFxyXG4gICAgICAgIC8vIC8vICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgICAvLyAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAvLyAgIHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4ke2Vudi5WSVRFX0FQUF9CQVNFX0FQSX1gKSwgJycpLFxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxufSwgJ2FwcGxpY2F0aW9uJyk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLGVBQWU7QUFDeEIsU0FBUyxxQkFBcUI7QUFDOUIsWUFBWSxhQUFhO0FBQ3pCLFNBQXlCLGVBQWU7QUFDeEMsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTywwQkFBMEI7QUFOMEwsSUFBTSwyQ0FBMkM7QUFRNVEsSUFBTSxVQUFVLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUUvRCxJQUFPLHNCQUFRLGFBQWEsT0FBTyxXQUFXO0FBQzVDLFFBQU0sRUFBRSxLQUFLLElBQUk7QUFDakIsUUFBTSxNQUFNLFFBQVEsTUFBYyxZQUFJLENBQUM7QUFDdkMsUUFBTSxXQUFXLENBQUM7QUFDbEIsTUFBSSxTQUFTLGlCQUFpQixJQUFJLHlCQUF5QixJQUFJLHVCQUF1QjtBQUNwRixhQUFTLElBQUkscUJBQXFCLElBQUk7QUFBQSxNQUNwQyxRQUFRLElBQUk7QUFBQSxNQUNaLGNBQWM7QUFBQSxNQUNkLFNBQVMsQ0FBQyxTQUFpQixLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksSUFBSSxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7QUFBQSxJQUN6RjtBQUFBLEVBQ0Y7QUFDQSxTQUFPO0FBQUEsSUFDTCxhQUFhLENBQUM7QUFBQSxJQUNkLE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxRQUNQLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixhQUFhO0FBQUEsVUFDZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQVNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixhQUFhLFNBQVMsZ0JBQWdCLDBDQUEwQztBQUFBLFVBQ2xGO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sYUFBYTtBQUFBLFVBQ2Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLGFBQWE7QUFBQSxVQUNmO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sYUFBYTtBQUFBLFVBQ2Y7QUFBQSxVQUNBO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixhQUFhO0FBQUEsVUFDZjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE1BQU07QUFBQSxZQUNOLGFBQWE7QUFBQSxVQUNmO0FBQUEsVUFDQTtBQUFBLFlBQ0UsTUFBTTtBQUFBLFlBQ04sYUFBYSxRQUFRLFNBQVMsU0FBUztBQUFBLFVBQ3pDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLHFCQUFxQjtBQUFBLFVBQ25CLFNBQVMsQ0FBQyxPQUFPLGNBQWMsWUFBWSxnQkFBZ0IsT0FBTztBQUFBLFVBQ2xFLEtBQUs7QUFBQSxVQUNMLE1BQU0sQ0FBQyxjQUFjLGlCQUFpQjtBQUFBLFFBQ3hDLENBQUM7QUFBQSxNQUNIO0FBQUEsTUFDQSxPQUFPO0FBQUEsUUFDTCxlQUFlO0FBQUEsVUFDYixRQUFRO0FBQUEsWUFDTixjQUFjO0FBQUEsY0FDWixLQUFLLENBQUMsT0FBTyxjQUFjLFNBQVMsWUFBWSxjQUFjO0FBQUEsY0FDOUQsTUFBTSxDQUFDLGtCQUFrQix5QkFBeUIsT0FBTztBQUFBO0FBQUEsWUFFM0Q7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLE9BQU87QUFBQSxVQUNMLEdBQUc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBUUw7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixHQUFHLGFBQWE7IiwKICAibmFtZXMiOiBbXQp9Cg==
