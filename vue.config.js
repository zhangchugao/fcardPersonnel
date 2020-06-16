/*
 * @Author: your name
 * @Date: 2019-11-06 09:24:07
 * @LastEditTime: 2020-06-09 15:33:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \FCARD一卡通WAPWeb\vue.config.js
 */
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: false,
    baseUrl: './', // 基本路径
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
    devServer: {
        // 设置主机地址
        // host: 'localhost',
        // 设置默认端口
        port: 8080,
        // 设置代理
        https: true,
        proxy: {
            '/api': {
                // 目标 API 地址
                // target: 'http://192.168.1.90:830',
                target: 'https://yun.pc15.net/',
                // 如果要代理 websockets
                ws: true,
                // 将主机标头的原点更改为目标URL
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
        config.module
            .rule('svg')
            .exclude.add(resolve('./src/icons'))
            .end();

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('./src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
        config.module
            .rule('worker')
            .test(/\.worker\.js$/)
            .use('worker-loader')
            .loader('worker-loader')
            .options({
                publicPath: '/js/workers/',
                inline: true
            })
            .end()
        config.module.rule('js').exclude.add(/\.worker\.js$/)
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
            config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log'];
        }
        // config.module.rules.push({
        //   test: /\.worker.js$/,
        //   use: {
        //     loader: 'worker-loader',
        //     options: { inline: true, name: 'workerName.[hash].js' }
        //   }
        // })
        // require('vux-loader').merge(config, {
        //         options: {},
        //         plugins: ['vux-ui']
        //     })
    },
    css: {
        modules: false,
        extract: false,
        loaderOptions: {
          css: {
            // 这里的选项会传递给 css-loader
          },
          postcss: {
            // 这里的选项会传递给 postcss-loader
            plugins: [
              require('postcss-pxtorem')({
                rootValue: 45,//设置rem根fontsize大小
                propWhiteList: ['*'],//全部样式打包
                // selectorBlackList:['mu-','van-','nav','.AppWarp_conten','.popup_wrap','el-checkbox']//设置忽略的样式
              })
            ]
          }
        }
      }
}