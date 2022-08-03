<template>
  <div>
    <!-- 别忘了路由给挂载点, 在 App.vue 中 -->
    <!-- 有些一级路由的页面无需缓存,用exclude包裹 -->
    <keep-alive exclude="my-search,search-result,article-detail,user-edit">
      <RouterView />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
