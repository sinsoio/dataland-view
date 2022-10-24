<template>
  <el-dialog
    top="5vh"
    :visible.sync="visible"
    :width="width + 'px'"
    @close="close()"
    :close-on-click-modal="false"
  >
    <div slot="title" class="dialog-title" v-if="titleShow">
      <img src="@/assets/img-logo2.png" />
      <span class="title-content">{{ dialogTitle }}</span>
    </div>

    <div
      class="content"
      :class="{
        'no-footer-content': !footerShow,
        'no-title-content': !titleShow
      }"
    >
      <slot name="content"></slot>
    </div>

    <div slot="footer" class="dialog-footer" v-if="footerShow">
      <div @click="close()" class="public-btn dialog-cancel-btn dialog-btn">
        Cancel
      </div>
      <div
        @click="handlerConfirm()"
        class="public-btn dialog-btn dialog-confirm-btn"
      >
        Confirm
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'index',
  props: {
    titleShow: {
      type: Boolean,
      default: true
    },
    footerShow: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 600
    },
    dialogTitle: {
      type: String,
      default: 'title'
    }
  },
  data() {
    return {
      visible: false
    }
  },

  created() {},
  methods: {
    open() {
      this.visible = true
    },
    handlerConfirm() {
      this.$emit('confirmFun')
    },
    close() {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  background: #e6ecf0;
  border-radius: 20px;

  input::placeholder {
    color: #7f8894;
  }

  .el-dialog__header {
    padding: 0;

    .el-dialog__close {
      color: #fff;
    }
  }

  .el-dialog__body {
    padding: 0;

    .content {
      border-right: 4px solid #66c7ff;
      border-left: 4px solid #66c7ff;
      padding: 30px 50px 15px;

      .el-form-item {
        .el-form-item__label {
          line-height: inherit;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          color: $fontColor;
          font-weight: inherit;
          height: 50px;
          padding: 0 15px 0 0;
        }

        .el-form-item__content {
          .el-input__inner {
            height: 50px;
            line-height: 50px;
            padding: 0 12px;
            background: #d3dadd;
            border: 1px solid #d2d2d2;
          }
        }
      }
    }

    .no-footer-content {
      border-bottom: 4px solid #66c7ff;
      border-bottom-right-radius: 20px;
      border-bottom-left-radius: 20px;
    }

    .no-title-content {
      border-top: 4px solid #66c7ff;
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
    }
  }

  .el-dialog__footer {
    padding-top: 15px;
    padding-bottom: 30px;
    border-right: 4px solid #66c7ff;
    border-left: 4px solid #66c7ff;
    border-bottom: 4px solid #66c7ff;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}

.dialog-title {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 22px;
  background: #eef0f5;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  height: 56px;
  background: linear-gradient(90deg, #0a3f62 0%, #2890cd 100%);

  .title-content {
    width: calc(100% - 70px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  img {
    margin-right: 14px;
  }
}
</style>
