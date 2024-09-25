<template>
  <div>
    <p>姓名：{{ popData.xm }}</p>
    <p>联系方式：{{ popData.lxfs }}</p>
    <p>政治面貌：{{ popData.zzmm }}</p>
    <p>地址：{{ popData.xzdxzAddr }}</p>
  </div>
</template>
<script>
export default {
  name: 'peopleInfo',
  dicts: ['gb_zzmm'],
  components: {},
  props: {
    popData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    popData(val) {
      this.popData.zzmm = this.politicalFormat(val.zzmm)
    }
  },
  data() {},
  methods: {
    politicalFormat(val) {
      return this.selectDictLabel(this.dict.type.gb_zzmm, val)
    }
  }
}
</script>
<style lang="less" scoped>
</style>