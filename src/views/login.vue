<!--
*
* @author （cgt）
* @date 2020/7/30
-->
<template>
  <div class="login">
    <div class="dialog">
      <img class="logo" src="../assets/img-dataland-logo.png" />
      <div class="webls">Welcome to Dataland!</div>
      <h3>Connect your wallet</h3>
      <div class="seleRad">
        <div v-for="item in list" :key="item.name" class="titSel">
          <img :src="item.choise ? choises[1] : choises[0]" />
          <img class="phoneImg" :src="item.img" />
          <p>{{ item.name }}</p>
        </div>
      </div>
      <el-button
        :loading="isLoding"
        class="buttEl"
        type="primary"
        round
        @click="loginCli"
        >Connect</el-button
      >
    </div>
  </div>
</template>

<script>
import { $getRandom } from '@/api/user'
import Web3 from 'web3'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      isLoding: false,
      choises: [
        require('@/assets/img-danxuan-n.png'),
        require('@/assets/img-danxuan.png')
      ],
      list: [
        {
          choise: true,
          name: 'Metamask',
          img: require('@/assets/metamask.png')
        }
      ]
    }
  },
  computed: {},
  methods: {
    async loginCli() {
      this.isLoding = true
      await this.accountConnect()
      let { address } = this.$store.state.user
      let loginInfo = await this.getRandom(address)
      this.$store.dispatch('user/setInfo', loginInfo).then(() => {
        this.$router.replace({ path: '/dashboard' })
        this.$message({
          message: 'login success',
          type: 'success'
        })
      })
    },
    async getRandom(address) {
      let res = await $getRandom({ address })
      let signature = await this.handleSignMessage(address, res)
      if (!res.errorCode) {
        return { address, signature, message: res }
      } else {
        this.isLoding = false
        throw new Error(res.message)
      }
    },
    async handleSignMessage(address, randomField) {
      try {
        return await this.webB3.eth.personal.sign(
          randomField,
          address,
          '' // MetaMask will ignore the password argument here
        )
      } catch (err) {
        this.isLoding = false
        throw new Error(err.message)
      }
    },
    async accountAuthorization() {
      if (!window.ethereum) {
        this.$message.error(
          'Please install the MetaMask wallet plug-in and try again!'
        )
      }
      return await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
    },
    async accountConnect() {
      try {
        let accountList = await this.accountAuthorization()
        this.$store.dispatch('user/setAddress', accountList[0].toLowerCase())
      } catch (err) {
        this.isLoding = false
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          throw new Error('Please connect to MetaMask.')
        } else {
          throw new Error(err.message)
        }
      }
    }
  },
  created() {
    this.webB3 = new Web3(window.ethereum)
  },
  mounted() {}
}
</script>
<style scoped lang="scss">
/* img-sign */
.login {
  width: 100%;
  height: 100vh;
  background: url(../assets/img-sign.png) no-repeat;
  background-size: cover;
  position: relative;

  .dialog {
    position: absolute;
    width: 502px;
    border-radius: 20px;
    background-color: rgba(230, 236, 240, 0.18);
    padding: 30px 50px;
    right: 10vw;
    top: 50%;
    transform: translateY(-50%);
    color: #ffffff;
    .logo {
      width: 200px;
    }
    .webls {
      margin-top: 20px;
      margin-bottom: 50px;
      font-weight: 600;
      font-size: 30px;
    }
    .seleRad {
      margin-top: 20px;
      margin-bottom: 70px;
      border-radius: 10px;
      background-color: rgba(230, 236, 240, 0.2);
      padding: 20px;
      .titSel {
        display: flex;
        align-items: center;
        cursor: pointer;
        .phoneImg {
          width: 28px;
          margin-left: 10px;
          margin-right: 10px;
        }
      }
    }
    .buttEl {
      width: 150px;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
