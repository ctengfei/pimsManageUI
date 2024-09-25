<template>
  <el-popover
    placement="bottom-start"
    title
    trigger="manual"
    content
    :width="width"
    v-model="showCard">
    <el-input
      slot="reference"
      v-model="showText"
      :placeholder="placeholder"
      :size="size"
      clearable
      :prefix-icon="isShowIcon ? 'el-icon-date' : ''"
      readonly
      @click.stop.native="showCard = true"
    ></el-input>
    <div>
      <!-- 年份切换 -->
      <div style="display: flex;align-items: center;justify-content: space-between;">
        <div>
          <el-button
            icon="el-icon-arrow-left"
            type="text"
            style="color:#303133;"
            @click="onChange('prev')"
          ></el-button>
        </div>
        <div style="font-size: 16px;">{{showYear}}</div>
        <div>
          <el-button
            icon="el-icon-arrow-right"
            type="text"
            style="color:#303133;"
            @click="onChange('next')"
          ></el-button>
        </div>
      </div>

      <!-- 季度列表 -->
      <div
        style="display: flex;align-items: center;justify-content: space-between;flex-wrap: wrap;"
      >
        <div style="width:50%;text-align: center;margin-bottom: 5px;">
          <el-link
            :type="isActive(showYear,1)? 'primary':''"
            :underline="false"
            @click="selectEvent(1)"
          >第一季度</el-link>
        </div>
        <div style="width:50%;text-align: center;margin-bottom: 5px;">
          <el-link
            :type="isActive(showYear,2)? 'primary':''"
            :underline="false"
            @click="selectEvent(2)"
          >第二季度</el-link>
        </div>
        <div style="width:50%;text-align: center;margin-bottom: 5px;">
          <el-link
            :type="isActive(showYear,3)? 'primary':''"
            :underline="false"
            @click="selectEvent(3)"
          >第三季度</el-link>
        </div>
        <div style="width:50%;text-align: center;margin-bottom: 5px;">
          <el-link
            :type="isActive(showYear,4)? 'primary':''"
            :underline="false"
            @click="selectEvent(4)"
          >第四季度</el-link>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script>
//季度选择器：
module.exports = {
  data() {
    return {
      showCard: false,

      showTime: new Date(), //展示的时间 完整
      showYear: "", //当前时间 年

      selectTime: "" //选中的当前时间
    };
  },
  props: {
    size: {
      type: String,
      default: "small"
    },
    value: {
      type: [String, Number],
      default: "" //2022-08-23
    },
    width: {
      type: String,
      default: '220'
    },
    isShowIcon: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择季度'
    },
  },
  model: {
    prop: "value", //定义v-model的值传递给那个prop属性
    event: "change" //定义此事件触发时，自动更新父组件v-model对应的数据
  },
  watch: {
    value: {
      immediate: true,
      handler: function(val) {
        if (!val) {
          this.selectTime = ""; //当前时间
        } else {
          //解析传入的时间
          this.selectTime = new Date(val);
          //定位到当前年份
          this.showTime = new Date(val);
          this.showYear = this.showTime.getFullYear();
        }
      }
    }
  },
  created() {
    this.showYear = this.showTime.getFullYear();
  },
  mounted() {
    //监听全局按钮的点击
    var that = this;
    document.body.addEventListener("click", function() {
      //console.log('点击了body')
      that.showCard = false;
    });
  },
  methods: {
    //点击前后切换年份
    onChange(type = "") {
      if (type == "next") {
        //时间往前后一年
        this.showTime.setFullYear(this.showTime.getFullYear() + 1);
      } else if (type == "prev") {
        //时间往前推一年
        this.showTime.setFullYear(this.showTime.getFullYear() - 1);
      }

      //更新展示的时间
      this.showYear = this.showTime.getFullYear();
    },
    //选中季度事件
    selectEvent(quarter_num = 1) {
      //创建一个时间
      var time = new Date();
      //设定年份
      time.setFullYear(this.showYear);
      //设定月份 根据季度进行设置
      if (quarter_num == 1) {
        //第一季度设为1月
        time.setMonth(0);
      } else if (quarter_num == 2) {
        //第二季度设为4月
        time.setMonth(3);
      } else if (quarter_num == 3) {
        //第三季度设为7月
        time.setMonth(6);
      } else {
        //第四季度设为10月
        time.setMonth(9);
      }
      //设定日期和时分秒
      time.setDate(1);
      time.setHours(0);
      time.setMinutes(0);
      time.setSeconds(0);

      //隐藏
      this.showCard = false;

      //更新当前时间
      this.selectTime = time;

      var date_text = this.transformDateMethod(
        this.selectTime,
        (format = "YY-MM-DD")
      );

      //通知父组件 返回时间戳
      this.$emit("change", date_text);
    },
    //判断选中的时间和展示的时间是否匹配
    isActive(showYear, quarter_num) {
      // 如果没有选中时间  直接return false
      if (!this.selectTime) {
        return false;
      }

      //当前年份
      var select_year = this.selectTime.getFullYear();

      //判断当前季度
      var select_quarter_num = "";
      var select_month = this.selectTime.getMonth() + 1;
      if (select_month >= 1 && select_month <= 3) {
        select_quarter_num = 1;
      } else if (select_month >= 4 && select_month <= 6) {
        select_quarter_num = 2;
      } else if (select_month >= 7 && select_month <= 9) {
        select_quarter_num = 3;
      } else {
        select_quarter_num = 4;
      }

      //如果年份 季度一致 则直接返回true
      if (select_year == showYear && select_quarter_num == quarter_num) {
        return true;
      } else {
        return false;
      }
    },
    transformDateMethod(dateobj, format = "") {
      var year = dateobj.getFullYear();
      var month = dateobj.getMonth() + 1;
      var date = dateobj.getDate();
      var hours = dateobj.getHours();
      var minutes = dateobj.getMinutes();
      var seconds = dateobj.getSeconds();
      var day = dateobj.getDay();
      var day_str = "";
      switch (day) {
        case 0:
          day_str = "星期日";
          break;
        case 1:
          day_str = "星期一";
          break;
        case 2:
          day_str = "星期二";
          break;
        case 3:
          day_str = "星期三";
          break;
        case 4:
          day_str = "星期四";
          break;
        case 5:
          day_str = "星期五";
          break;
        case 6:
          day_str = "星期六";
          break;
        default:
          break;
      }
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (format == "") {
        return `${year}年${month}月${date}日 ${hours}:${minutes}:${seconds} ${day_str}`;
      } else {
        //替换年月日时分秒
        format = format.replace("YY", year);
        format = format.replace("MM", month);
        format = format.replace("DD", date);
        format = format.replace("hh", hours);
        format = format.replace("mm", minutes);
        format = format.replace("ss", seconds);
        format = format.replace("Day", day_str);
        return format;
      }
    }
  },
  computed: {
    //展示选中的时间
    showText() {
      if (!this.selectTime) {
        return "";
      }

      var quarter_text = "";
      var month = this.selectTime.getMonth() + 1;
      if (month >= 1 && month <= 3) {
        quarter_text = "第一季度";
      } else if (month >= 4 && month <= 6) {
        quarter_text = "第二季度";
      } else if (month >= 7 && month <= 9) {
        quarter_text = "第三季度";
      } else {
        quarter_text = "第四季度";
      }

      return `${this.selectTime.getFullYear()}年 ${quarter_text}`;
    }
  }
};
</script>