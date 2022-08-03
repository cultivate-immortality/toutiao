<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list" :class="isShowCmtInput ? 'art-cmt-container-1' : 'art-cmt-container-2'">

      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" offset="50" :immediate-check="false">
        <!-- 评论的 Item 项 -->
        <div class="cmt-item" v-for="obj in commentList" :key="obj.com_id">
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon name="like" size="16" color="red" v-if="obj.is_liking === true" @click="loveFn(true, obj)" />
              <van-icon name="like-o" size="16" color="gray" v-else @click="loveFn(false, obj)" />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">{{ obj.content }}</div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
        </div>
      </van-list>
    </div>

    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShowCmtInput === true">
      <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="isShowCmtInput = false">发表评论</div>
      <div class="icon-box">
        <van-badge :content="totalCount" :max="99">
          <van-icon name="comment-o" size="0.53333334rem" @click="moveFn" />
        </van-badge>
        <van-icon name="star-o" size="0.53333334rem" />
        <van-icon name="share-o" size="0.53333334rem" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea placeholder="友善评论、理性发言、阳光心灵" v-focus @blur=blurFn v-model.trim="comValue" />
      <van-button type="default" :disabled="comValue.length === 0" @click="send">发布</van-button>
    </div>
  </div>
</template>

<script>
import { timeAgo } from '@/utils/dayjs'
import { commentListAPI, commentLikingAPI, commentDisLikingAPI, sendCommentAPI } from '@/api'
export default {
  name: 'CommentList',
  data () {
    return {
      timeAgo: timeAgo,
      commentList: [], // 评论数据
      isShowCmtInput: true,
      totalCount: '', // 评论总数
      comValue: '', // 评论内容
      loading: false, // 底部加载状态
      finished: false, // 底部是否加载完成
      offset: null // 下一页(偏移id), 一定初始值null(第一页不需要传, axios遇到null忽略此参数)
    }
  },
  async created () {
    this.getCommentListFn()
  },
  methods: {
    async getCommentListFn () {
      const res = await commentListAPI({
        artId: this.$route.params.id,
        offset: this.offset // 把offset偏移量带给后台
      })
      // 判断是否还有数据
      if (res.data.data.results.length === 0) {
        this.finished = true
      }
      this.commentList = [...this.commentList, ...res.data.data.results] // 合并数据
      this.totalCount = res.data.data.total_count || '' // 如果无评论数(0), 给空字符串(防止0微标出现)
      this.offset = res.data.data.last_id // 保存起来为了做分页
      // 关闭加载状态
      this.loading = false
    },
    // 加载更多
    onLoad () {
      this.getCommentListFn()
    },
    async loveFn (bool, obj) {
      if (bool === true) {
        // 点了红心
        // 业务 => 取消红心
        // 调接口 => 取消红心
        // 显示 => 灰心
        obj.is_liking = false
        await commentDisLikingAPI({ comId: obj.com_id })
      } else {
        // 点了灰心
        // 业务 => 点亮红心
        // 调接口 => 点亮红心
        // 显示 => 红心
        obj.is_liking = true
        await commentLikingAPI({ comId: obj.com_id })
      }
    },
    // 评论滑动
    moveFn () {
      // 真实DOM都在document(所以不再一个vue文件内), 也是可以获取的
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
      })
    },
    // 发布评论框 - 失去焦点
    // 问题:点击发布按钮,发现点击事件不执行,排除代码问题
    // 原因:高的评论容器,在页面点击发布一瞬间,输入框失去了焦点,被v-if和v-else移除了整个标签
    // 导致点击事件没来得及执行
    // 解决:失去焦点时,变量值在最后执行
    blurFn () {
      setTimeout(() => {
        this.isShowCmtInput = true
      }, 0)
    },
    // 发布评论
    async send () {
      const res = await sendCommentAPI({
        id: this.$route.params.id,
        content: this.comValue
      })
      // 保存新评论对象到数组中
      this.commentList.unshift(res.data.data.new_obj)
      // 数量+1
      this.totalCount++
      // 成功后, 清除输入框内容
      this.comValue = ''
      this.moveFn()
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}

/* 美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
