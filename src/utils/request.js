import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import i18n from '@/lang'
import load from '@/utils/loading.js'

let loading

function startLoading() {
  loading = Loading.service({
    lock: true,
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() {
  loading.close()
}

let needLoadingRequestCount = 0

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    // _debounce(tryCloseLoading, 300)()
    endLoading()
  }
}

// create an axios instance
const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/api'
      : process.env.VUE_APP_API + '/api', // url = base url + request url
  timeout: 600000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    //
    // config.headers['token'] = 'token'

    if (store.getters.token) {
      if (config.hasOwnProperty('type')) {
        config.headers['Content-Type'] = 'multipart/form-data'
      } else {
        config.headers['Content-Type'] = 'application/json'
      }

      config.headers['Authorization'] = getToken()
    }
    // showFullScreenLoading()
    return config
  },
  (error) => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    tryHideFullScreenLoading()
    const res = response.data
    switch (res.status) {
      case 'ok':
        return res.data || {}

      default:
        if (res.errorCode == 40001) {
          store.dispatch('user/LogOut').then(() => {
            location.reload()
          })
        } else {
          load.loadingHide()
          Message({
            message: res.errorMsg,
            type: 'error',
            duration: 5 * 1000
          })
          return res
        }
    }
  },
  (error) => {
    load.loadingHide()
    Message({
      message: 'The server has made a mistake. Please refresh and try again',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
