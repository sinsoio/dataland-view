<template>
  <div class="navbar">
    <div class="navbar-top">
      <div class="logo">
        <img style="width: 174px" src="../../../assets/img-dataland-logo.png" />
      </div>
      <div class="right-menu">
        <div class="user-operation" v-if="token">
          <div class="el-dropdown-link0">
            <img :src="chainIcon" width="30" />
          </div>
        </div>

        <div class="user-operation">
          <div class="el-dropdown-link" @click="login()" v-if="!token">
            <img src="../../../assets/img-wode.png" />
          </div>
          <el-dropdown @command="handleCommand" v-else>
            <span class="el-dropdown-link">
              <img src="../../../assets/img-wode.png" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="address"
                  placement="left"
                >
                  <span>{{ userName }}</span>
                </el-tooltip>
              </el-dropdown-item>
              <el-dropdown-item divided command="loginOut">{{
                $t(`common.LogOut`)
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import LangSelect from '@/components/LangSelect'
import Web3 from 'web3'
import { mapGetters } from 'vuex'

import { $getRandom } from '@/api/user'

export default {
  name: 'index',
  computed: {
    ...mapGetters(['language', 'token', 'address'])
  },
  components: {
    LangSelect
  },
  data() {
    return {
      web3: null,
      isLogin: false,
      userName: '',
      chainIcon: '',

      blockchains: [
        {
          chainId: 8845,
          label: 'Sinso',
          rpcUrl: 'https://data-seed-pressc-1.sinso.io',
          currency: 'SINSO',
          icon: require('../../../assets/sinso_getway.png')
        },
        {
          chainId: 1,
          label: 'Ethereum ',
          rpcUrl: 'https://mainnet.infura.io/v3/',
          currency: 'ETH',
          icon: require('../../../assets/Ethereum.png')
        },
        {
          chainId: 137,
          label: 'Polygon',
          rpcUrl: 'https://polygon-rpc.com',
          currency: 'POLYGON',
          icon: require('../../../assets/Polygon.png')
        }
      ]
    }
  },
  watch: {
    language: {
      handler(newValue, oldValue) {}
    },
    address: {
      handler(newValue, oldValue) {
        this.handleAddress()
      }
    }
  },
  async created() {
    this.handleAddress()
    let networkId = Web3.utils.hexToNumber(
      await window.ethereum.request({ method: 'eth_chainId' })
    )

    this.choiseSel(networkId)
  },
  mounted() {
    var that = this
    window.ethereum.on('chainChanged', function (networkId) {
      that.choiseSel(Web3.utils.hexToNumber(networkId))
    })

    window.ethereum.on('accountsChanged', function (accounts) {
      this.address = accounts[0]
    })
  },
  methods: {
    choiseSel(networkId) {
      this.blockchains.forEach((element) => {
        if (element.chainId == networkId) {
          this.chainIcon = element.icon
          this.$store.dispatch('user/setChainCh', element.rpcUrl)
        }
      })
    },
    generateTitle,
    // ---
    handleAddress() {
      if (this.address) {
        this.userName =
          this.address.substring(0, 4) +
          '...' +
          this.address.substring(this.address.length - 3, this.address.length)
      }
    },
    // getRandom(address) {
    //   return new Promise((resolve, reject) => {
    //     $getRandom({ address }).then(async (res) => {
    //       let signature = await this.handleSignMessage(address, res)
    //       resolve({ address, signature, message: res })
    //     })
    //   })
    // },
    // handleSignMessage(address, randomField) {
    //   return new Promise((resolve, reject) => {
    //     this.web3.eth.personal
    //       .sign(
    //         randomField,
    //         address,
    //         '' // MetaMask will ignore the password argument here
    //       )
    //       .then((res) => {
    //         resolve(res)
    //       })
    //       .catch((err) => {
    //         reject('You need to sign the message to be able to log in.')
    //       })
    //   })
    // },

    // // Sign in
    // login() {
    //   if (window.ethereum) {
    //     // Wake up the wallet

    //     window.ethereum
    //       .enable()
    //       .then(async (res) => {
    //         //
    //         this.web3 = new Web3(window.ethereum)

    //         let coinbase = await this.web3.eth.getCoinbase() // Get the address of node mining reward

    //         if (!coinbase) {
    //           window.alert('Please activate MetaMask first. ')
    //           return
    //         }
    //         let address = coinbase.toLowerCase()
    //         this.$store.dispatch('user/setAddress', address)

    //         console.log(address);

    //         let loginInfo = await this.getRandom(address) // Get random fields and return random fields and signed strings

    //         this.$store.dispatch('user/setInfo', loginInfo).then((res) => {
    //           this.$message({
    //             message: 'login success',
    //             type: 'success'
    //           })
    //           // this.isLogin = true;
    //         })
    //       })

    //       .catch((err) => {
    //         window.alert('You need to allow MetaMask.')
    //       })

    //       this.blockchains.forEach((element) => {
    //       if (element.chainId == window.ethereum.networkVersion) {
    //         this.chainIcon = element.icon
    //       }
    //     })
    //   } else {
    //     window.alert('Please install MetaMask first.')
    //     return
    //   }
    // },

    handleCommand(command) {
      switch (command) {
        case 'loginOut':
          this.$store.dispatch('user/LogOut').then(() => {
            location.reload() // In order to re-instantiate the vue-router object to avoid bugs
          })
          return
        default:
          return
      }
    }
  }
}
</script>

<style scoped lang="scss">
$navbar: 65px;
.navbar {
  width: 100%;
  height: $navbar;
  overflow: hidden;
  position: relative;
  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: linear-gradient(-89deg, #090909, #242424);

  .navbar-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px 0 30px;
    .logo {
    }
    .right-menu {
      display: flex;
      .lang-container {
        height: $navbar;
        display: flex;
        align-items: center;
        margin-right: 20px;
      }
      .user-operation {
        .el-dropdown-link {
          cursor: pointer;
          height: $navbar;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }

        .el-dropdown-link0 {
          height: $navbar;
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
        .dropdown-svg {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}
</style>
