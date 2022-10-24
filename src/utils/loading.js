import {Loading} from 'element-ui'

var loading = null ;
const loadingShow = () => {
  loading = Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
}

const loadingHide = () => {
  loading.close();
}

const loadingObj={
  loadingShow,
  loadingHide
}

export default loadingObj
