<template>
  <public-dialog
    ref="publicDialog"
    :width="680"
    :dialog-title="dialogTitle"
    :footerShow="false"
    @confirmFun="confirmFun"
    @close="close"
  >
    <template slot="content">
      <el-form
        ref="form"
        :model="form"
        class="form"
        :rules="formRules"
        autocomplete="on"
        label-position="right"
        label-width="100px"
      >
        <div class="upload-box">
          <el-upload
            action=""
            :show-file-list="false"
            :on-change="handleChange"
            :auto-upload="false"
          >
            <div class="chooseImage upload-content-box">
              <img
                v-if="fileType < 1 || !form.fileUri"
                src="@/assets/img-add.png"
              />

              <el-image
                v-else-if="fileType == 1"
                :src="form.fileUri"
                style="width: 250px; height: 250px"
              />

              <video
                class="video"
                v-else-if="fileType == 2"
                :src="form.fileUri"
                auto
                loop
                controls="controls"
                controlslist="nodownload  noplaybackrate noremoteplayback"
                :disablePictureInPicture="true"
                style="width: 443px; height: 250px"
              />

              <div
                id="ThreeContainer"
                v-else-if="fileType == 3"
                style="width: 250px; height: 250px"
              />
            </div>
          </el-upload>
          <div class="tips">
            <div class="tips-content">
              <p>Image：jpg、jpeg、gif、png</p>
              <p>Video：mp4、avi</p>
              <p>3DModel：glb</p>
              <p>Less than 100m</p>
            </div>
          </div>
        </div>

        <el-form-item label="Block chain:">
          <el-select v-model="form.chainId" @change="changeChain">
            <el-option
              v-for="(item, index) in blockchains"
              :key="item.chainId"
              :label="item.label"
              :value="item.chainId"
              :disabled="stateObj.isAction"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="NFT Name" prop="nftName">
          <el-input
            v-model="form.nftName"
            placeholder="NFT Name"
            :disabled="stateObj.isAction"
          ></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input
            v-model="form.description"
            placeholder="description"
            :disabled="stateObj.isAction"
            type=""
          ></el-input>
        </el-form-item>
        <el-button
          type="primary"
          :loading="stateObj.isAction"
          class="public-btn dialog-btn dialog-confirm-btn"
          @click="saveNft(file)"
        >
          Mint NFT
        </el-button>
        <div class="process" v-if="stateObj.isAction || stateObj.status1 != 1">
          <h3>Processing：</h3>
          <div>
            Switch-chain：<a v-if="stateObj.status1 == 1">underway</a>
            <a v-else>
              {{ stateObj.status1 == 2 ? 'Done' : 'Fail' }}
            </a>
          </div>
          <div v-if="stateObj.status1 == 2">
            Upload:<a v-if="stateObj.status2 == 1">underway</a>
            <a v-else>
              {{ stateObj.status2 == 2 ? 'Done' : 'Fail' }}
            </a>
          </div>
          <div v-if="stateObj.status2 == 2">
            Minting :<a v-if="stateObj.status3 == 1">underway</a>
            <a v-else>
              {{ stateObj.status3 == 2 ? 'Done' : 'Fail' }}
            </a>
          </div>
          <div v-if="stateObj.status3 == 2">
            Preservation nft:<a v-if="stateObj.status4 == 1">underway</a>
            <a v-else>
              {{ stateObj.status4 == 2 ? 'Done' : 'Fail' }}
            </a>
          </div>
        </div>
      </el-form>
    </template>
  </public-dialog>
</template>

<script>
import PublicDialog from '@/components/PublicDialog'
import { $uploadFile, $uploadJson, $saveNft } from '@/api/user'
import Web3 from 'web3'
import initTree from './mixins/initTree'

import DatalandNFTContractsJson from '@/assets/contracts/DatalandNFT'

import { mapGetters } from 'vuex'
export default {
  mixins: [initTree],
  name: 'mintNFT',
  components: {
    PublicDialog
  },
  props: {
    parentId: {
      type: Number,
      require: true
    }
  },
  computed: {
    ...mapGetters(['address'])
  },
  data() {
    return {
      web3: null,
      jsonUrl: '',
      file: '',
      dialogTitle: 'Mint NFT',
      selectObj: {
        chainId: 8845,
        label: 'Sinso',
        rpcUrl: 'https://data-seed-pressc-1.sinso.io',
        currency: 'SINSO'
      },
      fileType: 0,
      netImgUrl: '',
      imageUrl: '',
      logUrl: '',

      fileTypes: ['png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi', 'glb', 'gltf'],
      form: {
        nftName: '',
        fileUri: '',
        chainId: 8845,
        description: '',
        addChain: []
      },
      formRules: {
        nftName: [
          { required: true, message: 'NFT Name is required', trigger: 'blur' }
        ]
      },
      blockchains: [
        {
          chainId: 8845,
          label: 'Sinso',
          rpcUrl: 'https://data-seed-pressc-1.sinso.io',
          currency: 'SINSO',
          addChain: [
            {
              chainId: '0x228d',
              chainName: 'SSC Testnet',
              nativeCurrency: { name: 'SIN', symbol: 'SIN', decimals: 18 },
              rpcUrls: ['https://data-seed-pressc-1.sinso.io']
            }
          ]
        },
        {
          chainId: 1,
          label: 'Ethereum ',
          rpcUrl: 'https://mainnet.infura.io/v3/',
          currency: 'ETH',
          addChain: [
            {
              chainId: '0x1',
              chainName: 'ETH',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.infura.io/v3/']
            }
          ]
        },
        {
          chainId: 137,
          label: 'Polygon',
          rpcUrl: 'https://polygon-rpc.com',
          currency: 'POLYGON',
          addChain: [
            {
              chainId: '0x89',
              chainName: 'poly',
              nativeCurrency: { name: 'poly', symbol: 'poly', decimals: 18 },
              rpcUrls: ['https://polygon-rpc.com']
            }
          ]
        }
      ],
      // 0 fail 1 ing 2 Done
      stateObj: {
        isAction: false,
        status1: 1,
        status2: 1,
        status3: 1,
        status4: 1
      }
    }
  },
  mounted() {},
  watch: {
    //
    stateObj: {
      handler() {
        let { status1, status2, status3, status4 } = this.stateObj
        if (!status1 || !status2 || !status3 || !status4) {
          this.stateObj.isAction = false
        }
      },
      deep: true
    }
  },
  methods: {
    initStatus() {
      this.stateObj = {
        isAction: false,
        status1: 1,
        status2: 1,
        status3: 1,
        status4: 1
      }
    },
    // mint nft
    async saveNft(file) {
      this.initStatus()
      if (!this.form.fileUri) {
        this.$message({
          message: 'Please select file',
          type: 'warning'
        })
        return
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.stateObj.isAction = true
          await this.chainCont()
          this.stateObj.status1 = 2
          // eslint-disable-next-line no-unreachable
          if (this.fileType == 3 || this.fileType == 2) {
            let formDatas = new FormData()
            let imageFile = this.dataURLtoFile(this.imageUrl, 'logo.png')

            formDatas.append('file', imageFile)
            this.logUrl = (await this.uploadFileWay(formDatas)).url
          }

          // eslint-disable-next-line no-unreachable
          let FormDatas = new FormData()
          FormDatas.append('file', file.raw)
          let res = await this.uploadFileWay(FormDatas)
          this.stateObj.status2 = 2
          this.imageUrl = res.url
          this.contentType =
            this.fileType == 3 ? 'model/gltf-binary' : res.contentType

          let json
          if (this.fileType == 1 || this.fileType == 3) {
            json = {
              jsonStr: JSON.stringify({
                name: this.nftName,
                image: this.imageUrl,
                logo: this.logUrl,
                description: this.form.description
              }),
              nftId: '0'
            }
          } else if (this.fileType == 2) {
            json = {
              jsonStr: JSON.stringify({
                name: this.nftName,
                animation_url: this.imageUrl,
                description: this.form.description
              }),
              nftId: '0'
            }
          }
          this.uploadJson(json)

          let web3 = new Web3(
            new Web3.providers.HttpProvider(this.selectObj.rpcUrl)
          )
          let from = this.address
          let args = [this.form.nftName, this.form.nftName, from, this.jsonUrl]

          // Instantiate a new contract object
          const instance = new web3.eth.Contract(DatalandNFTContractsJson.abi, {
            from
          })

          this.txId = await this.deploy(instance, args)
          let trx = await this.getReceipt(this.txId, this.selectObj.rpcUrl)
          if (trx.status == '0x1') {
            this.stateObj.status3 = 2
            await this.saveNftWay(trx)
          } else {
            this.stateObj.status3 = 0
          }

          // this.sendTransaction(transactionObject, contentType)
        }
      })
    },
    async saveNftWay(trx) {
      var time = new Date().getTime()
      let obj = {
        nftName: this.form.nftName,
        nftStanderd: 'erc721',
        nftContract: trx.contractAddress,
        nftCreater: this.address,
        nftId: '0',
        folderId: this.parentId,
        mintingDate: time,
        nftFormat: this.contentType,
        mintingHash: this.txId,
        imageUrl: this.imageUrl,
        logo: this.logUrl ? this.logUrl : this.imageUrl,
        chain: this.selectObj.currency,
        jsonFileUrl: this.jsonUrl
      }
      let res = (await $saveNft(obj)) || {}
      if (!res.errorCode) {
        this.form = {
          nftName: '',
          fileUri: '',
          chainId: 8845
        }
        this.$refs.publicDialog.close()
        this.$emit('confirmCallback', { name: 'mintNft', data: res })
        return res
      } else {
        throw new Error(res.message)
      }
    },
    async deploy(instance, args) {
      let result = await instance
        .deploy({
          data: DatalandNFTContractsJson.bytecode,
          arguments: args
        })
        .encodeABI()
      let transactionObject = {
        from: this.address,
        gas: '400000',
        to: null,
        data: result
      }
      return await this.ethereumReq(transactionObject)
    },

    async ethereumReq(tx) {
      try {
        return await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx]
        })
      } catch (err) {
        this.stateObj.status3 = 0
        throw new Error(err)
      }
    },
    async uploadFileWay(formDatas) {
      let res = await $uploadFile(formDatas)
      if (!res.errorCode) {
        return res
      } else {
        this.stateObj.status2 = 0
        throw new Error(res.message)
      }
    },
    timeout(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },

    close() {
      this.clearDom()
      this.initStatus()
      this.form = {
        nftName: '',
        fileUri: '',
        chainId: 8845
      }
      this.imageUrl = ''
      this.$refs.form.resetFields()
    },
    // Get transaction receipt object
    async getReceipt(txHash, url) {
      await this.timeout(3000)
      let receipt = await this.sendNodeRequest(
        url,
        'eth_getTransactionReceipt',
        txHash
      )
      if (receipt === null || receipt.blockNumber === null) {
        receipt = await this.getReceipt(txHash, url)
      }
      return receipt
    },

    async sendNodeRequest(url, method, signedData) {
      if (!Array.isArray(signedData)) {
        signedData = [signedData]
      }
      const request = await fetch(url, {
        headers: {
          'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params: signedData,
          id: 1
        })
      }).catch((err) => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
      const json = await request.json()
      if (typeof json.error === 'undefined' || json.error === null) {
        if (method === 'eth_sendRawTransaction') {
          // assert.strictEqual(json.result.length, 66, `Tx wasn't sent ${json}`);
        }
        return json.result
      }
      throw new Error(`web3 RPC failed: ${JSON.stringify(json.error)}`)
    },
    // // Submit a transaction
    // sendTransaction(transactionObject, contentType) {
    //   window.ethereum
    //     .request({
    //       method: 'eth_sendTransaction',
    //       params: [transactionObject]
    //     })
    //     .then(async (res) => {
    //       // const receipt = await this.web3.eth.getTransactionReceipt(res)

    //       let trx = await this.getReceipt(res, this.selectObj.rpcUrl)

    //       var time = new Date().getTime()

    //       let obj = {
    //         nftName: this.form.nftName,
    //         nftStanderd: 'erc721',
    //         nftContract: trx.contractAddress,
    //         nftCreater: this.address,
    //         nftId: '0',
    //         folderId: this.parentId,
    //         mintingDate: time,
    //         nftFormat: contentType,
    //         mintingHash: res,
    //         imageUrl: this.imageUrl,
    //         logo: this.logUrl ? this.logUrl : this.imageUrl,
    //         chain: this.selectObj.currency,
    //         jsonFileUrl: this.jsonUrl
    //       }

    //       $saveNft(obj)
    //         .then((res) => {
    //           this.$message({
    //             message: 'Create Success',
    //             type: 'success'
    //           })
    //           this.form = {
    //             nftName: '',
    //             fileUri: '',
    //             chainId: 8845
    //           }
    //           this.$refs.publicDialog.close()
    //           this.$emit('confirmCallback', { name: 'mintNft', data: res })
    //         })
    //         .catch(() => {})
    //     })
    //     .catch((error) => {
    //       this.$message({
    //         message: error.message,
    //         type: 'error'
    //       })

    //       // this.cancel();
    //     })
    // },
    // Upload the json file
    uploadJson(json) {
      $uploadJson(json)
        .then((res) => {
          this.jsonUrl = res
        })
        .catch(() => {})
    },
    uploadJsonSSS(json) {
      return $uploadJson(json)
    },
    open(obj) {
      this.$refs.publicDialog.open()
    },
    confirmFun() {
      this.$refs.publicDialog.close()
    },
    changeChain(val) {
      this.selectObj = this.blockchains.find((item) => {
        return item.chainId === val
      })
    },

    // Switching chain
    async switchChain() {
      let defaultChainId = Web3.utils.numberToHex(this.form.chainId)
      return await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: defaultChainId }]
      })
    },
    async addChain() {
      let defaultChainJSON = this.form.addChain
      return await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: defaultChainJSON
      })
    },
    async chainCont() {
      try {
        return await this.switchChain()
      } catch (err) {
        this.stateObj.status1 = 0
        if (err.code == 4902) {
          try {
            return await this.addChain()
          } catch (error) {
            this.stateObj.status1 = 0
            this.$message.error('Failed to add a default network to MetaMask!')
            throw new Error(error.message)
          }
        } else {
          this.stateObj.status1 = 0
          throw new Error(err.message)
        }
      }
    },
    // Select the file callback hook
    handleChange(file) {
      if (this.stateObj.isAction) {
        return
      }
      if (file.type != '' || file.type != null || file.type != undefined) {
        const FileExt = file.name.replace(/.+\./, '').toLowerCase()

        const isLt100M = file.size / 1024 / 1024 < 100 //

        if (!isLt100M) {
          this.$message({
            message: 'The file cannot exceed 100M',
            type: 'error'
          })
          return
        }

        // If the file type is not allowed to upload
        if (!this.fileTypes.includes(FileExt)) {
          this.$message.error('File format is not supported')
          return
        }
      }
      this.clearDom()
      this.file = file

      this.form.fileUri = URL.createObjectURL(file.raw)

      if (file.raw.type.indexOf('image') > -1) {
        this.fileType = 1
      } else if (file.raw.type.indexOf('video') > -1) {
        this.fileType = 2

        this.getVideoBase64(this.form.fileUri)
      } else if (this.getSuffix(file.name) === 'glb') {
        this.fileType = 3

        this.$nextTick(() => {
          this.initThree(this.form.fileUri)
        })
      }
    },

    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      let file = new File([u8arr], filename, { type: mime })
      return file
    },
    // Get the first frame of the video
    getVideoBase64(url) {
      let _this = this
      return new Promise(function (resolve, reject) {
        let dataURL = ''
        let video = document.createElement('video')
        video.setAttribute('crossOrigin', 'anonymous') // Process cross domain
        video.setAttribute('src', url)
        video.setAttribute('width', 400)
        video.setAttribute('height', 400)
        video.setAttribute('preload', 'auto')
        video.addEventListener('loadeddata', function () {
          let canvas = document.createElement('canvas'),
            width = video.width,
            height = video.height
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d').drawImage(video, 0, 0, width, height)
          dataURL = canvas.toDataURL('image/jpeg')

          _this.imageUrl = dataURL

          resolve(dataURL)
        })
      })
    },

    // Get File Suffix
    getSuffix(string) {
      if (string) {
        let lastIndex = string.lastIndexOf('.')
        return string.substring(lastIndex + 1)
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.tips {
  width: 100%;

  .tips-content {
    width: 250px;
    margin: 0 auto;
    text-align: left;
    .title {
      font-size: 14px !important;
    }
    margin-top: 10px;
    font-size: 12px;
    color: #7e7c77;
    p {
      line-height: 20px;
    }
  }
}
.upload-box {
  margin-bottom: 30px;
  text-align: center;

  .upload-content-box {
    background: $imgBg;
    border: 1px solid #e6e6e6;
    border-radius: 16px;
    width: 250px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    ::v-deep .el-image {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.dialog-confirm-btn {
  margin: 5px auto;
  line-height: 1;
  display: block;
  width: auto;
}

::v-deep .el-select {
  width: 100%;

  .el-select__caret {
    color: #111;
  }
}
.process {
  div {
    margin: 20px 0px;
  }
}
</style>
