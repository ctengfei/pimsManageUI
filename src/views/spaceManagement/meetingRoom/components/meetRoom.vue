<template>
    <div class="timetable w100 h100">
      <div class="time-b w100">
        <div>
          
          <div class="tabList" >
            <span :class=" activeTrue == index ? 'activeBg' : 'activeIsBg'" v-for="(item,index) in btnTab" :key="index" @click="tabClick(index)">{{ item.name }}</span>
          </div>
        </div>
        
        <div class="time-controller" v-if="activeTrue">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-arrow-left"
              @click="changeCount(1),getWeek(count)"
            ></el-button>
            <div class="time-detail">{{ startTime }} - {{ endTime }}</div>
            <!-- <el-button round class="date-btn" @click="getWeek(count)">本周</el-button> -->
            <el-button
              type="primary"
              icon="el-icon-arrow-right"
              @click="changeCount(-1),getWeek(count)"
            ></el-button>
          </el-button-group>
        </div>
        <div v-if="!activeTrue">
          <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd"
              v-model="nowDate"
              type="date"
              @change="clickDate"
              placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
      <div class="timetable-b w100">
        <table class="timetable-content w100" id="tableInfo">
          <thead>
            <tr>
              <th></th>
              <th v-for="(item, index) in weeks" :key="index">
                {{ item }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(time , index) in timeArr" :key="time">
                <td>{{ time }}</td>
                <td v-for="(info, infoIndex) in listInfo" :key="infoIndex">
                    <template v-for="(timeInfo, timeKeys) in info.times">
                        <div v-if="deepTimeFmt(time, timeInfo, index)" :key="timeKeys" style="height: 100%;">
                            <div :key="timeInfo.name"
                                style="font-size: 14px; background: #96b2d7; line-height: 16px;height: 100%;display: flex;align-items: center;justify-content: center;">
                                <div style="height: 60px;">
                                  <p>预约人：{{ timeInfo.name }}</p>
                                  <p>联系电话：{{ timeInfo.value }}</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import moment from "moment";
  import { getMeetingList, lookStatus, searchStatus } from "@/api/spaceManagement/meeting";

  export default {
    props:{
      meetingId:{
        type: String,
        default:()=>{
          return ""
        }
      }
    },
    data() {
      return {
        activeTrue: 0,
        btnTab:[
          {
            name: "日视图",
            value: 0
          },
          {
            name: "周视图",
            value: 1
          },
        ],
        startTime: "2022.10.17",
        endTime: "2022.10.23",
        colorList: [], //随机颜色
        weekCourse: [], // 课程详细课程、数量
        weeks: [
            "周一", "周二", "周三", "周四", "周五", "周六", "周日"
        ], //头部周期
        maxCourseLength: 0, //最大课节数,
        count: 0, //上周、下周、本周选择器flag
        listInfo: [
        ],
        timeArr: [
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', "18:30"
        ],
        nowDate:""
      };
    },
    created() {
    },
    mounted(){
      this.getWeek(0);
      this.tabClick(0)
    },
    methods: {
      // 切换日视图和周视图
      tabClick(index){
        this.activeTrue=index
        if(index){
          this.getLookStatus()
        }else{
          let nowDates = moment(new Date()).format("YYYY-MM-DD")
          this.nowDate = nowDates
          this.clickDate(nowDates)
        }
      },
      // 日试图选择日期
      clickDate($e){
        let obj = {
          meetingId:this.meetingId,
          startTime: $e,
          endTime: $e,
        }
        lookStatus(obj).then(res=>{
          this.weeks = res.data.weeks
          this.listInfo = res.data.listInfor
          setTimeout(()=>{
            this.$nextTick(() => {
              this.mergeTable()
            })
          })
        })
      },
      // 获取预约数据
      getLookStatus(){
        let obj = {
          meetingId:this.meetingId,
          startTime: this.startTime,
          endTime: this.endTime,
        }
        lookStatus(obj).then(res=>{
          this.weeks = res.data.weeks
          this.listInfo = res.data.listInfor
          setTimeout(()=>{
            this.$nextTick(() => {
              this.mergeTable()
            })
          })
        })
      },
        // 合并相同列
        mergeTable() { //table表合并相同内容的行
            var tab = document.getElementById("tableInfo");
            // 合并多少列
            var maxCol = this.listInfo.length + 1,
                val, count, start;
            for (var col = maxCol - 1; col >= 0; col--) {
                count = 1;
                val = "";
                for (var i = 0; i < tab.rows.length; i++) {
                    if (val == tab.rows[i].cells[col].innerHTML && val.indexOf('div') > -1) {
                        count++;
                    } else {
                        if (count > 1) {
                            //合并 
                            start = i - count;
                            tab.rows[start].cells[col].rowSpan = count;
                            for (var j = start + 1; j < i; j++) { // 
                                tab.rows[j].cells[col].style.display = "none";
                            }
                            count = 1;
                        }
                        val = tab.rows[i].cells[col].innerHTML;
                    }
                }

                if (count > 1) { //合并，最后几行相同的情况下 
                    start = i - count;
                    tab.rows[start].cells[col].rowSpan = count;
                    for (var j = start + 1; j < i; j++) {
                        tab.rows[j].removeChild(tab.rows[j].cells[col]);
                    }
                }
            }
        },
        // 时间对比
        deepTimeFmt(item, deepitem, index, key, infoIndex) {
            if (item >= deepitem.start && item < deepitem.end) {
                return true
            }
        },
      //改变选择器次数
      changeCount(i) {
        this.count += i;
        return this.count;
      },
      //随机上、本、下周 日期
      getWeek(i) {
        let weekOfDay = parseInt(moment().format("E")); //计算今天是这周第几天
        let last_monday = moment()
          .subtract(weekOfDay + 7 * i - 1, "days")
          .format("YYYY-MM-DD"); //周一日期
        let last_sunday = moment()
          .subtract(weekOfDay + 7 * (i - 1), "days")
          .format("YYYY-MM-DD"); //周日日期
        this.startTime = last_monday;
        this.endTime = last_sunday;
        this.getLookStatus()
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  .tabList{
    display: flex;
    align-content: center;
    align-items: center;
    span{
      width: 80px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:last-child{
        margin-left: 30px;
      }
    }
    
  }
  .activeBg{
    background: #0b6fc6;
    color:#fff;
    
  }
  .activeIsBg{
    background: #eeeeee;
    color:#000;
  }
  .timetable {
    background-color: #f1f7ff;
    .w100 {
      width: 100% !important;
    }
    .h100 {
      height: 100% !important;
    }
    .time-b {
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .time-detail {
        color: #333333;
        font-weight: 700;
        font-size: 16px;
        font-family: "Microsoft YaHei";
      }
    }
    .timetable-b {
      height: 1207px;
      background-color: #fff;
      overflow: auto;
      .timetable-content {
        height: 100%;
        table-layout: fixed;
        border-collapse: collapse; //设置表格的边框是否被合并为一个单一的边框
        text-align: center;
        color: #333333;
        font-weight: 400;
        font-size: 18px;
  
        thead {
          height: 100px;
          th {
            height: 20px !important;
            border: 2px solid rgba(27, 100, 240, 0.1);
          }
        }
        tbody {
          height: calc(100% - 2px) / 7;
  
          td {
            height: 20px !important;
            border: 2px solid rgba(27, 100, 240, 0.1);
            .dmsjandjs-b {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            p{
              line-height: 16px;
              margin: 5px;
            }
          }
        }
      }
    }
  }
  ::v-deep {
    .time-controller {
      .el-button-group {
        display: flex;
        justify-content: center;
        align-items: center;
        .el-button {
          height: 26px;
          background: #ffffff;
          font-size: 16px;
          font-weight: 600;
          border: 1px solid rgba(27, 100, 240, 0.1);
          border-radius: 55px;
          color: #1b64f0;
          display: flex;
          align-items: center;
        }
        :nth-child(2) {
          margin: 0px 12px;
        }
      }
    }
  }
  </style>
  