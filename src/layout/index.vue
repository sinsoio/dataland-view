<template>
  <div class='app-wrapper'>
    <div class='main-container'>
      <div class='navbar-container'>
        <navbar></navbar>
      </div>
      <div class='app-main' v-if='token'>
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script>
import Navbar from './components/Navbar'
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'
import router from '@/router'

export default {
  components: { Navbar },
  computed: {

    ...mapGetters([
      'token'
    ]),



  },
  data() {
    return {

    }
  },
  mounted() {
    if(!this.token){

      this.$message({
        message: "Please log in",
        type: "error",
      });
    }

  },
  methods: {



  }
}
</script>
<style lang='scss' scoped>


.app-wrapper {
  height: 100%;
  background: #000;


  .main-container {
    width: 100%;
    height: 100%;
    -webkit-transition: margin-left .28s;
    transition: margin-left .28s;
    display: flex;
    flex-direction: column;

    .navbar-container {
      width: 100%;

    }

    .app-main {
      flex: 1;
      overflow: auto;
      min-width: 1200px;
    }

  }
}


</style>
