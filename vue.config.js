module.exports = {
  runtimeCompiler: true,
  lintOnSave: false,
  chainWebpack: config => {
    // 线上环境
    config.when(process.env.NODE_ENV == "production", config => {
      config.entry('app').clear().add('./src/main-prod.js')
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor',
      })

      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    //开发环境
    config.when(process.env.NODE_ENV == "development", config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  },
  devServer: {
    proxy: {
      '/api/v1': {
        target: 'http://ydkp.ekola.cn/api/v1/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api/v1": '',
        }
      }
    }
  }
}