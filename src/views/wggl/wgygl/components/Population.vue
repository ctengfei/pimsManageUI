<template>
  <div class="xzWgyglmain">
    <el-row type="flex" align="middle" justify="center" style="height: 100% ;width: 100%">
        <img src="@/assets/images/user-man.svg" class="w-110px fr" />
        <div class="text-center fl">
          <p class="mb-16px">网格队伍</p>
          <CountTo :startVal="0" :endVal="data" class="text-size-24px text-blue-500" />
        </div>
    </el-row>
  </div>
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

