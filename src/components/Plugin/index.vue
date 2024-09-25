<template>
  <div>
    <svg-icon width="20" height="20"  icon-class='icon-chajiandownload1' class="chajian-svg" @click="downloadPlugin()" />
  </div>
</template>

<script>
import { downloadPlugin } from '@/utils/index'

export default {
  name: 'Plugin',
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    downloadPlugin() {
      downloadPlugin('videomonitorSetupX86v1.0.0', 'exe')
    },
  }
}
</script>

<style scoped>
.chajian-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  font-size: 20px;
  vertical-align: middle !important;
}
</style>
