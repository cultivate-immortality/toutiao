module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],

  // 组件定制 + 按需加载
  // vant 组件库按需加载是什么意思?
  // 只需要引入某个组件而不是全部, 组件对应样式文件也会自动引入
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        // 指定样式路径
        style: (name) => `${name}/style/less`
      },
      'vant'
    ]
  ]
}
