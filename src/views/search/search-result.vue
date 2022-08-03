<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>

    <!-- 文章列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
      offset="50"
    >
      <ArticleItem
        v-for="obj in articleList"
        :key="obj.art_id"
        :artObj="obj"
        :display="false"
        @click.native="
          $router.push({ name: 'ArticleDetail', params: { id: obj.art_id } })
        "
      />
    </van-list>
  </div>
</template>

<script>
import { searchResultListAPI } from '@/api/index'
import ArticleItem from '@/components/article-item.vue'
export default {
  name: 'search-result',
  components: { ArticleItem },
  data () {
    return {
      page: 1, // 页码
      articleList: [], // 文章列表
      loading: false, // 加载状态
      finished: false // 全部加载完成状态
    }
  },
  async created () {
    const res = await searchResultListAPI({
      page: this.page,
      q: this.$route.params.kw
    })
    this.articleList = res.data.data.results
  },
  methods: {
    // 触底加载更多
    async onLoad () {
      if (this.articleList.length > 0) {
        this.page++
        const res = await searchResultListAPI({
          page: this.page,
          q: this.$route.params.kw
        })
        if (res.data.data.results.length === 0) {
          // 没有更多数据
          this.finished = true
          return
        }
        this.articleList = [...this.articleList, ...res.data.data.results]
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
