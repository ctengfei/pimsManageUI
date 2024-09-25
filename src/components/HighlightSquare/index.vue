<!--
 * @version:
 * @Author: li
 * @explain: 增加高亮边框组件
 * @Date: 2021-02-25 10:39:33
 * @LastEditTime: 2022-11-01 17:42:19
 * @LastEditors: renjianwu jwrenx@isstech.com
-->
<template>
    <div class="highlight-square">
        <el-card class="box-card">
        <!-- <em class="left-top"></em>
        <em class="right-top"></em>
        <em class="left-bottom"></em>
        <em class="right-bottom"></em> -->
            <slot name="child"></slot>
        </el-card>
      </div>
</template>

<script>
// 高亮角边框组件，具名插槽
export default {
    name: 'highlightsquare'
}
</script>
