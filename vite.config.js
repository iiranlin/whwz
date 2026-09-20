import {defineConfig, loadEnv} from 'vite'
import path from 'path'
import fs from 'fs'
import createVitePlugins from './vite/plugins'
import qiankun from 'vite-plugin-qiankun'

const packageJson = require('./package')

// 拦截 element-plus 的 field-registry 模块，替换为补丁版本（注册自定义 date-type-date-range 组件）
const fieldRegistryPatchPlugin = () => {
  const PATCHED_PATH = path.resolve(__dirname, 'src/element-patches/field-registry.mjs')
  return {
    name: 'patch-field-registry',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('element-plus') && id.includes('field-registry') && (id.endsWith('.mjs') || id.endsWith('.js'))) {
        const patched = fs.readFileSync(PATCHED_PATH, 'utf-8')
        return { code: patched, map: null }
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, process.cwd())
  const {VITE_APP_ENV, VITE_PUBLIC_PATH} = env

  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 http://localhost:8080/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 http://localhost:8080/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === "development" ? "/" : VITE_PUBLIC_PATH,
    plugins: [
      fieldRegistryPatchPlugin(),
      createVitePlugins(env, command === 'build'),
      qiankun(packageJson.name, {
        useDevMode: true
      })
    ],
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: 'patch-field-registry-optimize',
            setup(build) {
              const PATCHED_PATH = path.resolve(__dirname, 'src/element-patches/field-registry.mjs')
              build.onLoad({ filter: /field-registry\.(mjs|js)$/ }, (args) => {
                if (args.path.includes('element-plus') && args.path.includes('pro-table')) {
                  const contents = fs.readFileSync(PATCHED_PATH, 'utf-8')
                  return { contents, loader: 'js' }
                }
              })
            }
          }
        ]
      }
    },
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // 打包配置
    build: {
      // https://vite.dev/config/build-options.html
      sourcemap: command === 'build' ? false : 'inline',
      outDir: 'dist',
      assetsDir: 'assets',
      chunkSizeWarningLimit: 2000,
      // lib: {
      //   entry: path.resolve(__dirname, 'src/main.js'), // 入口文件
      //   name: `${packageJson.name}-[name]`,
      //   formats: ['umd'] // 必须是umd格式
      // },
      rollupOptions: {
        output: {
          // 输出 UMD 格式文件
          format: 'umd',
          name: `${packageJson.name}`,
          chunkFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // 全局变量配置
          globals: {
            vue: 'Vue'
          }
        },
        // 排除 vue 外部依赖
        // external: ['vue']
      }
    },
    // vite 相关配置
    server: {
      port: 8001,
      origin: 'http://localhost:8001',
      host: true,
      open: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/api': {
          target: env.VITE_APP_BASE_API,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element/index.scss" as *;`,
        }
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    }
  }
})
