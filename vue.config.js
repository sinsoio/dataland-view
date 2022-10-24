/*

 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-cli3-project-template/vue.config.js
 */
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
let publicPath = '/'

module.exports = {
  publicPath,
  productionSourceMap: false,
  lintOnSave: false, //
  devServer: {
    port: 8889,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API,
        changOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/styles/variables.scss";'
      }
    }
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  configureWebpack: (config) => {
    config['performance'] = {
      //
      maxEntrypointSize: 10000000,
      maxAssetSize: 30000000
    }
  }
}
