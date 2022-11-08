<template>
  <div class="nftDetail">
    <public-dialog
      ref="publicDialog"
      :width="1110"
      :dialog-title="dialogTitle"
      @confirmFun="confirmFun"
      :title-show="false"
      :footer-show="false"
      @close="close"
    >
      <template slot="content">
        <el-skeleton class="base-info" :loading="loading">
          <template slot="template">
            <div class="info-left">
              <el-skeleton-item variant="image" class="info-img" />
              <el-skeleton-item class="info-icon" variant="h1" />
            </div>
            <div class="info-right">
              <el-skeleton-item
                class="info-text"
                variant="h1"
                :key="index"
                v-for="(item, index) in 10"
              ></el-skeleton-item>
            </div>
          </template>

          <div class="info-left">
            <div class="info-img">
              <video
                v-if="nftDetail.nftFormat.indexOf('video') > -1"
                :src="nftDetail.imageUrl"
                autoplay
                loop
                controls="controls"
                controlslist="nodownload  noplaybackrate noremoteplayback"
                :disablePictureInPicture="true"
                style="width: 470px; height: 470px"
              ></video>

              <div v-else-if="nftDetail.nftFormat.indexOf('audio') > -1">
                <img
                  src="@/assets/img-mp3-bg.png"
                  alt=""
                  width="470px"
                  height="420px"
                />

                <div>
                  <video
                    class="video"
                    :src="nftDetail.imageUrl"
                    autoplay
                    loop
                    controls="controls"
                    controlslist="nodownload  noplaybackrate noremoteplayback"
                    :disablePictureInPicture="true"
                    style="width: 470px; height: 50px"
                  ></video>
                </div>
              </div>

              <el-image
                ref="previewImage"
                v-else-if="
                  nftDetail.nftFormat.indexOf('image') > -1 ||
                  nftDetail.nftFormat.indexOf('unknown') > -1
                "
                :src="nftDetail.imageUrl"
                :preview-src-list="[nftDetail.imageUrl]"
                fit="contain"
                style="width: 470px; height: 470px"
              >
                <div slot="placeholder" class="img-placeholder">
                  <img src="@/assets/img-zhanwei.png" />
                </div>

                <div slot="error" class="img-error">
                  <img src="@/assets/img-zhanwei.png" />
                </div>
              </el-image>
              <div v-else>
                <div
                  id="ThreeContainer"
                  style="width: 470px; height: 460px"
                ></div>
                <div class="speed" v-if="percentage > 1 || percentage < 100">
                  <div class="speIng" :style="`width:${percentage}%`">
                    <p><i></i></p>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-icon">
              <img :src="imgArr[nftDetail.chain]" />
              <img v-if="nftDetail.created" src="@/assets/img-Created.png" />
              <img
                v-if="nftDetail.collected"
                src="@/assets/img-collected.png"
              />
              <img
                v-if="nftDetail.favorited"
                src="@/assets/img-Favorited.png"
              />
              <img
                v-if="nftDetail.manuallyClick"
                src="@/assets/sinso_getway.png"
              />
            </div>
          </div>
          <div class="info-right">
            <div class="info-text">
              <span class="title">Blockchain：</span>
              <span class="cont">{{ nftDetail.chain }}</span>
            </div>
            <div class="info-text">
              <span class="title">NFT Name：</span>
              <span class="cont">{{ nftDetail.nftName }}</span>
            </div>
            <div class="info-text">
              <span class="title">NFT Standerd：</span>
              <span class="cont">{{ nftDetail.nftStanderd }}</span>
            </div>
            <div class="info-text">
              <span class="title">NFT Contract：</span>
              <span class="cont">{{ nftDetail.nftContract }}</span>
            </div>
            <div class="info-text">
              <span class="title">NFT ID：</span>
              <span class="cont">{{ nftDetail.nftId }}</span>
            </div>
            <div class="info-text">
              <span class="title">NFT Creater：</span>
              <span class="cont">{{ nftDetail.nftCreater }}</span>
            </div>
            <div class="info-text">
              <span class="title">NFT Owner：</span>
              <span class="cont">{{ nftDetail.nftHolder }}</span>
            </div>
            <div class="info-text">
              <span class="title">Minting Date：</span>
              <span class="cont">{{ nftDetail.mintingDate }}</span>
            </div>
            <div class="info-text">
              <span class="title">Format：</span>
              <span class="cont">{{ nftDetail.nftFormat }}</span>
            </div>
            <div class="info-text">
              <span class="title">Favorite Date：</span>
              <span class="cont">{{ nftDetail.favoriteAt }}</span>
            </div>
            <div class="info-text">
              <span class="title">Content URI：</span>
              <span class="cont text-ellipsis-5">{{
                nftDetail.sinsoUrl ? nftDetail.sinsoUrl : nftDetail.imageUrl
              }}</span>
            </div>
          </div>
        </el-skeleton>

        <transition name="fade">
          <div class="info-bottom" v-show="nftDetail.attributes.length > 0">
            <div class="info-bottom-title">Properties</div>
            <div class="info-bottom-content">
              <div
                class="item"
                v-for="(item, index) in nftDetail.attributes"
                :key="index"
                :class="(index + 1) % 5 != 0 && 'info-mar'"
              >
                <div class="item-title">{{ item.attribute_name }}</div>
                <div class="item-content">
                  <p class="name" :title="item.attribute_value">
                    {{ item.attribute_value }}
                  </p>
                  <p class="value">{{ item.percentage }} have this Trait</p>
                </div>
              </div>
              <!-- <div class="no-item" v-for="item in 4"></div> -->
            </div>
          </div>
        </transition>

        <transition name="fade" v-if="obj.isShowTransferInfo">
          <div class="info-bottom">
            <div class="info-bottom-title">Transfer</div>
            <div>Transfer this nft to : {{ obj.targetAddress }}</div>

            <el-button
              type="primary"
              :loading="state"
              class="public-btn dialog-btn dialog-confirm-btn"
              @click="
                transfer(obj.nftContract, obj.targetAddress, obj.id, obj.chain)
              "
            >
              Confirm
            </el-button>
          </div>
        </transition>
      </template>
    </public-dialog>
  </div>
</template>

<script>
import PublicDialog from '@/components/PublicDialog'
import imgArr from './mixins/imgArr'
import { $getDetail, $transferNFT } from '@/api/user'
import initTree from './mixins/initTree'
import Web3 from 'web3'
import DatalandNFTContractsJson from '@/assets/contracts/DatalandNFT'
import { mapGetters } from 'vuex'

export default {
  name: 'nftDetail',
  mixins: [imgArr, initTree],
  components: {
    PublicDialog
  },
  data() {
    return {
      obj: {},
      percentage: 0,
      dialogTitle: 'Rename Folder',
      loading: true,
      state: false,
      nftDetail: {
        nftName: 'Mutant Okay Azukis #0',
        nftStanderd: 'erc721',
        nftContract: '0xcf3586d2437244c83df9a569d94c840451e7fb1d',
        nftCreater: '0xfcd89550fd059bf09f28e64c3e2868e20a9311cc',
        nftId: '0',
        nftHolder: '0xfcd89550fd059bf09f28e64c3e2868e20a9311cc',
        mintingDate: '2022-05-26 22:16:41',
        nftFormat: 'image/png',
        logo: '',
        favoriteAt: '2022-06-25 08:19:24',
        sourceUrl:
          'https://www.nftscan.com/0xcf3586d2437244c83df9a569d94c840451e7fb1d/0',
        imageUrl: '',
        sinsoUrl:
          'https://download.getway.sinso.io/sinso/329dcf9cefe75bc9cceba18fe0086c3f2d1c9a6a8edf3ad85a9497b310f75082/',
        collected: false,
        attributes: [],
        manuallyClick: false,
        created: false,
        favorited: true,
        chainId: 0
      },
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
          currency: 'MATIC',
          icon: require('../../../assets/Polygon.png')
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['address'])
  },
  methods: {
    open(obj) {
      this.obj = obj

      this.getDetail(obj.id)
      this.percentage = 0
      this.$refs.publicDialog.open()
    },

    getDetail(id) {
      $getDetail({ id })
        .then((res) => {
          this.loading = false
          this.nftDetail = res
          this.nftDetail.imageUrl = this.nftDetail.imageUrl
            ? this.nftDetail.imageUrl
            : require('@/assets/img-zhanwei.png')
          this.nftDetail.attributes = this.nftDetail.attributes
            ? JSON.parse(this.nftDetail.attributes)
            : []
          if (res.nftFormat === 'model/gltf-binary') {
            this.$nextTick(() => {
              this.initThree(res.imageUrl)
            })
          }
        })
        .catch(() => {})
    },

    close() {
      this.clearDom()
      this.nftDetail.imageUrl = '' // Clear image link when pop up box is closed
      this.nftDetail.attributes = [] // Clear attribute list when pop up box is closed
    },
    confirmFun() {
      this.percentage = 0
      this.$refs.publicDialog.close()
    },

    async switchChain(chainId) {
      let defaultChainId = Web3.utils.numberToHex(chainId)
      return await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: defaultChainId }]
      })
    },

    async transfer(contractAddress, targetAddress, nftId, chain) {
      let rpcUrl = this.$store.state.user.chainCh
      let web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))


      this.blockchains.forEach((element) => {
        if (element.currency == chain) {
          this.chainId = element.chainId
        }
      })

      await this.switchChain(this.chainId)

      // return

      // Instantiate a new contract object
      const instance = new web3.eth.Contract(
        DatalandNFTContractsJson.abi,
        contractAddress
      )

      var encode = instance.methods
        .safeTransferFrom(
          this.address, // from
          targetAddress, // to target address 0x3C93b6a955167bA7d36472123EB3D25e82633eA0
          0 // tokenId
        )
        .encodeABI()

      // create transfer object
      let transactionObject = {
        from: this.address,
        to: contractAddress,
        gas: '400000',
        data: encode
      }
      return await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [transactionObject]
        })
        .then(function (receipt) {
          console.log(receipt)
          $transferNFT({ id: nftId, toAddress: targetAddress }).then(() => {
            window.location.reload()
          })
        })
        .catch(function (error) {
        })
    }
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

::v-deep .el-skeleton {
  display: flex;

  .el-skeleton__item {
    background: $imgBg;
  }

  .el-skeleton__image svg {
    fill: #9b9b9b;
  }
}

.dialog-confirm-btn {
  margin: 5px auto;
  line-height: 1;
  display: block;
  width: auto;
}

.base-info {
  display: flex;
  width: 100%;

  .info-left {
    width: 470px;
    height: 470px;

    .info-img {
      border-radius: 16px;
      //  background: $imgBg;

      ::v-deep .el-image {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          border-radius: 16px;
        }
      }
    }

    .info-icon {
      margin-top: 15px;

      img {
        margin-right: 10px;
        width: 16px;
      }
    }
  }

  .info-right {
    border: 1px solid #cdcdcd;
    padding: 17px 28px 22px;
    flex: 1;
    margin-left: 32px;

    .info-text {
      padding: 5px 0;
      color: #13171c;
      display: flex;
      line-height: 25px;

      .title {
        width: 125px;
        color: #7f8894;
      }

      .cont {
        flex: 1;
      }
      .text-ellipsis-5 {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        overflow: hidden;
      }
    }
  }
}

.info-bottom {
  margin-top: 24px;
  border-top: 1px solid #cdcdcd;

  .info-bottom-title {
    font-weight: bold;
    text-align: center;
    padding: 20px 0;
    font-size: 16px;
  }

  .info-bottom-content {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;

    .item {
      color: #fff;
      border-radius: 10px;
      background: #16486a;
      margin-bottom: 20px;
      width: 188px;

      .item-title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        background: #072e48;
        text-align: center;
        border-radius: 10px;
      }

      .item-content {
        text-align: center;
        padding: 20px;

        p {
          line-height: 30px;
        }

        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 16px;
        }

        .value {
          font-size: 12px;
        }
      }
    }
    .info-mar {
      margin-right: 20px;
    }
    .no-item {
      width: 188px;
      height: 0;
    }
  }
}

::v-deep .content {
  padding: 40px !important;
}

::v-deep .el-dialog__close {
  color: #000 !important;
}

.speed {
  width: 470px;
  height: 4px;
  background-color: #a4b9d4;
  position: relative;
  border-radius: 20px;
  margin: 4px 0px;
  .speIng {
    position: absolute;
    height: 4px;
    background-color: #06a4ee;
    border-radius: 20px;
    > p {
      width: 6px;
      height: 6px;
      background-color: #06a4ee;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: -1px;
      top: -1px;
      > i {
        display: block;
        width: 4px;
        height: 4px;
        background-color: #ffffff;
        border-radius: 50%;
      }
    }
  }
}
</style>
