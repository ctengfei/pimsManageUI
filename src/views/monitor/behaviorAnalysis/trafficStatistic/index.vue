<template>
    <div class="app-container">
      <div class="boxs">
        <el-form
            :model="formSearch"
            ref="formSearch"
            label-width="80px"
            inline
            v-if="showSearch"
        >
            <el-form-item label="通道" prop="channelCode">
            <el-select
                v-model="formSearch.channelCode"
                placeholder="请选择通道"
                style="width: 100%"
                >
                <el-option
                    v-for="item in channelCodeArr"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                ></el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="选择日期" prop="queryDate">
                <el-date-picker
                v-model="formSearch.queryDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="selectDate"
                :clearable="false"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="onSearch()">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="onReset()">重置</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" @click="onExport()">导出</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="onSearch"></right-toolbar>
        </el-row>
        <el-row  class="boxBottom">
        <el-col :span="24">
            <div style="width: 100%; height: 300px">
                <ve-histogram
                :data="personOut"
                :extend="chartExtend"
                height="100%"
                :grid="grids"
                >
                </ve-histogram>
            </div>
        </el-col>
        </el-row>
        <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="channelName" label="通道任务（园区输入口名称）" show-overflow-tooltip></el-table-column>
              <el-table-column prop="recordHour" label="时段"></el-table-column>
              <el-table-column prop="enterNum" label="进入人数" show-overflow-tooltip />
              <el-table-column prop="leaveNum" label="离开人数" show-overflow-tooltip />
            </el-table>
            <!-- <div class="bottom">
            <pagination
              v-show="tableData && tableData.length > 0"
              @pagination="handleCurrentChange"
              :page.sync="formSearch.pageNum"
              :pageSizes="[10, 20, 30, 40]"
              :limit.sync="formSearch.pageSize"
              :layout="'total, sizes, prev, pager, next'"
              :total="total"
            />
          </div> -->
      </div>
    </div>
  </template>
  
  <script>
  import pagination from "@/components/comPagination";
  import { getList, exportList, getChannelEnum } from "@/api/monitor/behaviorAnalysis"
    import { formatData, downloadFile } from '@/utils/index'

  export default {
    name: 'TrafficStatistic',
    components:{
        pagination
    },
    data() {
      return {
        grids: {
          top: 40,
          bottom: 20
        },
        showSearch:true,
        chartExtend: {
          legend: {
            show: false,
            pageTextStyle: {
              color: "#000" //翻页数字颜色
            },
            pageIconColor:'#206aff',
            pageIconInactiveColor:'#202230',
            textStyle: {
              color: "#000"
            },
          },
          xAxis: {
            show: true,
            // 坐标轴轴线
            axisLine: {
              show: true
            },
            // 坐标轴刻度
            axisTick: {
              show: false
            },
            // 坐标轴每项的文字
            axisLabel: {
              showMaxLabel: true,
              showMinLabel: true,
              color: "#000",
              rotate: 0, //刻度文字旋转，防止文字过多不显示
              margin: 8, //文字离x轴的距离
              boundaryGap: true
              // backgroundColor:'#0f0',
            },
            // X轴下面的刻度小竖线
            axisTick: {
              show: false,
              alignWithLabel: true, //axisLabel.boundaryGap=true时有效
              interval: 0,
              length: 4 //长度
            },
            // x轴对应的竖线
            splitLine: {
              show: false,
              interval: 0,
              lineStyle: {
                color: "red",
                backgroundColor: "red"
              }
            }
          },
          yAxis: {
            show: true,
            offset: 0,
            splitNumber: 5,
            min: 'dataMin' ? 'dataMin' : 10, //取最小值为最小刻度
            max: 'dataMax' ? 'dataMax' : 100, //取最大值为最大刻度
            minInterval: 5, //分割刻度
            scale: true, //自适应
            // 坐标轴轴线
            axisLine: {
              show: false
            },
            // x轴对应的竖线
            splitLine: {
              show: true,
              lineStyle: {
                color: "#000",
                opacity: "0.1",
                backgroundColor: "#000"
              }
            },
            // 坐标轴刻度
            axisTick: {
              show: false
            },
            boundaryGap: false,
            axisLabel: {
              color: "#000"
            }
          }
        },
        personOut:{},
        multipleSelection:[],
        value1:"",
        tableData:[],
        formSearch: {
            channelCode:"",
            queryDate:"",
            pageNum: 1,
            pageSize: 24,
        },
        total: 0,
        channelCodeArr:[]
      };
    },
    watch: {},
    created() {},
    mounted() {
        this.getChannelEnums();
        let temp = this.getDateStr(0)
        this.formSearch.queryDate = temp;
        this.formSearch.startTime = this.formSearch.queryDate;
        this.formSearch.endTime = this.formSearch.queryDate;
        setTimeout(() => {
            this.infoData();
        }, 300);
        window.addEventListener("resize", this.resizeTheChart);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resizeTheChart());
    },
    methods: {
        // 获取通道
        getChannelEnums(){
            getChannelEnum().then(res=>{
                this.channelCodeArr = formatData(res.data)
                this.formSearch.channelCode = this.channelCodeArr[0].value
            })
        },
      // 获取日期
      getDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;//获取当前月份的日期
        var d = dd.getDate();
        return y + "-" + `${m}`.padStart(2, "0") + "-" + `${d}`.padStart(2, "0");
      },
      get24HoursTime (){
        let timeArr = []
        for (let i = 0; i < 24; i++) {
          let hour = i < 10 ? `0${i}` : i
          timeArr.push(`${hour}:00`)
        }
        return timeArr
      },
        //   导出
        onExport(){
            exportList(this.formSearch).then(res=>{
                downloadFile(res.data, '人流量进出统计', "xlsx");
                this.$message.success("导出成功")
            })
        },
      // 获取人员进出趋势
      infoData(){
        getList(this.formSearch).then(res=>{
          let row = [];
          let hours = this.get24HoursTime()
          this.tableData = res.data.data
          this.total = res.data.total
          for(let j in res.data.data){
            row.push({
                时间: res.data.data[j].recordHour,
                离开: res.data.data[j].leaveNum,
                进入: res.data.data[j].enterNum,
            });
            
          }
          for (let i = 0; i < 24; i++) {
            const hourStr = `${i}`.padStart(2, "0") + ":00";
            if (!row.some((record) => record.时间 === hourStr)) {
              row.push({ 时间: hourStr, 离开: 0, 进入: 0 });
            }
          }

          row.sort((a, b) => a.时间.localeCompare(b.时间));
          let data = {
            columns: ["时间", "进入", "离开"],
            rows: row
          }
          this.personOut = data;
        })
      },
      // table多选
        handleSelectionChange(val) {
        let tableIds = val.map(item=>item.id)
        this.multipleSelection = tableIds;
        },
      // 切换到第几页了
        handleCurrentChange() {
        // this.formSearch.pageNum = n.page
        this.infoData();
        },
      resizeTheChart() {
        if (this.$refs.linechart) {
          this.$refs.linechart.resize();
        }
        if (this.$refs.histogramchart) {
          this.$refs.histogramchart.resize();
        }
      },
      // 根据车主搜索
        onSearch() {
            this.formSearch.startTime = this.formSearch.queryDate
            this.formSearch.endTime = this.formSearch.queryDate
            this.formSearch.pageNum = 1
            this.infoData();
        },
      // 重置
        onReset(){
          this.formSearch.channelCode = this.channelCodeArr[0].value;
          let temp = this.getDateStr(0);
          this.formSearch.queryDate = temp;
          this.formSearch.startTime = this.formSearch.queryDate;
          this.formSearch.endTime = this.formSearch.queryDate;
          this.formSearch.pageNum = 1
          this.onSearch()
        },
      // 人员进出趋势 选择日期
      selectDate(e){
        this.formSearch.queryDate = e
        this.infoData();
      },
    }
  };
  </script>
  
  <style lang="scss" scoped>

  ::v-deep svg path:first-child {
    stroke: #31364a;
  }
  .color {
    color: #206aff;
  }
  .dateButton{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btns{
      display: flex;
      width: 40%;
      span{
        margin: 0 10px;
        cursor: pointer;
      }
    }
  }
  .boxs{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .boxTop{
    height: 100px;
  }
  .boxBottom{
    width: 100%;
  }
  .focus {
    color: #206aff;
  }
  </style>
  