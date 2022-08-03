<template>
  <div>
    <van-nav-bar title="登录" />

    <van-form @submit="onSubmit">
      <!-- 手机号 -->
      <van-field
        v-model="formLogin.mobile"
        type="tel"
        label="手机号"
        placeholder="请输入手机号"
        required
        :rules="[
          {
            required: true,
            message: '请输入正确手机号',
            trigger: 'onBlur',
            pattern: /^1[3456789]\d{9}$/,
          },
        ]"
      />

      <!-- 密码 -->
      <van-field
        v-model="formLogin.code"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
        :rules="[
          {
            required: true,
            message: '请输入6位密码',
            trigger: 'onBlur',
            pattern: /^\d{6}$/,
          },
        ]"
      />

      <!-- 登录 -->
      <div style="margin: 16px">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          :loading="isLoding"
          :disabled="isLoding"
          loading-text="程序员拼命加载ing..."
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api/index'
import { setToken } from '@/utils/token'
import { MyNotify } from '@/ui/Notify.js'
import { setStorage } from '@/utils/storage'
export default {
  name: 'my-login',
  data () {
    return {
      formLogin: {
        code: '246810',
        mobile: '18656801833'
      },
      isLoding: false
    }
  },
  methods: {
    // submit 提交表单且验证通过后触发
    async onSubmit () {
      try {
        this.isLoding = true
        const res = await loginAPI(this.formLogin)
        setToken(res.data.data.token)
        setStorage('refresh_token', res.data.data.refresh_token)
        MyNotify({ type: 'success', message: '登录成功' })
        // 登录成功,跳转路由,跳转一定要写在最后
        this.$router.replace({
          path: this.$route.query.path || '/layout/home'
        })
      } catch (error) {
        MyNotify({ type: 'danger', message: '账号或密码错误' })
      }
      this.isLoding = false // 网络请求完成无论成功/报错, 把状态关掉
    }
  }
}
</script>
