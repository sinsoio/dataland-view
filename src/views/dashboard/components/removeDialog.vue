
<template>
  <div class='remove'>
    <public-dialog ref="publicDialog" :width='700'  :dialog-title='dialogTitle' @confirmFun='confirmFun'>
      <template slot='content'>
        {{dialogContent}}
      </template>

    </public-dialog>
  </div>
</template>

<script>
import PublicDialog from '@/components/PublicDialog'
import {$removeFolder,$removeFile} from '@/api/user'
export default {
  name: 'removeDialog',
  props: {

  },
  components: {
    PublicDialog
  },
  data() {
    return {
      id:'',
      type:1,
      dialogTitle:'',
      dialogContent:""
    }
  },
  methods: {
    open(obj) {

      this.$refs.publicDialog.open();
      this.id = obj.id;
      this.type = obj.type;
      this.dialogTitle =
        obj.type == 1 ? `Delete Folder: ${obj.name}` : `Remove Item: ${obj.name}`;

      let contentFolder =
        "Collected and created files can not be deleted .Those files will move to root folder.";
      let contentItem = "Item will be removed from dataland.";

      this.dialogContent = obj.type == 1 ? contentFolder : contentItem;
    },
    confirmFun(){
      this.$Loading.loadingShow();
      let obj = {
        id:this.id
      }
      let backData;
      if(this.type==1){
        $removeFolder(obj).then((res)=>{
          this.$Loading.loadingHide();
          this.$message({
            message:'success',
            type:'success'
          })
          backData = res;
        })
      }else{
        $removeFile(obj).then((res)=>{
          this.$Loading.loadingHide();
          this.$message({
            message:'success',
            type:'success'
          })
          backData = res;
        })

      }
      this.$emit('confirmCallback',{name:'remove',data:{backData,type:this.type}})
      this.$refs.publicDialog.close();

    }

  }

}
</script>

<style scoped>

</style>
