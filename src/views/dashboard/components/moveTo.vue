
<template>
  <public-dialog ref="publicDialog" :width='680'  :dialog-title='dialogTitle' @confirmFun='confirmFun' @close="close">
    <template slot='content'>
      <div class='tree-box'>
        <el-tree
          :props="defaultProps"
          :highlight-current="true"
          :load="loadNode"
          @node-click="handleNodeClick"
          lazy
        >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <img :src="node.expanded?iconArr[0]:iconArr[1]" />
        <span>{{ node.label }}</span>

      </span>
        </el-tree>

      </div>


    </template>

  </public-dialog>
</template>

<script>
import PublicDialog from '@/components/PublicDialog'
import { $getFolderList, $move } from '@/api/user'
import { setToken } from '@/utils/auth'
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
      id:'',
      moveToId:'',
      node_had:null,
      resolve_had:null,
      trees: [],
      iconArr:[require('@/assets/img-icon-file1.png'),require('@/assets/img-icon-file2.png')],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: 'leaf'
      },

      dialogTitle:'',
      type:null,


    }
  },
  methods:{
    close(){
      this.moveToId ='';

    },
    open(obj) {

      this.id = obj.id;
      this.type = obj.type;
      if(this.node_had){
        this.node_had.childNodes = [];
        this.loadNode(this.node_had,this.resolve_had)
      }

      this.dialogTitle = (obj.type==1?'Move Folder:':'Move Item:') + obj.name;
      this.$refs.publicDialog.open();
    },

    loadNode(node,resolve) {

        if (node.level === 0) {
          this.node_had = node;
          this.resolve_had = resolve;
          this.getFolderList(0).then(
            (result) => {
              return resolve(result);
            }
          )
        }
        if (node.level >= 1) {
          this.getFolderList(node.data.id).then(
            (result) => {
              return resolve(result);
            }
          )
        }
    },
    getFolderList(id) {
      return new Promise((resolve, reject) => {

        $getFolderList({ id }).then((res) => {
            for(let i=0;i<res.length;i++){
              if(res[i].children.length>0){
                res[i].leaf = false;
              }else{
                res[i].leaf = true;
              }

            }
          resolve(res);

        })

      })
    },
    confirmFun(){
      if(this.moveToId){
        this.$Loading.loadingShow();
        let type = this.type == 1 ? "folder" : "file";
        $move({
          id:this.id,
          folderId:this.moveToId
        },type).then((res)=>{
          this.$Loading.loadingHide();
          this.$emit('confirmCallback',{name:'moveTo',data:res});
          this.$refs.publicDialog.close();
        })
      }else{
        this.$message({
          type:'warning',
          message:'Select a folder'
        })
      }


    },
    handleNodeClick(node){
       this.moveToId = node.id;


    },
  }
}
</script>

<style scoped lang='scss'>
.tree-box{
  border: 1px solid #CDCDCD;
  height:376px;
  overflow-y:auto;
  ::v-deep{
    .el-tree{
      background: #E6ECF0;


      .is-current {
        /*.el-tree-node__content{
          background-color: #D5E2E9;
        }*/
      }
      .el-tree-node__content{

        height: 50px;
        font-size: 16px;
        .custom-tree-node{
          display: flex;
          align-items: center;
          img{
            margin-right: 8px;
          }
        }
        &:hover{
          background: #D5E2E9;
        }
      }

      /* #D5E2E9*/
    }
  }
  ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
    background-color: #D5E2E9;
  }
}

</style>
