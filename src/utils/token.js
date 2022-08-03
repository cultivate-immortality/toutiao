const key = 'toutiao-key'

export const getToken = () => localStorage.getItem(key)
export const removeToken = () => localStorage.removeItem(key)
export const setToken = (token) => localStorage.setItem(key, token)
