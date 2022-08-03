module.exports = {
  plugins: {
    // postcss: 后处理 css, 编译翻译 css 代码
    // postcss-pxtorem: 把 css 代码里所有 px 计算转换成 rem
    'postcss-pxtorem': {
      // rootValue: 转换px的基准值。
      // 编码时, 一个元素宽是75px，则换成rem之后就是2rem
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
