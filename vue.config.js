const path = require('path')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // vant组件定制,让 webpack 打包时, less 变量被覆盖
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项
        lessOptions: {
          modifyVars: {
            /*
            直接覆盖变量
            'text-color': '#111',
            'border-color': '#eee',
            */

            /*
            或者可以通过 less 文件覆盖（文件路径为绝对路径）
            不要手动写绝对路径, 用代码来动态获取, 绝对地址
            console.log(__dirname) 当前文件, 所在文件夹的绝对路径
            */
            hack: `true; @import "${path.resolve(
              __dirname,
              'src/styles/vant.less'
            )}";`
          }
        }
      }
    }
  },
  publicPath: './' // 告诉webpack打包的index.html引入其它资源文件以./开头,不要默认/开头

  /*
  webpack开发服务器配置反向代理,做代理转发
  原因：前端 -> 后端接口跨域问题,但是后端既不支持jsonp也不开启cors,前端无法直接请求
  解决: 跨域解决方案第三种,用代理服务器
  使用: webpack开发服务器,默认支持代理转发的功能,但是需要在vue.config.js中设置devServer服务器配置项;axios请求,要请求本地开发服务器相对地址开头
  devServer: {
    // 后端完整接口地址: http://c.m.163.com/nc/article/headline/T1348647853363/0-40.html
    proxy: {
      // 请求相对路径以/api开头的, 才会走这里的配置
      '/api': {
        target: 'http://c.m.163.com', // 要代理的服务器地址,在请求的axios的url前面拼接这个target地址,target+url变成服务器代理请求的完整路径
        changeOrigin: true, // 改变请求来源(欺骗后台你的请求是从http://c.m.163.com)
        pathRewrite: {
          '^/api': '' // 因为真实路径中并没有/api这段, 所以要去掉这段才能拼接正确地址转发请求
        }
      }
    }
  }
  */
})
