<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        @click="$router.back()"
        name="arrow-left"
        color="white"
        size="0.48rem"
        style="padding-left: 14px"
      />
      <!-- 搜索组件 -->
      <van-search
        @input="inputFn"
        @search="searchFn"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        v-focus
        v-model.trim="kw"
      />
    </div>

    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
        :key="index"
        @click="suggestClickFn(str)"
        class="sugg-item"
        v-html="lightFn(str, kw)"
        v-for="(str, index) in suggestList"
      />
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧删除图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="delFn" />
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(str, index) in history"
          :key="index"
          @click="historyClickFn(str)"
          >{{ str }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
// import { debounce } from 'lodash' // lodash 支持按需加载，有利于打包结果优化
import { suggestListAPI } from '@/api'
import { getStorage, setStorage } from '@/utils/storage'
export default {
  name: 'my-search',
  data () {
    return {
      kw: '', // 搜索关键字
      // 防抖处理方式一:
      // 防抖逻辑:延时执行逻辑代码,事件再次触发时,先清除上一个定时器,再重新计时
      // 1:定义一个防抖定时器
      timer: null,
      suggestList: [], // 建议关键字列表
      history: JSON.parse(getStorage('history')) || [] // 搜索历史
    }
  },
  methods: {
    // 输入框内容改变时触发
    inputFn () {
      // 3:当输入框进来的时候,先把上一次的定时器清除掉
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        // 如果输入框没有值的话，防止空内容触发下面逻辑
        this.suggestList = []
      } else {
        // 2:把定时器绑定到timer变量上,为了清除定时器做准备,这里一定要用箭头函数,注意this指向问题
        this.timer = setTimeout(async () => {
          const res = await suggestListAPI({ q: this.kw })
          this.suggestList = res.data.data.options
        }, 300)
      }
    },
    // 封装一个方法，用来处理关键字高亮，使用的时候要使用v-html指令，可以解析标签
    lightFn (val1, val2) {
      // val1要替换的字符；val2要替换关键字
      // replace默认只替换第一个符合条件，replaceAll可以替换全部
      // return val1.replace(val2, `<span style="color: red;">${val2}</span>`)

      // 如果要使用变量，作为正则的匹配条件，不能用语法糖简化写法
      // i忽略大小写，g全局匹配
      const reg = new RegExp(val2, 'ig')
      return val1.replace(reg, (match) => {
        // match输入框里的值
        return `<span style="color: red;">${match}</span>`
      })
    },
    // 输入框的回车事件
    searchFn () {
      if (this.kw.length > 0) {
        // 搜索关键字保存到数组里
        this.history.push(this.kw)
        // 跳转搜索结果页
        // 坑：路由跳转，在watch之前执行，所以需要让路由跳转时来一个定时器包裹
        setTimeout(() => {
          this.$router.push({
            name: 'SearchResult',
            params: { kw: this.kw }
          })
        }, 0)
      }
    },
    // 点击联想菜单文字的事件
    suggestClickFn (str) {
      if (this.kw.length > 0) {
        // 搜索关键字保存到数组里
        this.history.push(str)
        // 跳转到搜索结果页
        // 坑：路由跳转，在watch之前执行，所以需要让路由跳转时来一个定时器包裹
        setTimeout(() => {
          this.$router.push({
            name: 'SearchResult',
            params: { kw: str }
          })
        })
      }
    },
    // 点击搜索历史记录的事件
    historyClickFn (str) {
      // 跳转到搜索结果页
      this.$router.push({
        name: 'SearchResult',
        params: { kw: str }
      })
    },
    // 清楚历史记录
    delFn () {
      this.history = []
    }
  },

  watch: {
    // 侦听历史数据的改变，保存到本地
    history: {
      deep: true,
      handler () {
        // set特点：传入的数组类型，如果有重复元素，会自动清理掉重复元素，返回无重复的set对象
        const obj = new Set(this.history)
        // obj在转回Array数组类型
        const arr = Array.from(obj)
        setStorage('history', JSON.stringify(arr))
      }
    }
    /*
    // 防抖处理方式二：
    kw: {
      // debounce函数
      // 参数一：一个函数；参数二：延迟时间，单位是毫秒；返回值：防抖之后的函数
      handler: debounce(async function (val) {
        // 网络请求的逻辑代码
      }, 300)
    }
    */
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: #007bff;
  // 搜索组件
  .van-search {
    flex: 1;
  }
}

// 搜索建议列表样式
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    line-height: 50px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    // 实现省略号的三行代码
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

// 搜索历史
.search-icon {
  line-height: inherit;
  font-size: 16px;
}
.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    border-radius: 10px;
    padding: 8px 14px;
    margin: 10px 8px 0px 8px;
    font-size: 12px;
    background-color: #efefef;
  }
}
</style>
