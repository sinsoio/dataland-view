
<template>
  <div class='addNFT'>
    <public-dialog ref="publicDialog" :width='680'  :dialog-title='dialogTitle' @confirmFun='confirmFun' @close='close'>
      <template slot='content'>
        <el-form ref='form' :model='form' class='form' :rules='formRules' autocomplete='on' label-position='right' label-width="100px">
          <el-form-item label='Name:' prop='folderName'>
            <el-input
              v-model="form.folderName"
              placeholder="Folder name less than 50 characters"
            ></el-input>

          </el-form-item>
        </el-form>
      </template>

    </public-dialog>
  </div>
</template>

<script>
import PublicDialog from '@/components/PublicDialog'
import {$createNewFolder} from '@/api/user'
export default {
  name: 'reNameDialog',
  components: {
    PublicDialog
  },
  props:{
    parentId:{
      type:Number,
      require:true
    }
  },
  data(){
    return{
      dialogTitle:'Create New Folder',
      form:{
        folderName:''
      },
      formRules: {
        folderName:  [{required: true,max:50, message:'Incorrect Input',trigger: "blur" }]
      },


    }
  },
  watch:{

  },
  created() {

  },
  mounted() {
    //this.topId = this.parentId

  },
  methods:{
    open(obj) {

      this.$refs.publicDialog.open();
    },
    confirmFun(){

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$Loading.loadingShow();
          let obj= Object.assign({parentId: this.parentId},this.form);

          $createNewFolder(obj).then((res)=>{
            this.$Loading.loadingHide();
            this.$emit('confirmCallback',{name:'newFolder',data:res});
            this.$refs.publicDialog.close();
          })
        } else {
          return false;
        }
      });



    },
    close(){
      this.form.folderName = '';
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
