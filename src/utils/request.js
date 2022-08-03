import axios from 'axios'
import { getToken, removeToken } from '@/utils/token'
import router from '@/router'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})

request.interceptors.request.use(
  (config) => {
    // 如果有token,把token携带在请求头上(表明自己身份)
    // ？.可选链操作符
    if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // 方式一: 用户有感知token过期
      // 注意: 在响应拦截器这里,一定要先清除 token ,再去跳转,因为在路由守卫那里做了限制
      removeToken()
      // 什么情况下需要跳转到登录页？只有身份过期才需要跳转到登录页
      // router.currentRoute相当于this.$route
      // fullPath: 路由对象里完整路由路径#后面的一切
      router.replace(`/login?path=${router.currentRoute.fullPath}`) // 跳转登录页

      /*
      // 方式二: 用户无感知token过期
      const res = await refreshTokenAPI()
      // 新的token回来之后,要做些什么?
      // 1 替换保存到本地新的token
      setToken(res.data.data.token)
      // 2 更新新的token在请求头里
      error.config.headers.Authorization = `Bearer ${res.data.data.token}`
      // 3 未完成的这次请求,再一次发起,return回原本逻辑页面调用的地方,return一个promise对象
      return axios(error.config)
    } else if (
      // 刷新的refresh_token也过期了怎么办?
      error.response.status === 500 &&
      error.config.url === '/v1_0/authorizations' &&
      error.config.method === 'put'
    ) {
      // 1 清除原来的token
      removeToken()
      // 2 清除刷新过来的refresh_token
      localStorage.clear()
      // 3 跳转到登录页
      router.replace('/login')
    }
    */
      return Promise.reject(error)
    }
  }
)

export default request
