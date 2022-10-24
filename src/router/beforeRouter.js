import router from './index'
import {getToken} from '@/utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import i18n from '@/lang'

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/dashboard']
router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = i18n.t(`route.${to.meta.title}`);

    if (getToken()) { // determine if there has token
      /* has token*/
      next()
    }else{

      if (whiteList.indexOf(to.path) !== -1) {
        next();


      } else {

        next({path: '/dashboard'})

      }
    }

})

router.afterEach(() => {
  NProgress.done()
})
