<template>
  <ul
    class="content-list"
    :class="{
      ehFQXR: !isCollapse && layoutActive,
      beNxio: isCollapse && layoutActive,
      iDCpHK: !isCollapse && !layoutActive,
      iUpbyz: isCollapse && !layoutActive
    }"
    v-infinite-scroll="loadMore"
    infinite-scroll-distance="1"
    style="overflow-y: auto"
    infinite-scroll-disabled="busy"
  >
    <!--       :class="layoutActive ? '' : 'list-item-small'" -->
    <li class="list-item" v-for="(item, index) in listData" :key="index">
      <div
        class="item-box"
        @click="
          item.type === 1 ? nextFolder(item) : openDialog(item, 'nftDetail')
        "
      >
        <div class="item-img" :class="!layoutActive && 'item-mar'">
          <img v-if="item.type == 1" src="@/assets/img-file1.png" />

          <!-- <img
            v-else-if="item.nftFormat.indexOf('audio') > -1"
            src="@/assets/img-mp3-bg.png"
            fit="contain"
            class="img"
            width="160px"
          /> -->

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
                <!-- <el-dropdown-item
                  @click.native="addToSinso(item.id, index)"
                  v-if="!item.manuallyClick && item.type === 2"
                  >Store on SINSO
                </el-dropdown-item> -->

                <el-dropdown-item
                  v-if="item.collected && item.type === 2"
                  @click.native="openDialog(item, 'transferDialog', index)"
                >
                  Transfer
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
    },
    isCollapse: {
      type: Boolean,
      require: false,
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
      },
      listData: []
    }
  },

  watch: {
    fileList(val) {
      this.listData = val
    },
    isCollapse() {}
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
.beNxio {
  --template-column-gutters: 16px;
  --template-columns: 1;
  --template-column-compact-multiplier: 1;
  --template-reduced-columns: 0;
  --template-reduced-columns-multiplier: 2;
}
.ehFQXR {
  --template-column-gutters: 16px;
  --template-columns: 1;
  --template-column-compact-multiplier: 1;
  --template-reduced-columns: 0;
  --template-reduced-columns-multiplier: 2;
}
.iDCpHK,
.iUpbyz {
  --template-column-gutters: 16px;
  --template-columns: 1;
  --template-column-compact-multiplier: 1;
  --template-reduced-columns: 0;
  --template-reduced-columns-multiplier: 1;
}
@media (min-width: 1024px) {
  .beNxio,
  .iUpbyz {
    --template-reduced-columns: 1;
  }
  .ehFQXR,
  .iDCpHK {
    --template-reduced-columns: 0;
    --template-columns: 5;
  }
  .iDCpHK,
  .iUpbyz {
    --template-columns: 3;
  }
  .iDCpHK {
    --template-reduced-columns: 0;
  }
}
@media (min-width: 768px) {
  .beNxio,
  .ehFQXR,
  .iDCpHK,
  .iUpbyz {
    --template-column-gutters: 16px;
  }
}

@media (min-width: 20rem) {
  .beNxio,
  .ehFQXR {
    --template-columns: 2;
  }
  .iDCpHK,
  .iUpbyz {
    --template-columns: 2;
  }
}
@media (min-width: 30rem) {
  .beNxio,
  .ehFQXR {
    --template-columns: 3;
  }
  .iDCpHK,
  .iUpbyz {
    --template-columns: 3;
  }
}
@media (min-width: 50rem) {
  .beNxio,
  .ehFQXR {
    --template-columns: 4;
  }
  .iDCpHK,
  .iUpbyz {
    --template-columns: 4;
  }
}
@media (min-width: 60rem) {
  .beNxio,
  .ehFQXR {
    --template-columns: 5;
  }
  .iDCpHK,
  .iUpbyz {
    --template-columns: 5;
  }
}
@media (min-width: 70rem) {
  .iDCpHK,
  .iUpbyz {
    --template-columns: 4;
    .item-img {
      height: 300px !important;
    }
  }
}
@media (min-width: 80rem) {
  .beNxio,
  .ehFQXR {
    --template-columns: 6;
  }
}
@media (min-width: 90rem) {
  .beNxio,
  .ehFQXR {
    --template-columns: 7;
  }
  .iDCpHK,
  .iUpbyz {
    --template-columns: 5;
    .item-img {
      height: 250px !important;
    }
  }
}
@media (min-width: 110rem) {
  .iUpbyz {
    --template-columns: 6;
  }
  .iUpbyz {
    --template-columns: 5;
  }
}
@media (min-width: 120rem) {
  .iDCpHK {
    --template-columns: 7;
  }
  .iUpbyz {
    --template-columns: 6;
  }
  .beNxio,
  .ehFQXR {
    --template-columns: 9;
  }
}

.content-list {
  // flex: 1;
  padding: 12px 15px 15px 7px;
  overflow: auto;
  width: 100%;
  height: 100%;
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: flex-start;
  // align-content: flex-start;
  display: grid;
  grid-auto-rows: minmax(1fr, 3.41fr);
  grid-template-columns: repeat(
    calc(
      var(--template-columns) -
        (
          var(--template-reduced-columns) *
            var(--template-reduced-columns-multiplier)
        )
    ),
    minmax(0, 1fr)
  );
  // gap: var(--template-column-gutters);
  gap: 24px;
  text-align: justify;
  .list-item {
    display: inline-block;
    margin: 17px 0px 17px 0px;
    // width: 200px;
    height: 100%;
    transition: all 1s;
    .item-box {
      width: 100%;

      // height: 235px;
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

      .item-img {
        transition: all 1s;
        // width: 160px;
        height: 160px;
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
      .item-mar {
        height: 210px;
        margin-top: 10px;
        margin-bottom: 10px;
      }

      .item-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        height: 40px;

        .item-icon {
          img {
            height: 14px;
            display: inline-block;
            margin-right: 6px;
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
        // width: 228px;
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
#contList {
  .iDCpHK,
  .iUpbyz {
    .item-icon {
      img {
        height: 16px;
        display: inline-block;
        margin-right: 8px;
      }
    }
  }
}
</style>
