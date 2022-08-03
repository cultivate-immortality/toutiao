// 封装本地存储的方式,整个项目使用localStorage,sessionStorage,cookie只需要改变这里即可
// 封装的目的,为了统一管理,方便以后替换和修改

export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}

export const getStorage = (key) => {
  // 取的时候需要return
  return localStorage.getItem(key)
}

export const removeStorage = (key) => {
  localStorage.removeItem(key)
}
