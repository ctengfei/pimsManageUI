<template>
  <div>
    <div>
      <div class="margin-bottom">
        <el-button type="text" @click="downloadBack"
          ><i class="el-icon-d-arrow-left" /> 返回列表</el-button
        >
      </div>
      <div class="video-web-form-box video-web-flex">
        <div class="flex">
          <div>
            <el-form
              ref="form"
              :inline="true"
              :model="searchForm"
              label-width="80px"
            >
              <!-- <el-form-item label="文件类型">
                <el-select v-model="searchForm.region">
                  <el-option label="全部类型" value="全部类型"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="searchForm.startTime"
                  type="datetime"
                  default-time="00:00:00"
                  placeholder="选择开始时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="searchForm.endTime"
                  type="datetime"
                  default-time="23:59:59"
                  placeholder="选择结束时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="searchButton()"
                >搜索
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                    icon="el-icon-refresh-left"
                    @click="refreshButton()"
                >重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div>
          <el-button
            type="primary"
            @click="downButton()"
            >下载
          </el-button>
          <el-button
            @click="stopDownButton()"
            >停止下载
          </el-button>
        </div>
      </div>
    </div>
    <div>
      <div class="highlight-height-table2 padding-15">
        <template>
          <el-table
            v-loading="isLoading"
            element-loading-text="加载中"
            :data="downTableData"
            height="700"
            style="width: 100%"
            @selection-change="downSelection"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
                label="序号"
                width="100">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="filePath" label="文件名" show-overflow-tooltip />
            <el-table-column
              prop="startTime"
              label="开始时间"
              show-overflow-tooltip
            />
            <el-table-column
              prop="endTime"
              label="结束时间"
              show-overflow-tooltip
            />
            <el-table-column
              prop="fileSize"
              label="文件大小"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="Number(scope.row.fileSize) < 0">/</span>
                <span v-else>{{scope.row.fileSize}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="下载进度"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.downloadRate === '下载完成' || scope.row.downloadRate === '下载失败' || scope.row.downloadRate === ''">{{scope.row.downloadRate}}</span>
                <el-progress v-else  :stroke-width="10" :percentage="scope.row.downloadRate"></el-progress>
              </template>
            </el-table-column> -->
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getHistoryVideo
} from "@/api/videoMange/historyVideo";
import {
  getFuzzyList,
} from "@/api/videoMange/recordVideo";
import { getIvsPlayer } from "@/api/system/organization";

export default {
  props: ["equipment"],
  data() {
    return {
      isLoading: false,
      permission: {
        getSearchVideo: 'monitor::historyVideo::getSearchVideo',
        getHistoryVideo: 'monitor::historyVideo::getHistoryVideo',
        search: "videoMange::recordVideo:search",
      },
      deviceId : null,
      playTimeYYR: '', // 当前播放视频的年月日
      downTableData: [], // 下载列表
      selectedLists: [], //勾选视频
      searchForm: {
        region: "全部类型",
        startTime: "",
        endTime: "",
      },
      downloadRes: {}, // 下载返回的数据
      timer: null,
      // 正在下载文件名称
      fileName: ''
    };
  },
  mounted() {
    // this.infoPage();
    this.getTables();
  },
  methods: {
    getTables(){
      const sj = new Date(
        new Date(new Date().toLocaleDateString()).getTime() - 86400000
      );
      this.playTimeYYR = `${sj.getFullYear()}-${
        sj.getMonth() + 1 > 9 ? sj.getMonth() + 1 : "0" + (sj.getMonth() + 1)
      }-${sj.getDate() > 9 ? sj.getDate() : "0" + sj.getDate()}`;
      const obj = {
        startTime:"",
        endTime:"",
        cameraCode: '',
        domainCode: '',
        pageNum: 1,
        pageSize: 10,
        url: "/sm/ivs/record/list",
        method: "get",
      };
      if(this.equipment.code){
        obj.cameraCode=this.equipment.code.split("#")[0]
        obj.domainCode=this.equipment.code.split("#")[1]
      }
      //   obj.startTime = this.searchform.startTime;
      //   obj.endTime = this.searchform.endTime;
      // debugger
      // if (this.statusTab > 0 &&  this.tagNode.id) {
      //   obj.deviceId = this.tagNode.id;
      // } else if(this.tagNode.id){
      //   obj.nodeId = this.tagNode.id;
      // 
      getFuzzyList(obj).then((res) => {
        this.downTableData = []
        res.data.data.forEach((item, index) => {
          this.downTableData.push({id: index, downloadRate: '', ...item})
        })
      });
    },
    infoPage() {
      this.deviceId = this.equipment.deviceId
      const sj = new Date(
        new Date(new Date().toLocaleDateString()).getTime() - 86400000
      );
      this.playTimeYYR = `${sj.getFullYear()}-${
        sj.getMonth() + 1 > 9 ? sj.getMonth() + 1 : "0" + (sj.getMonth() + 1)
      }-${sj.getDate() > 9 ? sj.getDate() : "0" + sj.getDate()}`;
      const Vdata = {
        deviceId: this.equipment.deviceId,
        startTime: `${this.playTimeYYR} 00:00:01`,
        endTime: `${this.playTimeYYR} 23:59:59`,
      };
    },
    // 搜索按钮
    searchButton() {
      if (!this.searchForm.startTime) {
        this.$message.error("请输入开始时间！");
        return;
      }
      if (!this.searchForm.endTime) {
        this.$message.error("请输入结束时间！");
        return;
      }
      if (
        this.searchForm.startTime.getTime() > this.searchForm.endTime.getTime()
      ) {
        this.$message.error("结束时间必须大于开始时间！");
        return;
      }
      const obj = {
        startTime: this.rTime(this.searchForm.startTime),
        endTime: this.rTime(this.searchForm.endTime),
        cameraCode: this.equipment.code.split("#")[0],
        domainCode: this.equipment.code.split("#")[1],
        pageNum: 1,
        pageSize: 10,
        url: "/sm/ivs/record/list",
        method: "get",
      };
      
      // 录像检索
      this.isLoading = true
      getFuzzyList(obj).then((res) => {
          this.isLoading = false
          this.downTableData = []
          res.data.data.forEach((item, index) => {
            this.downTableData.push({id: index, downloadRate: '', ...item})
          })
          
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 重置
    refreshButton() {
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      this.infoPage()
    },
    // 时间转换为2020-02-02 00:00:00 格式
    rTime(date) {
      let json_date = new Date(date).toJSON();
      return new Date(+new Date(json_date) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
    // 下载流媒体
    downloadVideos(item){
      debugger
      let obj = {
        "cameraCode": item.code,
        "mediaURLParam": {
          "broadCastType": 0,
          "packProtocolType": 1,
          "protocolType": 2,
          "serviceType": 3,
          "streamType": 2,
          "transMode": 0,
          "timeSpan":{
              "startTime": item.startTime,
              "endTime": item.endTime
          }
        }
      }
      getIvsPlayer('/sm/ivs/player/play','POST',obj)
        .then(res => {
          if(res.code == 200){
            this.rtspUrl = res.data.rtspURL
            // let str3 = {"cmd":"play_his","id":"001","time":"2020-08-17 00:00:00.000","camera_id": this.rtspUrl,"camera_name":"摄像头","wnd_index":0,"cmd_id":"001_1 "}
            let str3 = {"cmd":"his_download","id":"001","time":"2020-08-17 00:00:00.000","start_time":"", "end_time":"","cmd_id":"001_1", "camera_id":"", "url":this.rtspUrl,"file_name":item.deviceName,"type":"his"}
            console.log("wc播放命令====",str3)
            this.$store.state.socket.Csock.send(JSON.stringify(str3))
          }
        })
    },
    // 下载
    downButton() {
      if (!this.selectedLists.length) {
        this.$message.info("请至少选择一条数据！")
        return
      }
        this.selectedLists.forEach((item,index)=> {
          this.downloadVideos(item)
        })
    },
    // 停止下载
    stopDownButton() {
     
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      let str = {"cmd":"stop_his_download","id":"001","time":"2020-08-17 00:00:00.000","download_id":1,"cmd_id":"001_1"}
      this.$store.state.socket.Csock.send(JSON.stringify(str))
      
    },

    // 下载的多选框的随时赋值
    downSelection(n) {
      this.selectedLists = []
      n.forEach(ele => {
        this.selectedLists.push(ele)
      });
    },
    downloadBack() {
      this.$emit("downloadBack");
    },
  },
  destroyed() {
    
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/styles/variables";
::v-deep .el-table__empty-block{
  width: 100% !important;
  padding: 0 25% !important;
}
// ::v-deep .el-table__empty-text{
//   padding-top: 150px;
// }
.flex{
  margin-top: 20px;
}
</style>