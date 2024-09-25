<template>
  <div class="home">
    <div class="">
      <el-carousel height="361px">
        <el-carousel-item
          class="carouselItem"
          v-for="(item, index) in imgList"
          :key="index"
        >
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
  name: "",
  data() {
    return {
      // 版本号
      version: "3.6.0",
      imgList: [
        {
          url: require("@/assets/images/indexImg/banner1.png"),
          title: "",
        },
      ],
      menuList: [
        {
          name: "环境监测",
          imgUrl: require("@/assets/images/indexImg/10.png"),
          path: "http://10.168.101.238:9002/middle?username=admin&password=admin123",
        },
        {
          name: "能耗系统",
          imgUrl: require("@/assets/images/indexImg/11.png"),
          path: "http://10.168.101.236:9002/middle?username=admin&password=admin123",
        },
        {
          name: "照明系统",
          imgUrl: require("@/assets/images/indexImg/12.png"),
          path: "http://10.168.101.239:8085/middle?username=admin&password=admin123",
        },
        {
          name: "BA系统",
          imgUrl: require("../assets/images/indexImg/13.jpeg"),
          path: "http://10.168.101.235",
        },
        {
          name: "信息发布系统",
          imgUrl: require("../assets/images/indexImg/14.png"),
          path: "http://10.168.102.61:8080/IDSWeb/loginAjax/loginSystem?username=Administrator&password=e10adc3949ba59abbe56e057f20f883e",
        },
      ],
      activeIndex: 0,
      detailList: [
        {
          name: "环境监测",
          imgSrc: require("@/assets/images/indexImg/des1.png"),
          content: "环境监测",
        },
        {
          name: "能耗系统",
          imgSrc: require("@/assets/images/indexImg/des2.png"),
          content: "能耗系统",
        },
        {
          name: "照明系统",
          imgSrc: require("@/assets/images/indexImg/des3.png"),
          content: "照明系统",
        },
        {
          name: "BA系统",
          imgSrc: require("@/assets/images/indexImg/des4.png"),
          content: "BA系统",
        },
        {
          name: "信息发布系统",
          imgSrc: require("@/assets/images/indexImg/des5.png"),
          content: "信息发布系统",
        },
      ],
      visible: true,
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    handRoutter(item, idx) {
      this.activeIndex = idx;
      this.visible = true;
      //判断path中是否包含http
      if (item.path.startsWith("http")) {
        window.open(item.path);
      } else {
        this.$router.push({ name: item.path });
      }
    },
    mouseLeave(item, idx) {
      this.activeIndex = idx;
      this.visible = false;
    },
    mouseOver(item, idx) {
      this.activeIndex = idx;
      this.visible = true;
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
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
  background-image: linear-gradient(
    top,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 1) 30%,
    rgba(255, 255, 255, 1) 100%
  );
}
.actives {
  width: 137px;
  margin-bottom: -7px;
  border-bottom: solid 7px #1965ed;
  position: relative;
  &::after {
    content: " ";
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
    width: 150px;
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

