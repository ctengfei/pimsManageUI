<template>
    <div class="regiontree">
        <el-tree :data="treedata" accordion ref="tree" highlight-current
            @node-click="nodeclick" :expand-on-click-node="false" :props="defaultProps" :default-expanded-keys="expandDefault" node-key="id" >
        </el-tree>
    </div>
</template>

<script>
import $environMonitor from "@/api/environMonitor";
export default {
    data(){
        return{
            treedata: [],
            expandDefault: [], //默认选中第一项
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            buildIdArr:[]
        }
    },
    props: {
        type: {    //判断是noodid还是其他id  奔达灰石
            type: String,
            default:''
        },
        nodeType: {    //判断是设备类型
            type: String,
            default:''
        },
    },
    watch:{
        nodeType(val,oldVal) {
            this.gettree()
            console.log(val,'val')
            console.log(oldVal,'oldVal')
        }
    },
    mounted() {
        this.gettree()
    },
    methods:{
        // 获取设备树  treenode
        gettree() {
            let obj = {}
            if(this.nodeType == 'ammeter'){
                // 电
                obj = {
                    nodeType: 'ammeter',
                }
            }else if (this.nodeType == 'waterMeter'){
                // 水
                obj = {
                    nodeType: 'waterMeter',
                }
            }else if (this.nodeType == 'heatMeter'){
                // 热
                obj = {
                    nodeType: 'heatMeter',
                }
            }else {
                obj = {
                    nodeType: 'detection',
                }
            }
            $environMonitor.treenode(obj).then(res => {
                this.buildIdArr = []
                this.expandDefault = []
                this.treedata = res.data
                this.getId(res.data, this.buildIdArr);
                if(this.type == '0'){
                    this.expandDefault.push(this.buildIdArr[0].id);
                    let obj = {
                        referenceId:this.buildIdArr[0].referenceId,
                        name:this.buildIdArr[0].name,
                        children:this.buildIdArr[0]
                    }
                    this.$nextTick(()=>{
                        this.$refs.tree.setCurrentKey(this.buildIdArr[0].id)
                    })
                    if(this.buildIdArr[0].referenceId){
                        this.$emit('nodeclick',obj)
                    }
                }else if(this.type == '1'){
                    this.expandDefault.push(this.buildIdArr[0].id);
                    this.$nextTick(()=>{
                        this.$refs.tree.setCurrentKey(res.data[0].id)
                    })
                    this.$emit('nodeclick',res.data[0].id)
                }else {
                    this.expandDefault.push(this.buildIdArr[0].id);
                    this.$nextTick(()=>{
                        this.$refs.tree.setCurrentKey(res.data[0].id)
                    })
                    this.$emit('nodeclick',res.data[0].id)
                }
            })
        },
        // 获取默认显示的楼栋id
        getId(data, arr) {
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                if (item && item.children.length == 0) {
                    arr.push(item); //检查出来的数组集合
                } else {
                    if (item && item.children && item.children.length > 0) {
                        this.getId(item.children, this.buildIdArr);
                    }
                }
            }
        },
        nodeclick(data) {
            if(this.type == '0'){
                let obj = {
                    referenceId:data.referenceId,
                    name:data.name,
                    children:data.children
                }
                this.$emit('nodeclick',obj)
            }else if(this.type == '1'){
                this.$emit('nodeclick',data.id)
            }else if(this.type == '2'){
                if(data.children.length >0){
                    this.$emit('nodeclick',data.id)
                }else {
                    this.$message.warning("设备没有诊断数据")
                }
            }
        },
    }
}
</script>

<style lang='scss' scoped>
.regiontree{
    height: 790px;
    width: 280px;
    overflow-y: auto;
    margin-right: 20px;
    background-color:#f5f7fa;
    ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background-color: #409EFF !important;
        color: #fff;
       
    }
    ::v-deep .el-tree-node__label{
        width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
   ::v-deep .el-tree-node__content{
        background-color:#f5f7fa;
    }
}
    
</style>