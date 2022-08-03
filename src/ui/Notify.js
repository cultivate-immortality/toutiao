// 基于vant进行二次封装通知的方法

// import { Notify } from 'vant'
import { Toast } from 'vant'
export const MyNotify = ({ type, message }) => {
  if (type === 'danger') {
    Toast({
      type: 'fail',
      message
    })
  } else {
    Toast({
      type,
      message
    })
  }
}
