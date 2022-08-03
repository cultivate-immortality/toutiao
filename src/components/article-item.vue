<!-- 可以复用的组件最好不要发网络请求，写简单的逻辑代码样式就可以了 -->
<template>
  <div>
    <!-- 一条文章单元格 -->
    <van-cell @click="cellClickFn">
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ artObj.title }}</span>
          <!-- 单图 -->
          <img
            class="thumb"
            v-if="artObj.cover.type === 1"
            v-lazy="artObj.cover.images[0]"
          />
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="artObj.cover.type > 1">
          <img
            :key="index"
            class="thumb"
            v-for="(imgUrl, index) in artObj.cover.images"
            v-lazy="imgUrl"
          />
        </div>
      </template>

      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ artObj.aut_name }}</span>
            <span>{{ artObj.comm_count }}评论</span>
            <span>{{ timeAgo(artObj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="display" />
        </div>
      </template>
    </van-cell>

    <!-- 反馈面板 -->
    <van-action-sheet
      :actions="actions"
      @select="onSelect"
      @cancel="onCancel"
      @close="closeFn"
      :cancel-text="cancelText"
      v-model="show"
      get-container="body"
    />
  </div>
</template>

<script>
import { firstActions, secondActions } from '@/api/report'
// 导入的这个方法不可以被Vue直接使用，必须挂载到Vue才可以，因为Vue模板只能使用Vue定义的数据
import { timeAgo } from '@/utils/dayjs'

export default {
  name: 'ArticleItem',

  props: {
    // 文章对象
    artObj: { type: Object },
    display: { type: Boolean, default: true }
  },

  data () {
    return {
      timeAgo: timeAgo,
      show: false, // 控制反馈面板显示隐藏
      actions: firstActions,
      cancelText: '取消' // 底部按钮文字
    }
  },

  methods: {
    // 反馈面板点击事件，点击选项时触发，禁用或加载状态下不会触发
    // 默认情况下点击选项时不会自动收起
    onSelect (action, index) {
      // console.log(action) {name: '反馈垃圾内容'}
      // console.log(index) 索引值
      if (action.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.cancelText = '返回' // 修改底部按钮显示文字
      } else if (action.name === '不感兴趣') {
        this.$emit('dislikeFn', this.artObj.art_id)
        this.show = false // 关闭弹窗
      } else {
        // 这里就是二级反馈
        this.$emit('reportsFn', this.artObj, action.value) // 外面需要反馈类型的值
        this.actions = firstActions
        this.show = false
      }
    },

    // 取消事件
    onCancel () {
      if (this.cancelText === '返回') {
        this.actions = firstActions
        this.cancelText = '取消'
        this.show = true // 点返回不要让弹窗关闭, 点取消文字按钮, 弹窗默认关闭
      }
    },

    // 关闭面板触发事件
    closeFn () {
      this.actions = firstActions
      this.cancelText = '取消'
    },

    // 文章单元格的点击事件
    cellClickFn () {}
  }
}
</script>

<style scoped lang="less">
// 标题样式
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

// label描述样式
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// 文章信息span
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}

// 图片的样式, 矩形黄金比例：0.618
.thumb {
  width: 113px;
  height: 70px;
  object-fit: cover;
  background-color: #f8f8f8;
}

// 三图, 图片容器
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
