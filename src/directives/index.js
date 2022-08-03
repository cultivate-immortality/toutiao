/*
插件本质是一个对象
语法：
const obj = {
  为什么要写install?Vue.use()注册的时候需要用到
  install () {}
}
使用插件,执行了对象obj里的install方法
Vue.use(obj)
*/

/*
全局注册自定义指令
Vue.directive('focus', {
  inserted (el) {
    指令所在van-search组件，组件根标签是div，input在内部
    const input = el.querySelector('input')
    input.focus()
  }
})
*/

// 使用插件注册全局自定义指令
export const directiveObj = {
  install (Vue) {
    Vue.directive('focus', {
      // 指令所在标签,被插入到真实DOM时才触发,初始化的时候执行一次
      inserted (el) {
        fn(el)
      },
      // 指令所在标签,被更新时触发
      update (el) {
        fn(el)
      }
    })
  }
}

function fn (el) {
  // 知识点:原生DOM.nodeName可以拿到标签名(注意:是大写的字符串)
  if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
    // 如果直接是input标签/textarea标签
    el.focus()
  } else {
    // 指令在van-search组件身上, 获取的是组件根标签div, 而input在标签内
    const inp = el.querySelector('input')
    const textArea = el.querySelector('textarea')
    // 如果找到了
    // 写法一:
    // if (inp) input.focus()
    // if (textArea) texarea.focus()
    // 写法二:
    if (inp || textArea) {
      inp && inp.focus()
      textArea && textArea.focus()
    } else {
      // 本身也不是, 子标签里也没有
      console.error('请把v-focus用在输入框标签上')
    }
  }
}
