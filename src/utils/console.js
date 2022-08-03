if (process.env.NODE_ENV === 'production') {
  console.log = function () {} // 覆盖所有打印语句
  console.warning = function () {} // 覆盖所有警告语句
  console.dir = function () {}
  console.error = function () {}
}
