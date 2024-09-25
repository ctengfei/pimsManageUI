<template>
    <div class="amapBox">
        <el-amap class="amap-box" vid="amap" :plugin="plugin" :center="mapCenter" :events="events" ref="map"
            :amap-manager="amapManager">
        </el-amap>
    </div>
</template>
<script>
import { AMapManager } from 'vue-amap';
import { BuildInfo, getFloorDataByBuildId, getdeviceByFloor } from "./api";
export default {
    name: 'AMap',
    data() {
        return {
            deviceArr: [],
            mapCenter: [113.336893, 23.300765],//地图中心
            events: {
                init: this.mapInit,
                click(e) {
                    console.log('点击', e);

                },
            },//地图事件
            plugin: [
                'DistrictSearch', 'Geolocation', 'Autocomplete', 'Geocoder', {
                    pName: 'ToolBar',
                    events: {
                        init(instance) {
                            // console.log(instance, "instance");
                        },
                    },
                    position: [113.31765, 23.3094]
                }
            ],//地图差距
            amapManager: new AMapManager(),
            map: null,//地图实例
            positionstr: [],
        }
    },
    mounted() {
    },
    methods: {
        // 地图初始化函数
        mapInit(o) {
            this.map = o;
            
            setTimeout(() => {
                this.drawBounds(o)
                
            }, 200)
            document.getElementsByClassName('amap-logo')[0].style.display = 'none';
        },
        //绘制遮罩，显示某个省
        drawBounds(map) {
            //加载行政区划
            let opts = {
                subdistrict: 2,   // 获取边界不需要返回下级行政区
                extensions: 'all',  // 返回行政区边界坐标组等具体信息
                level: "city",  // 查询行政级别为 市
                showbiz: false, // 是否显示商圈
            }
            let district = new AMap.DistrictSearch(opts)
            let polygons = []
            district.setLevel('白云区')
            district.search("白云区", (status, result) => {
                if (status == 'complete' && result.info == 'OK') {
                    map.remove(polygons)//清除上次结果
                    polygons = [];
                    let bounds = result.districtList[0].boundaries;
                    if (bounds) {
                        for (let i = 0, l = bounds.length; i < l; i++) {
                            //生成行政区划polygon
                            let polygon = new AMap.Polygon({
                                path: bounds[i], // 多边形的路径数组
                                fillOpacity: 0, // 填充透明度
                                fillColor: '#ffffff', // 填充颜色
                                strokeOpacity: 0.2, // 线条透明度
                                strokeColor: '#0A1A29', // 线条颜色
                                strokeWeight: 3, // 线条宽度
                            });
                            polygons.push(polygon);
                        }
                    }
                    map.add(polygons)
                    // map.setFitView(polygons);//视口自适应




                    //那遥远的四个点在这
                    let outer = [
                        new AMap.LngLat(-360, 90, true),
                        new AMap.LngLat(-360, -90, true),
                        new AMap.LngLat(360, -90, true),
                        new AMap.LngLat(360, 90, true),
                    ]
                    let holes = result.districtList[0].boundaries

                    let pathArray = [
                        outer,
                    ]
                    pathArray.push.apply(pathArray, holes)
                    let polygon = new AMap.Polygon({
                        //线条颜色，使用16进制颜色代码赋值。默认值为#006600
                        strokeColor: 'rgb(20,164,173)',
                        strokeColor: "#001826",
                        strokeWeight: 1,
                        //轮廓线透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
                        strokeOpacity: 0.5,
                        //多边形填充颜色，使用16进制颜色代码赋值，如：#FFAA00
                        fillColor: '#ffffff',
                        //多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9
                        fillOpacity: 1,
                        //轮廓线样式，实线:solid，虚线:dashed
                        strokeStyle: 'solid',
                    });
                    polygon.setPath(pathArray)
                    map.add(polygon)
                    map.setZoom(20);


                } else {
                    console.error('查询失败:', result.info || '未知错误');
                }
            })
            this.getClickLocations();
        },
        // 获取经纬度
        getClickLocations() {
            let vm = this;
            AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
                var positionPicker = new PositionPicker({
                    mode: 'dragMap',
                    map: vm.map
                });
                positionPicker.on('success', function(positionResult) {
                    vm.positionstr = [positionResult.position.lng, positionResult.position.lat];
                    vm.$emit('update:pointVal',vm.positionstr)
                })
                positionPicker.start();
            })
        },

    },
    beforeDestroy() {
        let vm = this
        // 清理地图事件监听，避免内存泄漏
        if (vm.map) {
            vm.map.off('click');
        }
    },
}
</script>
<style scoped lang="scss">
.amapBox {
    width: 100%;
    height: 100%;
}
</style>
<style>
.amap-marker-label {
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    border: none;
    -webkit-box-shadow: 1px 2px 4px #cccccc;
    -moz-box-shadow: 1px 2px 4px #cccccc;
    box-shadow: 1px 2px 4px #cccccc;
}

.my-svg-marker .amap-simple-marker-label {
    width: 100px;
    color: #000;
    top: 10px;
    font-size: 14px;
}
</style>
