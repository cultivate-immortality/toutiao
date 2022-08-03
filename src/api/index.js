import request from '@/utils/request'
import { getStorage } from '@/utils/storage'

// 用户 - 登录
export const loginAPI = ({ mobile, code }) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile: mobile, code: code }
  })
}

// 用户 - 更新token
export const refreshTokenAPI = () =>
  request({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + getStorage('refresh_token')
    }
  })

// 用户 - 基本资料
export const userInfoAPI = () => {
  return request({
    url: '/v1_0/user'
  })
}

// 用户 - 个人资料(就为了获取生日)
export const userProfileAPI = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}

// 用户 - 更新头像
// 注意: formObj的值必须是一个表单对象new FormData()
// 表单对象格式: '{"a": 10, "b": 20}' 对象格式的JSON字符串
export const updatePhotoAPI = (formObj) => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    // 如果你的请求体内容是表单对象, 浏览器会自动携带请求头Content-Type为multipart/form-data
    data: formObj
  })
}

// 用户 - 更新资料
export const updateProfileAPI = ({ birthday, userName }) => {
  return request({
    url: '/v1_0/user/profile',
    // patch局部更新,put全部更新
    method: 'PATCH',
    data: {
      birthday: birthday,
      name: userName
    }
  })
}

// 频道 - 获取所有频道列表
export const getAllChannelsAPI = () => {
  return request({
    url: '/v1_0/channels'
  })
}

// 频道 - 更新已选
export const updateChannelAPI = ({ channels }) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: { channels: channels }
  })
}

// 频道 - 删除用户指定的频道
export const removeTheChannelAPI = ({ channelId }) =>
  request({
    url: `/v1_0/user/channels/${channelId}`,
    method: 'DELETE'
  })

// 频道 - 用户已选列表
export const userChannelAPI = () =>
  request({
    url: '/v1_0/user/channels'
  })

// 文章 - 获取列表
export const articlesListAPI = ({ channelId, timestamp }) => {
  return request({
    url: '/v1_0/articles',
    params: { channel_id: channelId, timestamp: timestamp }
  })
}

// 文章 - 不感兴趣
export const articleDislikeAPI = ({ target }) => {
  return request({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: { target: target }
  })
}

// 文章 - 举报
export const articleReportsAPI = ({ target, type, remark }) => {
  return request({
    url: '/v1_0/article/reports',
    method: 'POST',

    data: { target: target, type: type, remark: remark }
  })
}

// 文章 - 详情
export const articleDetailAPI = ({ articleId }) => {
  return request({
    // :articleId是后台规定的参数名
    url: `/v1_0/articles/${articleId}`
  })
}

// 文章 - 关注作者
export const followedUserAPI = ({ target }) => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: { target: target }
  })
}
// 文章 - 取消关注作者
export const unFollowedUserAPI = ({ uid }) => {
  return request({
    // 这uid只是个变量名, 把值拼接在url发给后台(无需指定参数名), 路径传参
    url: `/v1_0/user/followings/${uid}`,
    method: 'DELETE'
  })
}

// 文章 - 点赞
export const articleLikeAPI = ({ target }) => {
  return request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: { target: target }
  })
}

// 文章 - 取消点赞
export const articleDisLikeAPI = ({ artId }) => {
  return request({
    url: `/v1_0/article/likings/${artId}`,
    method: 'DELETE'
  })
}

// 搜索 - 联想菜单
export const suggestListAPI = ({ q }) => {
  return request({
    url: '/v1_0/suggestion',
    params: { q: q }
  })
}

// 搜索 - 结果列表
export const searchResultListAPI = ({ q, page = 1 }) => {
  return request({
    url: '/v1_0/search',
    params: { q, page }
  })
}

// 评论 - 获取列表
// axios只针对params参数,如果发现键值对,值为null,会忽略此参数名和值不携带在url?后面
export const commentListAPI = ({ artId, offset = null, limit = 10 }) => {
  return request({
    url: '/v1_0/comments',
    params: {
      type: 'a',
      source: artId,
      offset,
      limit
    }
  })
}

// 评论 - 喜欢
export const commentLikingAPI = ({ comId }) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: comId
    }
  })
}
// 评论-取消喜欢
export const commentDisLikingAPI = ({ comId }) => {
  return request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
  })
}

// 评论 - 发布
export const sendCommentAPI = ({ id, content, artId = null }) => {
  // 1 axios中,data请求体传参,如果值为null是不会忽略这个参数的,也会把参数名和值携带给后台(只有params要null会忽略)
  // 2 形参art_id可选参数,如果逻辑页面是对文章评论,则不需要传递art_id,所以这时内部art_id值为null就证明此次调用,是针对文章评论
  // 3 data请求体对象需要自己处理
  const obj = {
    target: id,
    content: content
  }
  if (artId !== null) {
    // 如果每次有第三个参数,证明是对评论进行回复
    obj.art_id = artId
  }
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}
