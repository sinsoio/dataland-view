<template>
  <div class="dashboard">
    <div class="operation-panel">
      <div class="operation-btn">
        <div
          class="main-btn public-btn"
          @click="openDialog({ name: 'addNFT', row: {} })"
        >
          <div class="btn-icon">
            <img src="@/assets/img-icon-addNft.png" />
          </div>
          <div class="btn-text">{{ $t(`dashboard.addMint`) }}</div>
        </div>
        <div
          class="main-btn public-btn"
          @click="openDialog({ name: 'mintNFT', row: {} })"
        >
          <div class="btn-icon">
            <img src="@/assets/img-icon-mintnft.png" />
          </div>
          <div class="btn-text">{{ $t(`dashboard.mintNFT`) }}</div>
        </div>
        <div
          class="main-btn public-btn"
          @click="openDialog({ name: 'createFolder', row: {} })"
        >
          <div class="btn-icon">
            <img src="@/assets/img-icon-created.png" />
          </div>
          <div class="btn-text">{{ $t(`dashboard.newFolder`) }}</div>
        </div>
      </div>
      <div class="operation-right">
        <div class="search-block">
          <div class="search-folder search-item">
            <el-input
              :placeholder="$t(`dashboard.search`)"
              prefix-icon="el-icon-search"
              v-model="searchFileName"
              :clearable="true"
              @keyup.enter.native="searchFile(searchFileName)"
              @clear="clear"
            >
            </el-input>
          </div>
          <div class="search-time search-item">
            <el-select v-model="selectType" @change="changeType">
              <el-option
                v-for="item in selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="quick-layout">
          <div
            class="layout-btn"
            v-for="(item, index) in layoutList"
            :key="item.index"
            :class="layoutActive == index ? 'select-layout-btn' : ''"
            @click="changeLayout(index)"
          >
            <img :src="item.url" />
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div
        class="quick-search"
        :class="!isCollapse ? 'quick-search-close' : ''"
      >
        <div class="quick-search-nav">
          <div class="search-item-box">
            <div class="searchWay-box item-box">
              <div
                class="search-item"
                v-for="(item, index) in searchWay"
                :key="item.value"
                @click="changeWay(index)"
              >
                <div class="item-text">
                  <span class="title">{{ item.label }}</span>
                  <!--                  <span class='num'>({{ item.num }})</span>-->
                </div>
                <div class="item-icon">
                  <svg-icon
                    :icon-class="
                      searchWayIndex == index ? 'radio-select' : 'radio'
                    "
                    class="radio-icon"
                    :class="searchWayIndex == index ? 'radio-icon-select' : ''"
                  ></svg-icon>
                </div>
              </div>
            </div>
            <div class="fileType-box item-box">
              <div
                class="search-item"
                v-for="(item, index) in fileType"
                :key="item.value"
                @click="changeFileType(index, item.value)"
              >
                <div class="item-text">
                  <span class="title">{{ item.label }}</span>
                </div>
                <div class="item-icon">
                  <svg-icon
                    :icon-class="
                      selectFileTypeIndex == index ? 'radio-select' : 'radio'
                    "
                    class="radio-icon"
                    :class="
                      selectFileTypeIndex == index ? 'radio-icon-select' : ''
                    "
                  ></svg-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hamburger-container" @click="toggleSideBar(!isCollapse)">
        <img :src="isCollapse ? hamburgerUrl[1] : hamburgerUrl[0]" />
      </div>
      <div class="content">
        <div class="top-box">
          <div class="breadcrumb-box">
            <div
              class="up-box"
              @click="back()"
              :class="topId < 1 ? 'is-disabled' : ''"
            >
              <img class="up-img" src="../../assets/img-icon-up.png" />
            </div>

            <div class="split-line"></div>
            <div class="breadcrumb">
              <span
                class="breadcrumb-item"
                v-for="(item, index) in breadcrumbList"
                :key="item.id"
                @click="parentId != item.id ? breadcrumb(item, index) : ''"
              >
                <span
                  class="breadcrumb-text"
                  :class="
                    breadcrumbList.length - 1 == index ? 'currentFolder' : ''
                  "
                  >{{ item.name }}</span
                >
                <span v-show="breadcrumbList.length - 1 != index"> ></span>
              </span>
            </div>
          </div>
          <div class="total-label">
            <div class="label-item">
              <div class="item-block"></div>
              <div class="item-text">
                <span>Folders:</span>
                <span>{{ folderStatisticsData.folderNum }}</span>
              </div>
            </div>
            <div class="label-item">
              <div class="item-block"></div>
              <div class="item-text">
                <span>Files:</span>
                <span>{{ folderStatisticsData.fileNum }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-box">
          <list
            ref="list"
            :layoutActive="layoutActive"
            :fileList="fileList"
            @openDialog="openDialog"
            @nextFolder="nextFolder"
            @loadMore="loadMore"
            v-show="fileList.length > 0"
          ></list>
          <div class="no-data" v-show="fileList.length < 1">no data</div>
        </div>
      </div>
    </div>
    <remove-dialog
      ref="removeDialog"
      @confirmCallback="confirmCallback"
    ></remove-dialog>
    <rename-dialog
      ref="renameDialog"
      @confirmCallback="confirmCallback"
    ></rename-dialog>
    <add-n-f-t
      ref="addNFT"
      :parent-id="parentId"
      @confirmCallback="confirmCallback"
    ></add-n-f-t>
    <create-folder
      ref="createFolder"
      :parent-id="parentId"
      @confirmCallback="confirmCallback"
    ></create-folder>
    <move-to ref="moveTo" @confirmCallback="confirmCallback"></move-to>
    <mint-n-f-t
      ref="mintNFT"
      :parent-id="parentId"
      @confirmCallback="confirmCallback"
    ></mint-n-f-t>
    <nft-detail ref="nftDetail"></nft-detail>
  </div>
</template>

<script>
import List from './components/list'
import { mapGetters } from 'vuex'
import RemoveDialog from '@/views/dashboard/components/removeDialog'
import RenameDialog from '@/views/dashboard/components/renameDialog'
import AddNFT from '@/views/dashboard/components/addNFT'
import CreateFolder from '@/views/dashboard/components/createFolder'
import MoveTo from '@/views/dashboard/components/moveTo'
import MintNFT from '@/views/dashboard/components/mintNFT'
import NftDetail from '@/views/dashboard/components/nftDetail'
import { $getFolder, $folderStatistics, $statistics } from '@/api/user'

export default {
  name: 'index',
  components: {
    List,
    RemoveDialog,
    RenameDialog,
    AddNFT,
    CreateFolder,
    MoveTo,
    MintNFT,
    NftDetail
  },
  computed: {
    ...mapGetters(['language', 'token', 'sidebar']),
    isCollapse() {
      return this.sidebar.opened
    }
  },
  data() {
    return {
      topId: null,
      isRefresh: true,
      breadcrumbList: [
        {
          id: 0,
          name: 'DataLand'
        }
      ],

      quickSearchStatus: true,
      pageNum: 1,
      pageSize: 32,
      parentId: 0,
      fileListIndex: -1,
      statisticsData: { createdNum: 0, favoriteNum: 0, ownedNum: 0 },
      folderStatisticsData: { folderNum: 2, fileNum: 0 },
      selectOptions: [
        // Search Options
        { value: 1, label: 'By Time' },
        { value: 2, label: 'By Name' }
      ],
      selectType: 1,
      layoutActive: 1, // layout index
      hamburgerUrl: [
        require('../../assets/img-lachu.png'),
        require('../../assets/img-shouhui.png')
      ],

      layoutList: [
        {
          url: require('../../assets/img-big.png')
        },
        {
          url: require('../../assets/img-small.png')
        }
      ],

      searchWayIndex: 0,
      selectFileTypeIndex: 0,
      searchWay: [
        {
          label: 'All',
          value: 1,
          num: 23
        },
        {
          label: 'Created',
          value: 2,
          num: 123
        },
        {
          label: 'Favorited',
          value: 3,
          num: 65
        },
        {
          label: 'Owned',
          value: 4,
          num: 456
        }
      ],
      fileType: [
        {
          label: 'All',
          value: 1,
          num: 98
        },
        {
          label: 'Image',
          value: 2,
          num: 90
        },
        {
          label: 'Video',
          value: 3,
          num: 7
        },
        {
          label: 'Audio',
          value: 4,
          num: 9
        },
        {
          label: '3D Model',
          value: 5,
          num: 9
        },
        {
          label: 'Other',
          value: 6,
          num: 87
        }
      ],
      searchFileName: '', // file name
      fileList: [],
      breadcrumbIndex: 0,
      nextData: [], // Save a page of data locally
      isNext: true
    }
  },
  watch: {
    token: {
      handler(newValue, oldValue) {
        this.getFile('', 0, false)
      }
    },
    language: {
      handler(newValue, oldValue) {}
    }
  },
  created() {},
  mounted() {
    window.addEventListener('resize', () => {
      if (document.body.offsetWidth < 1300) {
        this.toggleSideBar(false)
      }
    })
    this.getFile('', 0, false)
  },
  methods: {
    // Load more
    loadMore() {
      this.getFile(this.searchFileName, this.parentId, true)
    },
    // Up one level
    back() {
      if (this.topId < 1) {
        return
      }
      this.pageNum = 1
      this.parentId = this.topId
      this.getFile('', this.topId, false)
    },
    // crumbs
    breadcrumb(item, index) {
      this.pageNum = 1
      this.parentId = item.id
      this.getFile('', item.id, false)
    },
    // Next level file
    nextFolder(obj) {
      this.parentId = obj.id
      this.searchFileName = ''
      this.selectType = 1
      this.searchWayIndex = 0
      this.selectFileTypeIndex = 0
      this.pageNum = 1
      this.getFile(this.searchFileName, this.parentId, false)
    },
    openDialog(obj) {
      if (obj.hasOwnProperty('index')) {
        this.fileListIndex = obj.index
      }
      this.$refs[obj.name].open(obj.row)
    },
    open(url) {
      window.open(url)
    },
    // Item or file name search
    searchFile(txt) {
      this.parentId = 0
      this.pageNum = 1
      this.getFile(txt, 0, false)
    },
    /**
     * Folder and file condition filtering
     * @param txt  searchTxt
     * @param parentId  level id
     * @param concat  data is connected
     */
    getFile(txt, parentId, concat) {
      this.$Loading.loadingShow()
      this.statistics()
      if (txt.length > 0) {
        this.getFolder({ searchMsg: txt }, concat)

        this.folderStatistics({ searchMsg: txt })
      } else {
        this.getFolder({ parentId }, concat)
        this.folderStatistics({ parentId })
      }
    },
    // Clear search box
    clear() {
      this.pageNum = 1
      this.getFile('', 0, false)
    },

    // Switch the method of obtaining files
    changeWay(index) {
      this.searchWayIndex = index
      this.pageNum = 1
      this.getFile(this.searchFileName, this.parentId, false)
    },
    /**
     *
     * @param index
     * @param value
     */
    changeFileType(index, value) {
      this.selectFileTypeIndex = index
      this.pageNum = 1
      this.getFile(this.searchFileName, this.parentId, false)
      /* let arrIndex = this.selectFileTypeArr.indexOf(value)
      if (arrIndex < 0) {
        this.selectFileTypeArr.push(value)
      } else {
        this.selectFileTypeArr.splice(arrIndex, 1)
      } */
    },

    toggleSideBar(val) {
      this.$store.dispatch('app/toggleSideBar', val)
    },
    // Change Layout
    changeLayout(index) {
      this.layoutActive = index
    },
    // Change file type
    changeType() {
      this.pageNum = 1
      this.getFile(this.searchFileName, this.parentId, false)
    },
    /**
     * methods:Get folders and files
     * @param parentId
     */
    getFolder(params, concat) {
      let pageSize = this.pageNum == 1 ? this.pageSize * 2 : this.pageSize

      let obj = {
        pageNum: this.pageNum,
        pageSize: pageSize,
        type: this.searchWay[this.searchWayIndex].value,
        state: this.selectType,
        nftFormat: this.fileType[this.selectFileTypeIndex].value
      }
      let newObj = Object.assign(obj, params)
      $getFolder(newObj)
        .then((res) => {
          if (this.pageNum == 1) {
            this.pageNum = 3
            let dataNum = pageSize / 2
            this.fileList = res.fileList.slice(0, dataNum)
            this.nextData = res.fileList.slice(dataNum, res.fileList.length)
          } else {
            this.pageNum++
            this.fileList = this.fileList.concat(this.nextData)
            this.nextData = res.fileList
          }
          this.$refs.list.busy = false

          /*  if(concat){
          this.fileList = this.fileList.concat(res.pageList.content);
        }else{
          this.fileList = res.pageList.content
        }*/

          this.topId = res.topId
          this.$refs.list.disable =
            !res.isNext && this.nextData.length < 1 ? false : true

          if (res.breadCrumbs) {
            let arr = [
              {
                id: 0,
                name: 'DataLand'
              }
            ]
            this.breadcrumbList = arr.concat(res.breadCrumbs)
          } else {
            this.breadcrumbList = [
              {
                id: 0,
                name: 'DataLand'
              }
            ]
          }

          this.$Loading.loadingHide()
        })
        .catch((err) => {
          this.$Loading.loadingHide()
        })
    },
    // Collection Statistics
    statistics() {
      $statistics()
        .then((res) => {
          this.searchWay[0].num = res.ownedNum + res.ownedNum + res.favoriteNum
          this.searchWay[3].num = res.ownedNum
          this.searchWay[2].num = res.favoriteNum
          this.searchWay[1].num = res.createdNum
        })
        .catch(() => {
          this.$Loading.loadingHide()
        })
    },
    // File statistics
    folderStatistics(params) {
      let obj = {
        type: this.searchWay[this.searchWayIndex].value
      }
      let newObj = Object.assign(obj, params)
      $folderStatistics({
        ...newObj,
        nftFormat: this.fileType[this.selectFileTypeIndex].value
      })
        .then((res) => {
          this.folderStatisticsData = res
        })
        .catch(() => {
          this.$Loading.loadingHide()
        })
    },
    // Initialize Data
    initData() {
      this.statistics()
      this.folderStatistics({ parentId: 0 })
    },
    // Post processing after pop-up confirmation
    confirmCallback(val) {
      switch (val.name) {
        case 'remove':
          this.fileList.splice(this.fileListIndex, 1)
          if (val.data.type == 1) {
            this.folderStatisticsData.folderNum--
          } else {
            this.folderStatisticsData.fileNum--
          }
          break
        case 'reName':
          this.fileList[this.fileListIndex].name = val.data.folderName
          break
        default:
          this.searchFileName = ''
          this.selectType = 1
          this.searchWayIndex = 0
          this.pageNum = 1
          this.getFile(this.searchFileName, this.parentId, false)
      }
    }
  }
}
</script>

<style scoped lang="scss">
$quickSearchW: 340px;
.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .operation-panel {
    width: 100%;
    height: 70px;
    display: flex;
    padding: 0 40px 0 36px;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(-89deg, #090909, #242424);

    .operation-btn {
      display: flex;

      .main-btn {
        justify-content: center;
        background: $mainBtnColor;
        color: #fff;
        height: 40px;
        width: 160px;
        display: flex;
        align-items: center;
        border-radius: 6px;
        padding: 0 20px;
        margin-right: 10px;

        .btn-text {
          min-width: 60px;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .operation-right {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }

    .search-block {
      width: 46.15%;
      display: flex;

      ::v-deep .el-input__inner {
        background: $mainBtnColor;
        border: 1px solid $inputBorder;
        border-radius: 6px;
        color: #d1d6dd;
      }

      .search-item {
        margin-right: 16px;
      }

      ::v-deep .el-icon-search:before {
        font-size: 18px;
      }

      .search-folder {
        width: 70.62%;
        min-width: 120px;
        ::v-deep .el-input__inner {
          padding-left: 35px;
        }
        ::placeholder {
          opacity: 0.8;
        }
      }

      .search-time {
        width: 24.37%;
        min-width: 100px;

        ::v-deep .el-input__inner {
          padding-left: 10px;
        }
      }
    }

    .quick-layout {
      width: 108px;
      border: 1px solid $inputBorder;
      border-radius: 6px;
      display: flex;
      background: $mainBtnColor;

      .layout-btn {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: $selectFont;
        opacity: 0.3;

        &:hover {
          opacity: 1;
        }

        &:first-child {
          border-right: solid 1px $inputBorder;
        }

        img {
          width: 18px;
          height: 18px;
        }
      }

      .select-layout-btn {
        opacity: 1;
      }
    }
  }

  .container {
    overflow: auto;
    flex: 1;
    width: 100%;
    display: flex;
    position: relative;
    height: 100%;
    overflow: auto;

    .hamburger-container {
      /* position: absolute;
       left:$quickSearchW;*/

      display: flex;
      align-items: center;
      cursor: pointer;

      img {
        width: 15px;
        height: 66px;
      }
    }

    .hamburger-container-close {
      left: 0;
    }

    .quick-search-close {
      width: 0 !important;
    }

    .quick-search {
      height: 100%;
      background: $navBg;
      width: $quickSearchW;
      transition: width 1s;

      .quick-search-nav {
        overflow-y: auto;
        height: 100%;

        .search-item-box {
          padding: 0 45px 0 35px;

          .item-box {
            padding: 20px 0;
            border-bottom: 1px solid #374753;

            &:last-child {
              border: none;
            }

            .search-item {
              cursor: pointer;
              height: 44px;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: space-between;

              .item-text {
                .name {
                  font-size: 16px;
                }

                .num {
                  margin-left: 10px;
                  font-size: 14px;
                }
              }

              .item-icon {
                width: 18px;
                height: 18px;
              }

              .radio-icon {
                width: 100%;
                height: 100%;
              }

              .radio-icon-select {
                color: #80b4fb;
              }
            }
          }

          .fileType-box {
            .file-icon-select {
              background: url('../../assets/img-duoxuan-select.png');
            }

            .file-icon {
              background: url('../../assets/img-duoxuan.png');
            }
          }
        }
      }
    }

    .content {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;

      .top-box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 40px 15px 17px;

        .breadcrumb-box {
          display: flex;
          align-items: center;
          .up-box {
            cursor: pointer;
            .up-img {
              width: 15px;
              height: 16px;
            }
          }
          .is-disabled {
            cursor: auto;
            opacity: 0.3;
          }

          .split-line {
            height: 32px;
            width: 1px;
            margin: 0 13px;
            background: #e4e4e4;
          }
          .breadcrumb {
            span {
              cursor: pointer;
              color: #fff;
            }
            .breadcrumb-item {
              margin-right: 5px;
              &:last-child {
                margin: 0;
              }
              .currentFolder {
                color: $selectFont;
                font-size: 18px;
              }
            }
          }

          ::v-deep .el-breadcrumb__item {
            cursor: pointer;

            .el-breadcrumb__inner {
              color: #fff;
            }
          }
        }

        .total-label {
          flex: 1;
          display: flex;
          justify-content: flex-end;

          .label-item {
            display: flex;
            margin-right: 4%;
            align-items: center;

            &:last-child {
              margin-right: 0;
            }

            .item-block {
              width: 3px;
              height: 12px;
              background: $mainColor;
              margin-right: 5px;
            }

            .item-text {
              color: #fff;
            }
          }
        }
      }

      .bottom-box {
        overflow: auto;
      }
    }
  }
}
</style>
