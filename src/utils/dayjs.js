import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // dayjs默认语言是英文，加载中文语言包
import relativeTime from 'dayjs/plugin/relativeTime' // 相对时间

dayjs.locale('zh-cn') // 使用本地化语言，全局使用
dayjs.extend(relativeTime) // 配置使用处理相对时间的插件

// 函数使用
// dayjs().format('')，dayjs()获取当前最新时间，format('')可以处理时间的格式
export const timeAgo = (value) => dayjs().to(dayjs(value))

/*
过滤器使用
import Vue from 'vue'
Vue.filter('timeAgo', (value) => dayjs().to(dayjs(value)))
*/
