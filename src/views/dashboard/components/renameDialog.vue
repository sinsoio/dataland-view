
<template>
  <div class='reName'>
    <public-dialog ref='publicDialog' :width='680' :dialog-title='dialogTitle' @confirmFun='confirmFun' @close='close'>
      <template slot='content'>
        <el-form ref='form' :model='form' class='form' :rules='formRules' autocomplete='on' label-position='right'
                 label-width='100px'>
          <el-form-item label='New Name' prop='folderName'>
            <el-input
              v-model='form.folderName'
              placeholder='FolderName less than 50 characters'
            ></el-input>

          </el-form-item>
        </el-form>
      </template>

    </public-dialog>
  </div>
</template>

<script>
import PublicDialog from '@/components/PublicDialog'
import { $uploadFolderName } from '@/api/user'

export default {
  name: 'reNameDialog',
  components: {
    PublicDialog
  },
  data() {
    return {
      id: '',
      dialogTitle: 'Rename Folder',
      form: {
        folderName: ''
      },
      formRules: {
        folderName: [{ required: true, max: 50, message: 'Incorrect Input', trigger: 'blur' }]
      }

    }
  },
  methods: {
    open(obj) {
      this.id = obj.id
      this.form.folderName = obj.name

      this.$refs.publicDialog.open()
    },
    confirmFun() {

      this.$Loading.loadingShow();
      let obj = Object.assign({ id: this.id }, this.form)
      $uploadFolderName(obj).then((res) => {
        this.$Loading.loadingHide();
        this.$message({
          message: 'success',
          type: 'success'
        })
        this.$emit('confirmCallback', { name: 'reName', data: this.form })
        this.$refs.publicDialog.close()
      })


    },
    close(){
      this.$refs.form.resetFields()
    }

  }
}
</script>

<style scoped>

</style>
