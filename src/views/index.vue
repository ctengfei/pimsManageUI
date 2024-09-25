<template>
  <div class="home">
    <div class="">
      <el-carousel height="361px">
        <el-carousel-item class="carouselItem" v-for="(item, index) in imgList" :key="index">
          <img class="bgclass" :src="item.url" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="posiAbsolute">
      <div class="menusArr">
        <div
          class="itemChild"
          :class="{ actives: activeIndex == index }"
          v-for="(item, index) in menuList"
          :key="index"
          @mouseover="mouseOver(item, index)"
          @mouseleave="mouseLeave(item, index)"
          @click="handRoutter(item, index)"
        >
          <img :src="item.imgUrl" alt="" style="width: 98px; height: 90px" />
          <h4>{{ item.name }}</h4>
        </div>
      </div>
    </div>
    <div class="remarks">
      <div v-for="(item, index) in detailList" :key="index">
        <div v-if="activeIndex == index">
          <div class="remarkTitle">
            <img :src="item.imgSrc" alt="" />
            {{ item.name }}
          </div>
          <div class="desRemarks">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      // 版本号
      version: '3.6.0',
      imgList: [
        {
          url: require('@/assets/images/indexImg/banner1.png'),
          title: ''
        }
      ],
      menuList: [
        // {
        //   name: "综合安防",
        //   imgUrl: require("@/assets/images/indexImg/1.png"),
        //   path: "Splitscreen",
        // },
        {
          name: '便捷通行',
          imgUrl: require('@/assets/images/indexImg/2.png'),
          path: 'CarPassingRecord'
        },
        // {
        //   name: '设备管理',
        //   imgUrl: require('@/assets/images/indexImg/3.png'),
        //   path: 'Information'
        // },
        {
          name: '空间管理',
          imgUrl: require('@/assets/images/indexImg/4.png'),
          path: 'Meeting'
        },
        {
          name: '环境管理',
          imgUrl: require('@/assets/images/indexImg/5.png'),
          path: 'EnvironMonitors'
        },
        {
          name: '能耗管理',
          imgUrl: require('@/assets/images/indexImg/6.png'),
          path: 'Energywarning'
        },
        {
          name: '运营管理',
          imgUrl: require('@/assets/images/indexImg/7.png'),
          path: ''
        },
        {
          name: '一标三实',
          imgUrl: require('@/assets/images/indexImg/8.png'),
          path: 'Ythcj'
        }
        // {
        //   name: '系统管理',
        //   imgUrl: require('@/assets/images/indexImg/9.png'),
        //   path: 'User'
        // }
      ],
      activeIndex: 0,
      detailList: [
        // {
        //   name: "综合安防",
        //   imgSrc: require("@/assets/images/indexImg/des1.png"),
        //   content:
        //     "集成视频监控、智能行为分析、报警等各类安防子系统，实现各类安防子系统的统一管理，实现视频监控与其他安防子系统的联动防范，形成集成化、数字化、智能化的综合安防管理平台，提升园区安全管理效率，并降低园区安全管理成本。",
        // },
        {
          name: '便捷通行',
          imgSrc: require('@/assets/images/indexImg/des2.png'),
          content: '该模块集成停车管理、访客管理、门禁管理子系统，能够实时监测人、车在园区内的通行情况及园区停车位的使用情况，同时能够实时查询各类人员及车辆的通行记录。'
        },
        // {
        //   name: '设备管理',
        //   imgSrc: require('@/assets/images/indexImg/des3.png'),
        //   content: '对园区内不同类型不同厂商的设备信息进行集中管理，包括设备基础信息管理、设备事件管理。提供统一的设备监控中心，集成各类设备子系统上报的告警信息，并提供告警事件处置功能。'
        // },
        {
          name: '空间管理',
          imgSrc: require('@/assets/images/indexImg/des4.png'),
          content:
            '对园区空间资源进行统一管理，包括商铺空间、公寓、办公空间、会议室等，并与租赁管理系统、财务管理系统进行对接，实时掌握空间资源状态（空间资源信息、租赁合同、缴费情况），实现园区空间资源的规范化管理。'
        },
        {
          name: '环境空间',
          imgSrc: require('@/assets/images/indexImg/des5.png'),
          content: '展示实时天气情况及各监测点环境空间指标数据，环境指标数据包含温度、湿度、PM2.5、风速风向、噪声、有害气体等。'
        },
        {
          name: '能耗管理',
          imgSrc: require('@/assets/images/indexImg/des6.png'),
          content: '实现能效可视化管理，能源利用清晰可见，建立完善的能耗强度、能效值、能耗量等KPI指标体系，全面掌握能源动态；通过优化前后数据对比可视化展示，准确获取各用能单位或设备的节能收益。'
        },
        {
          name: '运营管理',
          imgSrc: require('@/assets/images/indexImg/des7.png'),
          content: '对接物业系统、门禁系统、停车系统等与园区运营相关的系统，获取运营数据，建立分析模型，为园区管理者提供园区运行数据展示。'
        },
        {
          name: '一标三实',
          imgSrc: require('@/assets/images/indexImg/des8.png'),
          content: '建立标准地址库，并依据标准地址，实现实有人口、实有房屋、实有单位基础信息录入，实现关联管理、查询，并对数据进行汇总。'
        },
        {
          name: '统一权限管理',
          imgSrc: require('@/assets/images/indexImg/des9.png'),
          content: '提供用户权限管理、组织管理、系统配置、工作组管理、联系人管理等功能。'
        }
      ],
      visible: true
    }
  },
  methods: {
    goTarget(href) {
      window.open(href, '_blank')
    },
    handRoutter(item, idx) {
      this.activeIndex = idx
      this.visible = true
      //判断path中是否包含http
      if (item.path.startsWith('http')) {
        window.location.href = item.path
      } else {
        this.$router.push({ name: item.path })
      }
    },
    mouseLeave(item, idx) {
      this.activeIndex = idx
      this.visible = false
    },
    mouseOver(item, idx) {
      this.activeIndex = idx
      this.visible = true
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  font-family: 'open sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  position: relative;
  height: 100%;
  background: #f6faff;
  margin: 20px;
}
.carouselItem {
  text-align: center;
}
.posiAbsolute {
  position: relative;

  z-index: 999;
  padding-top: 20px;
  width: 100%;
  margin-top: -100px;
  padding-bottom: 7px;
  border-bottom: solid 2px #1965ed;
  background-image: linear-gradient(top, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 1) 100%);
}
.actives {
  width: 137px;
  margin-bottom: -7px;
  border-bottom: solid 7px #1965ed;
  position: relative;
  &::after {
    content: ' ';
    position: absolute;
    bottom: -30px;
    left: 50px;
    width: 0px;
    height: 0px;
    border: 20px solid transparent;
    border-bottom-color: #fff;
  }
}
.menusArr {
  display: flex;
  justify-content: space-around;
  align-content: center;
  align-items: center;
  text-align: center;
  font-size: 24px;
  color: #6b6b6b;
  font-weight: 600;
  width: 1635px;
  margin: 0 auto;
  .itemChild {
    width: 140px;
    height: 172px;
    cursor: pointer;
  }
}
.remarks {
  height: 300px;
  margin: 20px 20px 0;
  padding: 20px;
  background: #fff;
}
.remarkTitle {
  font-size: 20px;
  font-weight: 600;
  color: #1965ed;
  line-height: 28px;
  margin-top: 10px;
  img {
    margin-right: 7px;
  }
}
.desRemarks {
  font-size: 18px;
  font-weight: 400;
  color: #5f5f5f;
  line-height: 32px;
  margin-top: 30px;
  margin-left: 20px;
}
</style>
