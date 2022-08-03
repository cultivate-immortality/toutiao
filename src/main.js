import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible' // 引入flexible.js,根据网页宽度,设置 html 的 font-size(移动适配)
import { directiveObj } from '@/directives/index' // 引入自定义指令
import '@/vant-components/index' // vant组件注册, 单独的分离成一个js文件, 让main.js更清晰
import 'highlight.js/styles/default.css' // 代码高亮的样式
import '@/utils/console' // 去掉打印语句
Vue.use(directiveObj) // 执行目标对象里install方法并传入Vue类
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

/*
import axios from 'axios'
axios({
  url: '/api/nc/article/headline/T1348647853363/0-40.html'
  // url: 'http://c.m.163.com/nc/article/headline/T1348647853363/0-40.html'
}).then((res) => {
  console.log(res)
})
*/

/*
环境变量

1
开发环境,生产环境,是两个不同的环境
开发环境需要console.log
生产环境不需要console.log
如何让一套代码,在两个环境自动生效?
nodejs打包时执行main.js代码,node内全局内置变量process(固定写法)
在main.js中打印console.log(process.env)读取的是.env.里的文件

2
服务器根目录下,可以新建环境变量配置文件(文件名固定),.env.production,.env.development,
是脚手架环境webpack内置配好的,文件名也可以修改,但是需要配置,请百度

3
环境变量文件中,定义变量名NODE_ENV(固定写法)或者自定义变量名VUE_APP_开头(固定写法),
两个环境变量中key名必须一致,会自动匹配环境变量值

4
yarn serve启动项目,.env.development内变量挂载到process.env属性上
yarn build打包项目,.env.production内变量挂载到process.env属性上
*/

/*
项目打包

运行 yarn build打包命令,产生dist文件,src下跟mian.js有引入关系的打包输出到dist下
尝试用vscode中LiveServer网页运行插件,内置启动5500网页浏览服务
LiveServer插件会把工作区vscode编辑器根目录当做服务器根目录
问题:打开的index.html网页空白,控制台全是404错误
原因:打包时,webpack在index.html中引入其它的打包文件路径全是服务器根路径请求
运行时,是在5500端口下运行,服务器根目录没有css和js文件夹,而是在index.html文件的隔壁相对路径
解决:让webpack打包时,引入其它文件要以./开头,而不能以/开头.在vue.config.js配置项目中,加入publicPath: './'
打包后观察index.html中./被默认省略了
最后,只需要把dist文件夹,发送给后端/运维(专门管服务器的),上线部署
*/

/*
打包后跨域问题

情况1:后端直接开启了cors
开发环境,生产打包环境,项目部署环境,都可以直接访问接口,无需考虑跨域问题
隐患:后端接口暴露了,任何人都可以直接请求,有风险
解决:需要登录+token调用接口

情况2:后端不开启cors
开发环境:webpack开发服务器做代理转发
开发环境:nodejs+express在本地搭建一个服务器做代理转发
生产环境:
解决方案1:把自己搭建的nodejs+webpack在本地搭建的代理服务器和dist一起部署到一个云服务器上,前端dist -> nodejs+express服务器地址 -> 请求真正的后台接口
解决方案2:dist和公司的后台接口服务,直接放在一个云服务器上避免跨域访问
*/
