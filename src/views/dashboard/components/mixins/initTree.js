import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  data() {
    return {}
  },
  mounted() {},
  methods: {
    clearDom() {
      let threeContainer = document.querySelector('#ThreeContainer')
      if (threeContainer) {
        threeContainer.innerHTML = ''
      }
    },

    initThree(url) {
      let that = this
      let container = document.getElementById('ThreeContainer')

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
