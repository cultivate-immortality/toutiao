import Vue from 'vue'
import {
  Divider,
  NavBar,
  Form,
  Field,
  Button,
  Tabbar,
  TabbarItem,
  Icon,
  Tab,
  Tabs,
  Cell,
  List,
  PullRefresh,
  ActionSheet,
  Popup,
  Row,
  Col,
  Badge,
  Search,
  Tag,
  CellGroup,
  Image,
  Dialog,
  DatetimePicker,
  Loading,
  Lazyload
} from 'vant'

Vue.use(Divider)
Vue.use(Badge)
Vue.use(Row)
Vue.use(Col)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)
Vue.use(Button)
Vue.use(Cell)
Vue.use(Search)
Vue.use(Tag)
Vue.use(CellGroup)
Vue.use(Image)
Vue.use(Dialog)
Vue.use(DatetimePicker)
Vue.use(Loading)
Vue.use(Lazyload, {
  preLoad: 0.8, // 屏幕高度的范围百分比0-1,文档里单词写错了
  // 懒加载图片失败,使用错误提示图片,404
  error:
    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01545d58d24b61a801219c77a15519.png%401280w_1l_2o_100sh.png&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660967766&t=068cb295b20d291c57f86a2829c5c3dd'
})
