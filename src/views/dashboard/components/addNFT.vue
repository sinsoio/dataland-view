<template>
  <div class="addNFT">
    <public-dialog
      ref="publicDialog"
      :width="680"
      :dialog-title="dialogTitle"
      @confirmFun="confirmFun"
      @close="close"
    >
      <template slot="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="By URL" name="ByURL">
            <el-form
              ref="form"
              :model="form"
              class="form"
              :rules="formRules"
              autocomplete="on"
              label-position="right"
              label-width="100px"
            >
              <el-form-item label="NFT URL:" prop="sourceUrl">
                <el-input v-model="form.sourceUrl" placeholder="NFT URL">
                </el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="By Contract and TokenID" name="ByContract">
            <el-form
              ref="contractForm"
              :model="contractForm"
              class="form"
              :rules="contractFormRules"
              autocomplete="on"
              label-position="right"
              label-width="100px"
            >
              <el-form-item label="Chain:" prop="sourceUrl">
                <el-select v-model="contractForm.sourceUrl">
                  <el-option
                    v-for="item in chain"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Contract  Address:" prop="address">
                <el-input
                  v-model="contractForm.address"
                  placeholder="Contract Address"
                ></el-input>
              </el-form-item>
              <el-form-item label="TokenID:" prop="tokenID">
                <el-input
                  v-model="contractForm.tokenID"
                  placeholder="TokenID"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>
    </public-dialog>
  </div>
</template>

<script>
import PublicDialog from '@/components/PublicDialog'
import { $collection } from '@/api/user'
export default {
  name: 'reNameDialog',
  components: {
    PublicDialog
  },
  props: {
    parentId: {
      type: Number,
      require: true
    }
  },
  watch: {},
  data() {
    return {
      chain: [
        {
          label: 'Ethereum',
          value: 'https://www.nftscan.com'
        },
        {
          label: 'Polygon',
          value: 'https://polygon.nftscan.com'
        }
      ],
      activeName: 'ByURL',
      dialogTitle: 'Add Favorite NFT',
      form: {
        sourceUrl: ''
      },
      formRules: {
        sourceUrl: [
          { required: true, message: 'NFT URL is required', trigger: 'blur' }
        ]
      },
      contractForm: {
        sourceUrl: 'https://www.nftscan.com',
        address: '',
        tokenID: ''
      },
      contractFormRules: {
        sourceUrl: [
          { required: true, message: 'NFT URL is required', trigger: 'blur' }
        ],
        address: [
          { required: true, message: 'address is required', trigger: 'blur' }
        ],
        tokenID: [
          { required: true, message: 'tokenID is required', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    open(obj) {
      this.$refs.publicDialog.open()
    },
    handleClick(tab, event) {},

    confirmFun() {
      let validForm = this.activeName == 'ByURL' ? 'form' : 'contractForm'
      this.$refs[validForm].validate((valid) => {
        if (valid) {
          let obj
          this.$Loading.loadingShow()
          if (this.activeName == 'ByURL') {
            obj = Object.assign({ folderId: this.parentId }, this.form)
          } else {
            obj = {
              sourceUrl: `${this.contractForm.sourceUrl}/${this.contractForm.address}/${this.contractForm.tokenID}`,
              folderId: this.parentId
            }
          }
          $collection(obj)
            .then((res) => {
              if (!res.errorCode) {
                this.$emit('confirmCallback', { name: 'addNFT', data: res })
                this.$message.success('Collection success')
              }
              this.$Loading.loadingHide()
              this.$refs.publicDialog.close()
            })
            .catch(() => {
              this.$Loading.loadingHide()
            })
        } else {
          return false
        }
      })
    },
    close() {
      this.activeName = 'ByURL'
      this.form = {}
      this.contractForm = {}
      this.$refs.form.resetFields()
      this.$refs.contractForm.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-tabs__nav-wrap::after {
  background-color: #e6ecf0;
}
::v-deep .el-tabs__item {
  font-weight: bold;
  font-size: 16px;
}
::v-deep .el-form-item__label {
  word-break: break-word;
}
::v-deep .el-tabs__item.is-active {
  color: #13171c;
}
::v-deep .el-tabs__header {
  margin-bottom: 40px;
}
</style>
