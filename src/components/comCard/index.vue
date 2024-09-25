<!--
 * @Descripttion: 
 * @version: 
 * @Author: HJQ
 * @Date: 2022-02-09 17:07:36
 * @LastEditors: renjianwu jwrenx@isstech.com
 * @LastEditTime: 2023-01-05 15:29:31
-->
<template>
  <div class="topData">
     <div class="bgc" v-for="(item,index) in spanList" :key="index" @click="routerClick(item.type)">
         <div class="leftText">
             <span class="topText">{{item.num}}</span>
             <span class="bottomText">{{item.name}}</span>
         </div>
       <div class="imgs" v-if="item.path">
         <svg-icon :icon-class='item.type'  :alt="item.type" style="width:100%;height:100%" />
       </div>

     </div>
 </div>
</template>
<script>
export default {
 props:{
   spanList:{
     type:Array,
     default:()=>{
       return []
     }
   }
 },
 data(){
   return{

   }
 },
 methods:{
   routerClick(item){
     this.$emit("routerClick",item)
   }
 }
}
</script>
<style lang="scss" scoped>
.topData {
   display: flex;
   align-content: center;
   align-items: center;
   height: inherit;
  //  padding: 10px 10px;
  .bgc{
       flex:1;
       display: flex;
       //background-color: #202230;
       box-shadow: 0 2px 12px 0 rgba(0,0,0, .1);

       height: inherit;
       border-radius: 8px;
      //  cursor: pointer;
       margin:10px 5px;
       align-items: center;
       justify-content: space-around;
       &:first-child{
           margin-left:0;
       }
       &:last-child{
           margin-right:0;
       }
       .imgs{
         width:auto;
         height: 70px;
         // height: 6vh;
         display: flex;
       }
   }
   .leftText {
     display: flex;
     flex-direction: column;
     justify-content: space-around;
     height: inherit;
     span {
       margin:0 10px;
     }
     .topText {
       font-family: Microsoft YaHei;
       font-size: 25px;
       font-weight: 600;
       font-stretch: normal;
       letter-spacing: 0px;
       color: #333333;
     }
     .bottomText {
       height: 19px;
       font-family: Microsoft YaHei;
       font-size: 14px;
       font-weight: normal;
       font-stretch: normal;
       line-height: 19px;
       letter-spacing: 0px;
       width: 85px;
      //  color: #ffffff;
     }
   }
 }
</style>
