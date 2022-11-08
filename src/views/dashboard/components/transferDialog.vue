
<template>
  <div class="reName">
    <public-dialog
      ref="publicDialog"
      :width="640"
      :title-show="false"
      :footer-show="false"
      @confirmFun="confirmFun"
      @close="close"
    >
      <template slot="content">
        <div class="img-box">
          <!-- <img :src="nftImage" alt="" width="380px" /> -->
          <video
            v-if="nftFormat.indexOf('video') > -1"
            :src="imageUrl"
            autoplay
            loop
            controls="controls"
            controlslist="nodownload  noplaybackrate noremoteplayback"
            :disablePictureInPicture="true"
            style="width: 470px; height: 470px"
          ></video>

          <div class="audio-box" v-else-if="nftFormat.indexOf('audio') > -1">
            <img
              src="@/assets/img-mp3-bg.png"
              alt=""
              width="470px"
              height="420px"
            />

            <video
              class="video"
              :src="imageUrl"
              autoplay
              loop
              controls="controls"
              controlslist="nodownload  noplaybackrate noremoteplayback"
              :disablePictureInPicture="true"
              style="width: 500px; height: 50px"
            ></video>
          </div>

          <el-image
            class="image-box"
            ref="previewImage"
            v-else-if="
              nftFormat.indexOf('image') > -1 ||
              nftFormat.indexOf('unknown') > -1
            "
            :src="imageUrl"
            :preview-src-list="[imageUrl]"
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
            <div id="ThreeContainerX" style="width: 470px; height: 460px"></div>
            <!-- <div class="speed" v-if="percentage > 1">
              <div class="speIng" :style="`width:${percentage}%`">
                <p><i></i></p>
              </div>
            </div> -->
          </div>
        </div>

        <div class="nft-name-box">
          {{ nftName }}
        </div>

        <div class="chain-box">
          <img :src="chainIcon" alt="" width="30px" />
          <div style="margin-left: 15px">{{ chain }}</div>
        </div>

        <div style="display: flex; align-items: center">
          <img src="@/assets/img-xinghao.png" alt="" width="7px" />
          <div style="margin-left: 5px">Address</div>
          <div style="margin-left: 10px; flex: 1">
            <el-input
              v-model="targetAddress"
              placeholder="Input the Target Address"
            ></el-input>
          </div>
        </div>

        <div class="warning-box">
          <div style="margin-right: 20px">
            <img src="@/assets/img-warning.png" alt="" width="18px" />
          </div>
          Warning : Items sent to the wrong address cannot be recovered
        </div>

        <div
          style="
            display: flex;
            justify-content: center;
            margin-top: 38px;
            margin-bottom: 20px;
          "
        >
          <el-button
            class="public-btn dialog-btn dialog-confirm-btn"
            type="primary"
            @click="openDialog"
            >Transfer</el-button
          >
        </div>
      </template>
    </public-dialog>
  </div>
</template>



<script>
import PublicDialog from '@/components/PublicDialog'
// import initTree from './mixins/initTree'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Web3 from 'web3'

export default {
  name: 'reNameDialog',

  // mixins: [initTree],
  components: {
    PublicDialog
  },
  data() {
    return {
      obj: {},
      targetAddress: '',
      nftName: '',
      nftImage: '',
      nftFormat: '',
      imageUrl: '',

      id: '',
      dialogTitle: 'Transfer',
      form: {
        folderName: ''
      },
      formRules: {
        folderName: [
          {
            required: true,
            max: 50,
            message: 'Incorrect Input',
            trigger: 'blur'
          }
        ]
      },

      chain: '',
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
  methods: {
    open(obj) {
      this.obj = obj
      this.nftName = obj.name
      this.nftImage = obj.imageUrl
      this.nftFormat = obj.nftFormat
      this.imageUrl = obj.imageUrl
      this.id = obj.id

      this.blockchains.forEach((element) => {
        if (obj.chain == element.currency) {
          this.chain = element.currency
          this.chainIcon = element.icon
        }
      })

      if (this.nftFormat.indexOf('model') > -1) {
        this.$nextTick(() => {
          this.initThree(this.nftImage)
        })
      }

      this.$refs.publicDialog.open()
    },

    openDialog() {
      var flag = Web3.utils.isAddress(this.targetAddress)
      console.log(flag)

      if (!flag) {
        this.$message({
          type: 'error',
          message: 'Invalid address'
        })
        return
      }
      this.obj.targetAddress = this.targetAddress
      this.obj.isShowTransferInfo = true
      this.$emit('openDialog', { name: 'nftDetail', row: this.obj })
    },
    confirmFun() {
      //   this.$Loading.loadingShow()
      //   let obj = Object.assign({ id: this.id }, this.form)
      //   $uploadFolderName(obj).then((res) => {
      //     this.$Loading.loadingHide()
      //     this.$message({
      //       message: 'success',
      //       type: 'success'
      //     })
      //     this.$emit('confirmCallback', { name: 'reName', data: this.form })
      //     this.$refs.publicDialog.close()
      //   })

      this.$refs.publicDialog.close()
    },
    close() {
      // this.$refs.form.resetFields()
      this.clearDom()
      this.targetAddress = ''
    },

    clearDom() {
      let threeContainer = document.querySelector('#ThreeContainerX')
      if (threeContainer) {
        threeContainer.innerHTML = ''
      }
    },

    initThree(url) {
      let that = this
      let container = document.getElementById('ThreeContainerX')

      let mixer
      var fileName = url

      var scaleParameter = 4

      var zoom = [5, 30]

      var isShadowOn = true

      var lightIntense = 4

      var lightPostion = [15, 10, 10]

      function traverse(obj) {
        for (var a in obj) {
          if (typeof obj[a] == 'object') {
            if (obj[a].type != 'Object3D') {
              obj[a].castShadow = true
              obj[a].receiveShadow = true
            }
            traverse(obj[a].children)
          } else {
          }
        }
      }

      // Screenshot settings,Default png
      function getCoverImg(download = false, fileFormat = 'image/png') {
        const canvas = that.renderer.domElement
        that.renderer.render(that.scene, that.camera)
        var imgUri = canvas.toDataURL(fileFormat)
        // .replace(fileFormat, "image/octet-stream");

        that.imageUrl = imgUri
        if (download) {
          window.location.href = imgUri
        }
      }

      that.renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
      })
      that.renderer.setPixelRatio(window.devicePixelRatio)
      that.renderer.setSize(container.offsetWidth, container.offsetHeight)
      that.renderer.outputEncoding = THREE.sRGBEncoding

      that.renderer.shadowMap.enabled = true

      container.appendChild(that.renderer.domElement)

      that.scene = new THREE.Scene()
      const pmremGenerator = new THREE.PMREMGenerator(that.renderer)
      that.scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        1
      ).texture
      that.scene.background = new THREE.Color(0xbfe3dd)

      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/gltf/')
      const loader = new GLTFLoader()
      loader.setDRACOLoader(dracoLoader)
      var animation = 0
      loader.load(
        fileName,
        function (gltf) {
          const model = gltf.scene
          model.castShadow = true
          var item = model.children

          if (isShadowOn) {
            traverse(item)
          }

          var bBox = new THREE.Box3().setFromObject(model)
          var big = Math.max(bBox.max.x, bBox.max.y, bBox.max.z)
          var scale = scaleParameter / big

          model.scale.set(scale, scale, scale)

          mixer = new THREE.AnimationMixer(model)
          animation = gltf.animations.length

          if (animation > 0) {
            for (var i in gltf.animations) {
              mixer.clipAction(gltf.animations[i]).play()
            }
          }
          that.scene.add(model)

          getCoverImg()
        },
        function (xhr) {
          that.percentage = parseInt((xhr.loaded / xhr.total) * 100)
          // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        function (error) {
          that.$message({
            message: 'Loading model Error',
            type: 'error'
          })
          console.log('Loading model Error')
        }
      )

      const light = new THREE.DirectionalLight(0xffffff, lightIntense)
      light.position.set(lightPostion[0], lightPostion[1], lightPostion[2])
      if (isShadowOn) {
        light.castShadow = true
        light.shadow.mapSize.width = 1024
        light.shadow.mapSize.height = 1024
        light.shadow.bias = -0.00005
      }
      that.scene.add(light)

      that.camera = new THREE.PerspectiveCamera(
        75,
        container.offsetWidth / container.offsetHeight,
        0.1,
        1000
      )

      that.controls = new OrbitControls(that.camera, that.renderer.domElement)
      that.camera.position.set(0, 5, 10)
      that.controls.target.set(0, 0.5, 0)
      that.controls.enableDamping = true
      that.controls.enableZoom = true
      that.controls.minDistance = zoom[0]
      that.controls.maxDistance = zoom[1]
      that.controls.update()

      const clock = new THREE.Clock()

      function animate() {
        requestAnimationFrame(animate)
        if (animation > 0) {
          const delta = clock.getDelta()
          mixer.update(delta)
        }
        that.controls.update()
        that.renderer.render(that.scene, that.camera)
      }

      animate()
    }
  }
}
</script>

<style scoped lang="scss">
.nft-name-box {
  height: 60px;
  text-align: center;
  line-height: 60px;
  border-bottom: 0.5px #cdcdcd solid;
  margin-bottom: 10px;
}

.img-box {
  height: 470px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.warning-box {
  height: 42px;
  background-color: #d9e1e4;
  margin-top: 14px;
  color: red;
  padding-left: 14px;
  display: flex;
  border-radius: 5px;
  /* justify-content: center; */
  align-items: center;
}
.audio-box {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.chain-box {
  height: 50px;
  display: flex;
  align-items: center;
}

.dialog-confirm-btn {
  margin: 5px auto;
  line-height: 1;
  display: block;
  width: auto;
}

::v-deep .el-dialog {
  background: #e6ecf0;
  border-radius: 20px;

  input::placeholder {
    color: #7f8894;
  }

  .el-dialog__header {
    padding: 0;

    .el-dialog__close {
      color: #000;
    }
  }
}
</style>
