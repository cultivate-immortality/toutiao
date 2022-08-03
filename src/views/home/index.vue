<template>
  <div>
    <!-- 头部标签 -->
    <van-nav-bar fixed>
      <template #left>
        <img class="logo" :src="imgObj" />
      </template>

      <template #right>
        <!-- 搜索图标 -->
        <van-icon
          name="search"
          size="0.48rem"
          color="#fff"
          @click="$router.push('/search')"
        />
      </template>
    </van-nav-bar>

    <!-- 频道部分 -->
    <van-tabs
      animated
      sticky
      offset-top="1.226667rem"
      v-model="channelId"
      @change="changeFn"
    >
      <!-- 绑定了name会自动同步到v-model上 -->
      <van-tab
        :key="item.id"
        :name="item.id"
        :title="item.name"
        v-for="item in channelList"
      >
        <ArticleList :channelId="channelId" />
      </van-tab>
    </van-tabs>

    <!-- 编辑频道图标 -->
    <van-icon
      name="plus"
      size="0.37333334rem"
      class="moreChannels"
      @click="show = true"
    />

    <!-- 弹出层组件 -->
    <van-popup v-model="show" class="edit_wrap" get-container="body">
      <!-- 弹出层的主体区域 -->
      <!-- v-model会在原地绑定input事件，把接到的值传给channelId这个变量 -->
      <ChannelEidt
        :channelList="channelList"
        :unChannelList="unChannelList"
        @moreEV="moreEV"
        @removeChannelEV="removeChannelEV"
        @closeEV="show = false"
        v-model="channelId"
      />
    </van-popup>
  </div>
</template>

<script>
import logoPng from '@/assets/logo.png' // 唯独js需要导入图片文件（css标签里可以直接使用图片地址）
import ChannelEidt from './channel-edit.vue'
import ArticleList from './components/article-list.vue'
import {
  userChannelAPI,
  getAllChannelsAPI,
  updateChannelAPI,
  removeTheChannelAPI
} from '@/api'
export default {
  name: 'my-home',
  components: { ArticleList, ChannelEidt },
  data () {
    return {
      imgObj: logoPng,
      show: false, // 编辑频道弹出层显示
      channelId: 0, // tab导航激活频道Id，默认是0
      channelList: [], // 用户已选列表
      allChannelList: [], // 所有频道列表
      // 1 频道滚动条位置
      // 1.1 保存每个频道的滚动位置;格式:{推荐频道id: 滚动距离,html频道id: 滚动距离}
      channelScrollTOobj: {}
    }
  },
  async created () {
    // 用户已选列表
    const res = await userChannelAPI()
    this.channelList = res.data.data.channels

    // 所有频道列表
    const res2 = await getAllChannelsAPI()
    this.allChannelList = res2.data.data.channels
  },
  computed: {
    // 把所有频道数组挨个对象取出，去用户已选频道数组里查找，如果找不到，则让filter方法收集到一个新数组里
    unChannelList () {
      const newArr = this.allChannelList.filter((bigObj) => {
        const index = this.channelList.findIndex((smallObj) => {
          return smallObj.id === bigObj.id
        })
        // 如果找到了
        if (index > -1) {
          return false
        } else {
          return true
        }
      })
      return newArr
    }
  },
  methods: {
    // 添加频道

    // 后端接口重新更改了，如果有需要可以这样写
    // 推荐频道不能传递，删除不是推荐频道剩下的频道对象
    // const newArr = this.channelList.filter(obj => obj.id !== 0)
    /* newArr.forEach((obj, index) => {
      delete 对象.属性 可以删除键值对
      delete obj.name
      obj.seq = index
    }) */

    async moreEV (obj) {
      this.channelList.push(obj)
      await updateChannelAPI({ channels: this.channelList })
    },

    // 删除频道
    async removeChannelEV (channelObj) {
      const index = this.channelList.findIndex(
        (obj) => obj.id === channelObj.id
      )
      this.channelList.splice(index, 1)
      await removeTheChannelAPI({ channelId: channelObj.id })
    },

    // 1.2 监听网页的滚动事件
    scrollFn () {
      // 保存当前的滚动位置
      this.$route.meta.scrollT = document.documentElement.scrollTop
      // 1.3 保存当前频道的滚动位置
      this.channelScrollTOobj[this.channelId] =
        document.documentElement.scrollTop
    },

    // 1.4 当tab页面切换时触发,取出来滚动位置进行赋值
    changeFn () {
      // tab切换后,设置滚动条位置
      // tab切换时,这个组件内部,会把切走的容器height设置为0,滚动条因为没有高度回到了顶部
      // 切回来的一瞬间,没有高度,滚动事件从底下上来也被触发了,所以才把数据里设置为0
      // 切换来的一瞬间,高度为0,设置滚动位置也无用
      this.$nextTick(() => {
        document.documentElement.scrollTop =
          this.channelScrollTOobj[this.channelId]
      })
    }
  },
  // 当组件在keep-alice内被切换时,进入组件触发
  activated () {
    // 首页和我的页面切换时,滚动条位置不变
    // window和document监听网页滚动的事件. html标签获取scrollTop,滚动的距离和设置滚动的位置
    window.addEventListener('scroll', this.scrollFn)
    // 立刻设置滚动条位置
    document.documentElement.scrollTop = this.$route.meta.scrollT
  },

  /*
  // 什么时候触发这个钩子函数?有组件缓存,组件被切走了就是失去激活 生命周期方法触发;无组件缓存,组件被切走了,destoryed销毁生命周期方法触发
  // 这里这个步骤是错误的,不可以使用
  deactivated () {
    this.$route.meta.scrollT = document.documentElement.scrollTop // 保存网页的滚动距离
  }
  */

  // 当组件在keep-alive内被切换时,离开组件触发
  // 全局的资源在失焦之后,需要移除掉
  deactivated () {
    window.removeEventListener('scroll', this.scrollFn)
  }
}
</script>

<style lang="less" scoped>
.logo {
  width: 100px;
  height: 30px;
}

/* tab内容距离tab导航的距离 */
/deep/ .van-tabs__content {
  padding-top: 44px;
}

// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}

/* 频道编辑弹出层铺满屏幕 */
.edit_wrap {
  // 如果想给100%，要先给html和body设置100%
  // vw，vh是css3新出的单位，参考浏览器窗口的百分比
  width: 100vw;
  height: 100vh;
}
</style>
