<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item  :class="language==='zh'?'select-color':''" command="zh">
        中文
      </el-dropdown-item>
      <el-dropdown-item :class="language==='en'?'select-color':''" command="en">
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import i18n from '@/lang'
import axios from 'axios'
import {$getLang} from "@/api/user"
import {
  mapGetters
} from 'vuex'
export default {
  computed: {
    ...mapGetters(['languageBackstage','language']),
    language() {
      return this.$store.getters.language
    }
  },
  created() {
    if(JSON.stringify(this.languageBackstage)=="{}"){
      this.handleSetLanguage(this.language)
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      let name =  this.$i18n.messages[lang].name;
      let that = this;
      let prefix = process.env.VUE_APP_MODE==='production'?'https://file.xingshuoyun.com':"";
      axios.get(`${prefix}/err/dc/${name}`, {
      }).then(function (response) {
        that.$store.dispatch('app/setLanguageBackstage', response.data)
      }).catch(function (error) {
      })
      this.$store.dispatch('app/setLanguage', lang)
    }
  }
}
</script>
<style scoped lang='scss'>
.select-color{
  color: $selectFont;
}
</style>
