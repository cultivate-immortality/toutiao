<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- offset：滚动条与底部距离小于offset时触发load事件 -->
      <van-list
        :finished="finished"
        :immediate-check="false"
        @load="onLoad"
        v-model="loading"
        finished-text="没有更多了"
        offset="50"
      >
        <!-- 文章列表 -->
        <ArticleItem
          v-for="obj in list"
          :key="obj.art_id"
          :artObj="obj"
          @dislikeFn="dislikeFn"
          @reportsFn="reportsFn"
          @click.native="
            $router.push({ name: 'ArticleDetail', params: { id: obj.art_id } })
          "
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { MyNotify } from '@/ui/Notify.js'
import ArticleItem from '@/components/article-item.vue'
import {
  articlesListAPI,
  articleDislikeAPI,
  articleReportsAPI
} from '@/api/index'
export default {
  name: 'ArticleList',
  components: { ArticleItem },
  props: {
    channelId: { type: Number } // 频道Id
  },
  data () {
    return {
      list: [], // 文章列表
      loading: false, // 底部加载状态
      finished: false, // 数据是否全部加载完成
      timestamp: new Date().getTime(), // 默认第一次请求是当前系统时间
      isLoading: false // 顶部刷新状态
    }
  },
  async created () {
    this.getArticleList()
  },
  methods: {
    async getArticleList () {
      const res = await articlesListAPI({
        channelId: this.channelId,
        timestamp: this.timestamp
      })
      this.list = [...this.list, ...res.data.data.results] // 将两次数据进行合并
      this.timestamp = res.data.data.pre_timestamp // 网页一打开，第一次请求成功之后，返回用于做分页的数据
      this.loading = false // 如果不关闭，底部一直是加载中状态，下次触底不会再触发onLoad
      // 如果数据全部加载完毕，则直接将finished设置成true即可
      if (res.data.data.pre_timestamp === null) {
        this.finished = true
      }
      this.isLoading = false // 顶部加载状态关闭
    },

    // 底部加载
    onLoad () {
      this.getArticleList()
    },

    // 顶部刷新事件方法
    onRefresh () {
      this.nextTime = new Date().getTime()
      this.list = []
      this.getArticleList()
    },

    // 反馈不感兴趣
    async dislikeFn (artId) {
      await articleDislikeAPI({ target: artId })
      MyNotify({ type: 'success', message: '反馈成功' })
    },

    // 反馈(举报)
    async reportsFn (obj, type) {
      try {
        await articleReportsAPI({
          target: obj.art_id,
          type: type,
          remark: '就是其他问题'
        })
        MyNotify({ type: 'success', message: '举报成功' })
      } catch (err) {}
    }
  }
}
</script>
