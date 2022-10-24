<template>
  <ul
    class="content-list"
    v-infinite-scroll="loadMore"
    infinite-scroll-distance="1"
    style="overflow-y: auto"
    infinite-scroll-disabled="busy"
  >
    <li
      :class="layoutActive ? '' : 'list-item-small'"
      class="list-item"
      v-for="(item, index) in listData"
      :key="index"
    >
      <div
        class="item-box"
        @click="
          item.type === 1 ? nextFolder(item) : openDialog(item, 'nftDetail')
        "
      >
        <div class="item-img">
          <img v-if="item.type == 1" src="@/assets/img-file1.png" />
          <el-image v-else :src="item.logo" fit="contain" class="img">
            <div slot="placeholder" class="img-placeholder">
              <img :src="imgArr[item.nftFormat]" />
            </div>

            <div slot="error" class="img-error">
              <img src="@/assets/img-unknown.png" />
            </div>
          </el-image>
        </div>
        <div class="item-bottom">
          <div class="item-icon">
            <img :src="imgArr[item.chain]" />
            <img v-if="item.created" src="@/assets/img-Created.png" />
            <img v-if="item.collected" src="@/assets/img-collected.png" />
            <img v-if="item.favorited" src="@/assets/img-Favorited.png" />
            <img v-if="item.manuallyClick" src="@/assets/sinso_getway.png" />
          </div>
          <div @click.stop class="item-opera">
            <el-dropdown placement="bottom" trigger="click">
              <div class="img-box">
                <img src="@/assets/img-more.png" />
              </div>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="item.type === 2"
                  @click.native="openLink(item.sourceUrl)"
                >
                  Link to
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="item.type == 1"
                  @click.native="openDialog(item, 'renameDialog', index)"
                  >Rename
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="openDialog(item, 'moveTo', index)"
                  >Move to
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="addToSinso(item.id, index)"
                  v-if="!item.manuallyClick && item.type === 2"
                  >Store on SINSO
                </el-dropdown-item>
                <el-dropdown-item
                  @click.native="openDialog(item, 'removeDialog', index)"
                  >Remove
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="item-name">
        <el-popover
          placement="top"
          :width="layoutActive ? 100 : 180"
          trigger="hover"
          :content="item.name"
        >
          <div class="text" slot="reference">
            {{ item.name }}
          </div>
        </el-popover>
      </div>
    </li>
    <li
      class="list-item-none list-item"
      :class="layoutActive ? '' : 'list-item-small'"
      v-for="item in 10"
    ></li>
  </ul>
</template>

<script>
import imgArr from './mixins/imgArr'
import { $addToSinso } from '@/api/user'

export default {
  mixins: [imgArr],
  name: 'listItem',

  props: {
    layoutActive: {
      type: Number,
      require: true
    },
    fileList: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  data() {
    return {
      disable: true,
      busy: false,
      imgArr: {
        'image/png': require('@/assets/img-image.png'),
        SINSO: require('@/assets/img-sinso.png'),
        ETH: require('@/assets/Ethereum.png'),
        MATIC: require('@/assets/Polygon.png'),
        'video/mp4': require('@/assets/img-video.png')
      }, //
      listData: []
    }
  },
  watch: {
    fileList(val) {
      this.listData = val
    }
  },
  created() {},
  methods: {
    // openLink
    openLink(url) {
      window.open(url)
    },
    // jiazai all
    loadMore() {
      this.busy = true
      if (this.disable) {
        this.$emit('loadMore')
      }
    },
    openDialog(row, name, index) {
      let obj = { name, row, index }
      this.$emit('openDialog', obj)
    },
    nextFolder(row) {
      this.$emit('nextFolder', row)
    },
    // add  go sinso
    addToSinso(id, index) {
      this.$Loading.loadingShow()
      $addToSinso({ id }).then((res) => {
        this.$Loading.loadingHide()
        this.listData[index].manuallyClick = true
        this.$message({
          message: 'success',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.content-list {
  flex: 1;
  padding: 12px 7px 15px 7px;
  overflow: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  text-align: justify;
  .list-item {
    display: inline-block;
    //float:left ;
    margin: 17px 15px 17px 15px;
    width: 200px;
    //width: 276px;
    transition: all 1s;
    .item-box {
      width: 100%;
      //height: 320px;

      height: 235px;
      cursor: pointer;
      background: linear-gradient(
        0deg,
        rgba(70, 92, 106, 0.3),
        rgba(189, 225, 255, 0.3)
      );
      padding: 15px 16px 22px;
      border-radius: 16px;
      transition: all 1s;

      &:hover {
        transform: scale(1.1);
      }

      //padding: 24px;

      .item-img {
        transition: all 1s;
        width: 160px;
        height: 160px;

        /* background: red;*/
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        margin: 0 auto;
        ::v-deep .el-image {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
        }
        img {
          object-fit: contain;
        }
      }

      .item-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        height: 40px;

        .item-icon {
          img {
            height: 16px;
            display: inline-block;
            margin-right: 8px;
          }
        }

        .item-opera {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 20px;
          color: $mainColor;
          height: 100%;
          width: 40px;
          ::v-deep .el-dropdown {
            width: 100%;
            height: 100%;
          }
          .img-box {
            width: 100%;
            height: 100%;
            line-height: 30px;
            text-align: right;
          }
        }
      }
    }
    .item-name {
      text-align: center;
      width: 100%;
      color: #fff;
      margin-top: 28px;

      .text {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 20px;
        font-size: 17px;
      }
    }
  }

  .list-item-small {
    //transform: scale(1.38);
    // transform-origin: 0 0;
    width: 276px;
    // width: 200px;
    // transform: scale(1.38);
    //transform:translate(-50%);
    .item-box {
      //height: 235px;
      //padding: 15px 16px 22px;
      height: 320px;
      padding: 24px;
      .item-img {
        width: 228px;
        height: 228px;
      }
    }

    .item-name {
      margin-top: 24px;
    }
  }

  .list-item-none {
    height: 0 !important;
    margin: 0 17px !important;
  }
}
</style>
