import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import vueDevTools from 'vite-plugin-vue-devtools';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or 'modern'
        additionalData: `
          @use "@/styles/variables.scss" as *;
          @use "@/styles/mixin.scss" as *;
        `
      }
    },
    postcss: {
      plugins: [
        {
          postcssPlugin: 'layer-loader',
          AtRule: {
            import: (atRule) => {
              if (atRule.params.includes('element-plus')) {
                atRule.name = 'layer'
                atRule.params = '(element)'
              }
            }
          }
        }
      ]
    }
  },
  assetsInclude: ['**/*.woff', '**/*.ttf', '**/*.eot', '**/*.svg'],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.woff') || assetInfo.name.endsWith('.ttf')) {
            return 'theme/fonts/[name][extname]'
          }
        }
      }
    }
  },
  server: {
    port: 8081
  }
})
