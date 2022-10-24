import Cookies from 'js-cookie'
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus')
      ? !!+Cookies.get('sidebarStatus')
      : false,
    withoutAnimation: false
  },
  language: Cookies.get('language') || 'en',
  languageBackstage: JSON.parse(sessionStorage.getItem('languageBackstage'))
    ? JSON.parse(sessionStorage.getItem('languageBackstage'))
    : {}
}

const mutations = {
  TOGGLE_SIDEBAR: (state, boolean) => {
    state.sidebar.opened = boolean
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    Cookies.set('language', language)
  },

  SET_LANGUAGE_BACKSTAGE: (state, obj) => {
    state.languageBackstage = obj
    sessionStorage.setItem('languageBackstage', JSON.stringify(obj))
  }
}

const actions = {
  toggleSideBar({ commit }, boolean) {
    commit('TOGGLE_SIDEBAR', boolean)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setLanguageBackstage({ commit }, obj) {
    commit('SET_LANGUAGE_BACKSTAGE', obj)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
