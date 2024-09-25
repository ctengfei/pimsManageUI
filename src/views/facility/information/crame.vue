<template>
      <div class="player" ref="VideoPlayer">

    </div>
</template>

<script>
export default {
    name:"Crame",
    components: {

    },
    data(){
        return {
            playBLoading: false,
            playerUrl:'', // 当前播放的url地址
        }
    }
}
</script>

<style>
.player{
    width:800px;
    height:600px;
}
</style>
