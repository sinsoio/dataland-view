const getters = {
  sidebar: state => state.app.sidebar,

  token: state => state.user.token,
  address: state => state.user.address,

  language: state => state.app.language,

  languageBackstage: state => state.app.languageBackstage,
}

export default getters
