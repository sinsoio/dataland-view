import Cookies from 'js-cookie'
import { $login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),

  address: localStorage.getItem('address') || '',
  chainCh: ''
}
const mutations = {
  SET_ADDRESS: (state, address) => {
    state.address = address
    localStorage.setItem('address', address)
  },

  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_CHAINCH: (state, token) => {
    state.chainCh = token
  }
}
const actions = {
  setAddress({ commit }, value) {
    commit('SET_ADDRESS', value)
  },
  setChainCh({ commit }, value) {
    commit('SET_CHAINCH', value)
  },
  setInfo({ commit }, data) {
    return new Promise((resolve, reject) => {
      $login(data)
        .then((res) => {
          commit('SET_TOKEN', res)
          setToken(res)
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  //
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
