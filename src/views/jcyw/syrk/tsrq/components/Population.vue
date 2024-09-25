<template>
  <el-card>
    <el-row class="h-143px" type="flex" align="middle">
      <el-col :span="12">
        <img src="@/assets/images/user-man.svg" class="w-110px fr" />
      </el-col>
      <el-col :span="12">
        <div class="fl" style="display:table-cell; text-align: center">
          <p class="mb-16px">特殊人群总数</p>
          <CountTo :startVal="0" :endVal="data" class="text-size-24px text-blue-500" />
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import CountTo from 'vue-count-to';
export default {
  props: {
    data: Number
  },
  components: {
    CountTo
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
</style>
