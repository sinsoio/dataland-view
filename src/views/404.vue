<template>
  <div class="errPage-container">
    <el-button icon="arrow-left" class="pan-back-btn" @click="back">
      return
    </el-button>
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h4 class="text-tips">The page you are looking for is missing ...</h4>
        <ul class="list-unstyled">
          <li>You can choose to go:</li>
          <li class="link-type">
            <router-link to="/"> go Home </router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img
          src="@/assets/404.gif"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  methods: {
    //
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
    position: relative;
    right: 200px;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
    margin: 20px 0;
  }
  .text-tips {
    font-size: 26px;
    margin: 30px 0;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
