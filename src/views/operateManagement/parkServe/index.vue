<template>
    <div class="parkServe">
        <div class="serveTop">
            <div class="topData">
                <div class="bgc" v-for="(item, index) in statisticsObj" :key="index">
                    <div class="leftText">
                        <span class="bottomText">{{item.name}}{{cardData && cardData[item.value]}}{{item.unit}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="tabYearMounth">
            <span :class=" tabIndex == 0 ? 'bluebg' : 'whitebg' " @click="tabClick(0)">本年</span>
            <span :class=" tabIndex == 1 ? 'bluebg' : 'whitebg' " @click="tabClick(1)">本月</span>
        </div>
        <div class="serveCenter">
            <div class="lServer">
                <div class="titles">
                    维修占比-按维修分类
                </div>
                <div class="itemPie">
                    <ve-ring
                    :data="industryChartData"
                    :settings="piechartSettings"
                    height="100%"
                    :extend="piechartExtend"
                    :grid="grids"
                  ></ve-ring>
                </div>
                <!-- <div class="itemPie">
                    <ve-ring
                    :data="industryChartData"
                    :settings="piechartSettings1"
                    height="100%"
                    :extend="piechartExtend"
                    :grid="grids"
                  ></ve-ring>
                </div> -->
            </div>
            <div class="rServer">
                <div class="titles">
                    维修趋势分析
                </div>
                <ve-line
                    :settings="lineChartSettings"
                    :data="lineChartDatas"
                    :extend="chartExtend"
                    height="100%"
                    :grid="grids"
                ></ve-line>
            </div>
        </div>
        <div class="serveBottom">
            <div class="lServer">
                <div class="totals">
                    服务评价率 <br /> 80%
                </div>
                <div class="progList">
                    <div class="titles">
                        服务满意度分析
                    </div>
                    <div class="charts">
                        <div  class="progItem" v-for="(item, index) in progLists" :key="index">
                            <dv-decoration-9  :dur="10">{{item.value}}%</dv-decoration-9>
                            <div class="chatsDes">{{ item.companyOrtype }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rServer">
                <div>服务满意度排行</div>
                <ve-histogram
                    :settings="lineChartSettings"
                    :data="lineChartServeData"
                    :extend="chartExtend"
                    height="100%"
                    :grid="grids"
                ></ve-histogram>
            </div>
        </div>
    </div>
</template>
<script>
  import { countByType, IncomeStatus, maintenancecount } from "@/api/operateManagement"
export default{
    data(){
        return{
            grids: {
                top: 0,
                bottom: 20
            },
            piechartExtend: {
                series: {
                    center: ["50%", "50%"]
                },
                legend: {
                    show: false,
                    pageTextStyle: {
                    color: "#000" //翻页数字颜色
                    },
                    pageIconColor:'#206aff',
                    pageIconInactiveColor:'#202230',
                    // type: "scroll",
                    textStyle: {
                    color: "#000" //图例字体颜色
                    },
                    width: '20%',
                    left: '50%',            //设置位置
                    top: '20%',
                }
            },
            piechartSettings: {
                radius: ["30%", "50%"],
                labelMap: {
                    companyOrtype: "企业",
                    value: "数量"
                },
            },
            piechartSettings1: {
                radius: ["0%", "50%"],
                labelMap: {
                    companyOrtype: "企业",
                    value: "数量"
                },
            },
            industryChartData: {},
            grids: {
                top: 30,
                bottom: 20
            },
            lineChartSettings:{
                // area: true,//是否显示为面积图
                itemStyle:{ //面积图颜色设置
                    color:{
                        type:'linear',
                        colorStops:[
                            {
                                offset: 0,
                                color: 'rgba(80, 135, 236, 1)', // 0% 处的颜色
                            }, 
                            {
                                offset: 1, 
                                color: 'rgba(80, 135, 236, 1)' // 100% 处的颜色
                            },
                        ],
                        globalCoord: false // 缺省为 false
                    }
                        
                },
                labelMap: {
                value: "数量",
                companyOrtype: "时间",
                }
            },
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
                    splitNumber: 9,
                    min: 'dataMin' ? '0' : 0, //取最小值为最小刻度
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
                    show: false,
                    length: 4
                    },
                    boundaryGap: false,
                    axisLabel: {
                    color: "#000"
                    }
                }
            },
            chartcarDatas: {},
            lineChartDatas: {},
            statisticsObj:[{
                name: "本年维修",
                value: 'Statisticsforthisyear',
                unit: '次'
            },
            {
                name: "去年维修",
                value: 'StatisticsforLastyear',
                unit: '次'
            },
            {
                name: "本月维修",
                value: 'Statisticsforthismonth',
                unit: '次'
            },
            {
                name: "上月维修",
                value: 'StatisticsforLastmonth',
                unit: '次'
            },
            {
                name: "今日维修",
                value: 'Statisticsforthisday',
                unit: '次'
            },
            {
                name: "昨日维修",
                value: 'Statisticsforthisday',
                unit: '次'
            }],
            progLists:[
                {
                    companyOrtype: '',
                    value: ''
                }
            ],
            lineChartServeData: {},
            cardData: {},
            tabIndex: 0
        } 
    },
    created(){

    },
    mounted(){
        this.initFn();
    },
    methods:{
        // 初始化方法
        initFn(){
            // this.countByType();
            // this.IncomeStatus();
            this.maintenancecount();
        },
        // 企业按产业类型分布
        countByType(){
            countByType().then(res=>{
            let data = {
                columns: ["companyOrtype", "value"],
                rows: res.data
            };
            this.industryChartData = data
            })
        },
        // 年月切换
        tabClick(val){
            this.tabIndex = val;
            this.maintenancecount();
        },
        IncomeStatus(){
            IncomeStatus().then(res=>{
            if(res.data){
                let data = {
                columns: ["companyOrtype", "value"],
                rows: res.data
                };
                this.lineChartDatas = data
            }
            })
        },
        maintenancecount(){
            maintenancecount().then(res=>{
                this.cardData = res.data;
                this.progLists = res.data.evaluationstatistics
                let serveData = {
                    columns: ["companyOrtype", "value"],
                    rows: res.data.personnelstatistics
                }
                this.lineChartServeData = serveData
                if(this.tabIndex){
                    // 按维修分类
                    let data = {
                        columns: ["companyOrtype", "value"],
                        rows: res.data.Classificationstatisticsforyear
                    };
                    this.industryChartData = data;
                    // 维修趋势分析
                    let temp = {
                        columns: ["companyOrtype", "value"],
                        rows: res.data.Statisticsbyyear
                    };
                    this.lineChartDatas = temp;
                }else{
                    let data = {
                        columns: ["companyOrtype", "value"],
                        rows: res.data.ClassificationstatisticsforMonth
                    };
                    this.industryChartData = data;
                    let temp = {
                        columns: ["companyOrtype", "value"],
                        rows: res.data.Statisticsbymonth
                    };
                    this.lineChartDatas = temp;
                }
                
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.parkServe{
    padding: 10px;
}
.serveTop{
    height: 100px;
}
.serveCenter{
    height: 350px;
    display: flex;
    .lServer{
        flex: 1;
        display: flex;
        flex-direction: column;
        .itemPie{
            flex: 1;
        }
    }
    .rServer{
        flex: 1;
        display: flex;
        flex-direction: column;
    }
}
.serveBottom{
    height: 280px;
    display: flex;
    .lServer{
        flex: 1;
        display: flex;
        justify-content: space-around;
        // align-items: center;
        .totals{
            width: 15%;
            text-align: center;
            line-height: 26px;
            display: flex;
            align-items: center;
        }   
        .progList{
            width: 85%;
            display: flex;
            flex-direction: column;
            .titles{

            }
            .charts{
                display: flex;
                justify-content: space-between;
                height: 90%;
                align-items: center;
                .progItem{
                    width: 100px; 
                    height: 100px;
                    margin: 5px;
                    .chatsDes{
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                    }
                }
            }
        }
    }
    .rServer{
        flex: 1;

    }
}
.tabYearMounth{
    height: 50px;
    span{
        padding: 10px 20px;
        cursor: pointer;
        margin-right: 10px;
    }
    .tabActive{
        // color: rgb(53, 109, 238);
    }
}
.topData{
    display: flex;
    height: 40px;
    width: 100%;
  }
  .bgc{
    flex:1;
    display: flex;
    //background-color: #202230;
    box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);

    height: inherit;
    border-radius: 8px;
    // cursor: pointer;
    margin:10px 5px;
    align-items: center;
    justify-content: space-around;
    padding:10px 0;
    &:first-child{
        margin-left:0;
    }
    &:last-child{
        margin-right:0;
    }
}
.bluebg {
  color: white;
  background-color: #206aff;
}
.whitebg {
  color: #206aff;
  background-color: white;
  border: 1px solid #dcdfe6;
}
</style>