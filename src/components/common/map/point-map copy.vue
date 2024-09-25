<!--
 * @version: 1.0.0
 * @description: 地图组件入口
 * @Author: sscaij
 * @Date: 2021-08-26 11:06:20
 * @LastEditTime: 2023-04-18 10:24:09
 * @LastEditors: jwrenx jwrenx@isstech.com
-->
<template>
	<div id="iGisMap" :class="{ showMap: showMap }">
  </div>
</template>

<script>
import floorPositions from '../../../utils/map/floorCoord'
import { XYZ as XYZSource, Vector as VectorSource } from 'ol/source';
import Vector from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {bbox} from 'ol/loadingstrategy.js';
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { TileSuperMapRest } from '@supermap/iclient-ol'
import Feature from 'ol/Feature'
import { Point, LineString, Polygon } from 'ol/geom'
import { Style, Fill, Stroke, Text, Icon } from 'ol/style'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import Overlay from 'ol/Overlay'
export default {
	name: 'appMap',
	props: {
		layers: {
			type: Array,
			default: () => []
		},
		center: {
			type: Array,
			default: () => []
		},
		zoom: {
			type: Number,
			default: () => 18
		},
		options: {
			type: Object,
			default: () => {}
		},
		// area新加代码 发送给子组件
		getMouseLOcation: {
			type: Function,
			default: () => {}
		},
		allowShowLocationByClick: {
			type: Object,
			default: () => {}
		},
		showScaleLine: {
			type: Boolean,
			default: () => {}
		},
		// -----------------重写后的地图代码------------------
	},
	data() {
		return {
      map:null,
      vector: null,
      pointSource:null,
      lineSource:null,
      lineLayer:null,
      pointLayer:null,
      feature:null,
      featureStyle:null,
      //之前map对象
			mapObj: null,
      iconLayer:null,
			mapOption: null,
			// 地图级别
			mapLevel: 18,
			// 弹窗对象
			markerTips: null,
			// 图层集合
			layerObj: {},
			showMap: false,
			iconDataObj: [],
			layerIcons: {},
			// 创建线的数据
			lineCoord: [],
			// 创建线的对象
			bglingObj: {},
			beelineObj: null,
			beelinedata: null,
			indoorService: null,
			isIndoor: false,
			currentFloor: '',
			currentBuild: '',
			wfsFloor: null,
			wfsPoi: null,
			rightDistance: 8,
			buildname: '',
			// 巡更计划页面页签在新建巡更点位的时候才可以点击添加点位 标记位
			code: '',
			// 存储点位信息
			codeArr: [],
			codeId: 0,
			animation: null,
			flickerAnimation: [],
			radius: 1 / 5000000,
			steps: 100,
			refreshAlarmLayerTimer: null,
			indoorData: [],
			typeArr: {
				elevator: [],disabledHealthAlarm: [],freshAirSystem: [],nightlighting: [],barrierGate: [],
				entranceControl: [],boiler: [],lighting: [],airConditioning: [],camera: []
			}
		}
	},
	created() {
		this.MapFontLayers = []
	},
	beforeDestroy() {
		if (this.isIndoor) {
			this.openOutDoorMap()
		}
		// this.mapObj.removeLayer()
		this.mapObj.destroyMap(false)
		this.mapObj = null
		this.beelineObj = null
		this.MapFontLayers = null
	},
	watch: {
		// isIndoor(newVal) {
		// 	if (newVal) {
		// 		document.getElementById('floorInfo').style.right = '-100px'
		// 	}
		// },
		allowShowLocationByClick: {
			handler(val, oldval) {
				if (val && val.delMap) {
					if (this.layerObj['locationPoint']) {
						this.clearPoint('locationPoint')
					}
				}
				if (val && !val.delMap) {
					if (val.e[0] != '') {
						setTimeout(() => {
							let e = [Number(val.e[0]), Number(val.e[1])]
							let iconDataObj = [{ id: Math.random() * 1000000, src: '/images/theme/dark/map/position_red.png', label: '111', coord: e }]
							this.addMarket(iconDataObj, 'locationPoint')
						}, 500)
					}
				}
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {
		//this.initGisMap()
    this.loadGisMap()
		this.addWFSServer()
	},
	methods: {
		/**
		 * 初始化地图函数（严格来讲，此方法最好形成为单例模式）
		 * @param
		 *
		 **/
    //温泉超图
    loadGisMap(){
      let url = process.env.VUE_APP_GIS_CT+"/iserver/services/map-WQKJY002-4/rest/maps/Black_outdoor_map_cn";
      // 初始化地图信息
      this.mapObj = new window.iGis.GisMap()
      this.map = new Map({
          target: 'iGisMap',//对应div容器的id
          view: new View({
              center: [116.20212412857583, 40.05089161432351],//地图中心点
              zoom: 18.6,//缩放层级
              projection: 'EPSG:4326'//坐标系
          })
      });

      // 添加图层
      let layer = new TileLayer({
          source: new TileSuperMapRest({
              url: url,//地图服务地址
              wrapX: true//是否在地图水平坐标轴上重复
          }),
          projection: 'EPSG:4326'//坐标系
      });

      this.map.addLayer(layer);//添加图层到地图
      setTimeout(()=>{
        this.map.updateSize(); //地图适配div容器
      },100)
      // var scaleControl = new ol.control.ScaleLine();
      // this.map.addControl(scaleControl);
      console.log(url,'地图路径地址')
      /////////////////////////////////////////////////////
      //自定义点串连线轨迹
    //   let pointsData = [
    //     [116.20212412857583, 40.05089161432351],
    //     [116.20234991455779, 40.05097631183754],
    //     [116.20238633470342, 40.05088821548654],
    //     [116.2024459430853, 40.05077538533515],
    //     [116.20250555146715, 40.050637008734384],
    //     [116.2025694175906, 40.05048373003815],
    //     [116.20260347952309, 40.05041560617317],
    //     [116.20272695402838, 40.050377286499106],
    //     [116.20285255740446, 40.05036877101598],
    //     [116.2029061258751, 40.05039386858511],
    //     [116.20307706686012, 40.05044031993974]
    //   ];
      
      let that = this;
      this.map.on('click',function(e){
        //debugger
        //console.log(e.coordinate,'经纬度')
        that.$emit('map-location', e.coordinate)
        this.codeArr = e.coordinate
        //console.log(that.codeArr,'点位信息')
      })
  


      
      // ///////////////////////指定一个中心点和半径，构造一个圆，模拟为考勤范围
      // var circle = new ol.geom.Circle([116.21610617587,39.8666427002389], 0.001);
      // var polygon = new ol.geom.Polygon.fromCircle(circle);//转换为polygon，用于地图绘制
      // //构造一个面的Feature
      // var circleFeature = new ol.Feature({
      //     geometry: polygon,
      // });
      
      // //定义一个数据来源，用于添加Feature
      // let addPolygonSource = new ol.source.Vector({
      //   wrapX: false
      // });
      // //创建一个矢量图层
      // let addPolygonsLayer = new ol.layer.Vector({
      //     source: addPolygonSource,
      //     style: new ol.style.Style({
      //         stroke: new ol.style.Stroke({//设置边框样式
      //             color: 'green',
      //             width: 3
      //         }),
      //         fill: new ol.style.Fill({
      //             color: 'rgba(0, 0, 255, 0.3)'//设置填充色
      //         })
      //     })
      // });

      // map.addLayer(addPolygonsLayer);//添加图层到地图

      // addPolygonSource.addFeature(circleFeature)//添加面的fature
      },            

    


      
		// initGisMap() {
		// 	// var WMSurl = 'http://127.0.0.1:8080/geoserver/daxingPublic/wms?service=WMS'
		// 	var WMSurl = process.env.VUE_APP_GIS + '/geoserver/daxingPublic/wms?service=WMS'
		// 	this.mapObj = new window.iGis.GisMap()
		// 	var options = {
		// 		mapType: iGis.MapType.WMS_MAP,
		// 		url: WMSurl,
		// 		divId: 'iGisMap',
		// 		layerParams: {
		// 			VERSION: '1.1.1',
		// 			LAYERS: 'daxingPublic:daxinggis',
		// 		},
		// 		center: [116.349581,39.671403],
		// 		zoom: this.mapLevel,
		// 		minZoom: 18,
		// 		maxZoom: 23,
		// 		// zoomType: 'small', // [ { big: 显示(+、-) 和 滑动条}， { small: 显示(+、-)}， { 为空： 不显示(+、-) 和 滑动条 } ]
		// 		projection: 'EPSG:4326',
		// 		isScaleLine: this.showScaleLine == false ? false : true,
		// 		isMousePosition: true,
		// 		isZoomLevel: true,
		// 		// isOverview: true,//左下角视图
		// 		units: 'metric',
		// 		wrapX: false
		// 	}
		// 	this.mapOption = options
		// 	this.versionSwitch()
		// 	this.mapObj.addCustomClickEvent((e) => {
		// 		this.$emit('map-location', e)
		// 		if (this.allowShowLocationByClick && this.allowShowLocationByClick.value) {
		// 			// 点击增加点
		// 			const dataObj = [{ id: Math.random() * 1000000, anchor: [13, 13], src: '/images/theme/dark/map/position_red.png', coord: e }]
		// 			if (this.layerObj['locationPoint']) {
		// 				// this.layerObj.locationPoint.setData(dataObj, 0)
		// 				this.layerIcons.locationPoint = dataObj
		// 				this.layerObj.locationPoint.refreshLayerByData()
		// 			} else {
		// 				this.addMarket(dataObj, 'locationPoint')
		// 			}
		// 		}
		// 	})
		// 	this.showFloorName()
		// 	// this.mapObj.createMap(options)
		// 	this.$emit('mapReady')

		// 	this.animation = new window.iGis.maptools.Animation({
		// 		gisMapObj: this.mapObj
		// 	})
		// },
		addLineFeature(Array){
			let pointsData = Array;
			console.log(this.pointsData,"this.pointsData")
			//定义一个数据来源，用于添加Feature
			this.lineSource = new VectorSource({
				wrapX: false,
				features: []
			})
			this.lineLayer = new VectorLayer({
				source: this.lineSource
			})
			this.map.addLayer(this.lineLayer);//添加图层到地图
			//构造一个线feature
			var feature = new Feature({
				type: "lineStyle",
				geometry: new LineString(
					pointsData // 自定义的点串
				),
			});
			//创建一个线样式
			let lineStyle = new Style({
				stroke: new Stroke({
					color: 'red',
					width: 4,
				}),
			});
			feature.setStyle(lineStyle);//设置线的样式      
			this.lineSource.addFeature(feature);// 添加线的fature
			this.$emit("addLineFeature")
		},
		versionSwitch() {
			this.mapObj.createMap(this.mapOption)
		},
		// 展示楼层信息
		showFloorName() {
			let textMarks = []
			floorPositions.map((position) => {
				textMarks.push({
					id: position.id,
					coord: [+position.longitude, +position.latitude],
					fillColor: 'red',
					labRotation: -38,
					glyph: '',
					lalFontSize: '12px',
					label: position.label,
					options: position
				})
			})
			this.addTextLayer('floor-name', textMarks)
		},
		/***
		 *
		 * 只添加文字图层
		 * @param rotation 字体图层旋转
		 * @param labRotation 字体图层旋转角度
		 */
		addTextLayer(layerId = 'basefont-layer', marker = [], click, minShowZoom = 6) {
			if (this.MapFontLayers[layerId]) {
				this.removeFontLayer(layerId)
			}
			if (!marker.length) {
				return
			}
			const option = {
				gisMapObj: this.mapObj,
				callBackFun: function (param) {
					param.currObj.setData(marker, param.seq)
				},
				layerOptions: {
					radius: 50,
					rotation: 100,
					minShowZoom: minShowZoom,
					// lalFontSize: '18px',
					// fillColor: "#000",
					labRotation: 100,
					labFillColor: '#000'
				}
			}
			let fontLayerObj = new iGis.layers.FontLayer(option)
			this.MapFontLayers[layerId] = fontLayerObj
			fontLayerObj.setZIndex(99)
			// console.log(fontLayerObj, 'fontLayerObj')
			if (click && typeof click === 'function') {
				// 鼠标点击事件
				fontLayerObj.addClickEvent(function (e) {
					const _marker = e.feature.values_.property
					click({ layerId: layerId, marker: _marker })
				})
			}
		},
		// 移出字体图层
		removeFontLayer(layerId) {
			if (this.MapFontLayers[layerId]) {
				this.MapFontLayers[layerId].cleanSource()
				this.mapObj.removeLayer(this.MapFontLayers[layerId])
				this.MapFontLayers[layerId] = null
				delete this.MapFontLayers[layerId]
			}
		},
		clearLayer() {
			// Object.keys(this.layerObj).map((layerName) => {
			// 	this.clearPoint(layerName)
			// })
      //this.pointSource.removeFeature(this.feature)
      this.map.removeLayer(this.pointLayer); //移除图层
		},
		/** 
		 * 移除图层
		 * @param {layerName}图层名称（ID)
		 * **/
		clearPoint(layerName) {
			if (this.layerObj[layerName]) {
				this.layerObj[layerName].cleanSource()
				this.mapObj.removeLayer(this.layerObj[layerName])
				this.layerObj[layerName] = null
				delete this.layerObj[layerName]
			}
		},
		/**
		 * 添加wfs图层
		 */
		addWFSServer() {
			// this.mapDestroy()
			if (this.wfsFloor) {
				this.wfsFloor.cleanSource()
			}
			if (this.wfsPoi) {
				this.wfsPoi.cleanSource()
			}
			//var WFSurl = 'http://127.0.0.1:8080/geoserver/daxingPublic/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=daxingPublic:park&maxFeatures=50&outputFormat=application/json&srsname=EPSG:4326'
			//var WFSurl = process.env.VUE_APP_GIS_CT + '/iserver/services/map-DongQu336/rest/maps/%E4%B8%9C%E5%8C%BA336?prjCoordSys=%7B%22epsgCode%22:4326%7D'
			this.wfsFloor = new iGis.layers.DataServerLayer({
							gisMapObj: this.mapObj,
							isHover: true,
							serverType: 'GEOSERVER',
							//url: WFSurl,
							featureNS: 'http://mapserver.gis.umn.edu/mapserver',
							featureType: ['daxingPublic:park'],//图层名称
							dataProjection: 'EPSG:4326',
		 					layerOptions: {
								strokeColor: '#000',
								// strokeWidth: 1.5,
								strokeWidth: 0.3,
								fillColor: 'rgba(255,255,255,0)',
								selFillColor: 'transparent',
								// selStrokeColor: '#686868',
								selStrokeColor: '#000',
								selStrokeWidth: 0.3
							},
							isRef: true
						})
						this.wfsFloor.addClickEvent((e) => {   //点击事件地图点位信息
							// 移出地图弹窗
							this.$emit('map-location', e.clickCoord)
						})
		},

		/**
		 * 添加图标
		 * @param fontSize 字体大小
		 * @param fontColor 字体颜色
		 * @param labOffsetX 字体X偏移
		 * @param labOffsetY 字体Y偏移
		 * @param isEmit 是否向外抛出点击事件
		 *
		 * **/
		addMarket(
			iconList,
			layerName,
			{ fontSize = '14px', fontColor = '#fff', labOffsetX = 0, labOffsetY = 0, isEmit = true, zIndex = 0, eventName = '' } = {}
		) {
			// 点位信息、图层名称
			this.iconDataObj = iconList
			this.layerIcons[layerName] = this.iconDataObj
			if (this.layerObj[layerName]) {
				this.layerObj[layerName].refreshLayerByData()
			} else {
      //定义一个数据来源，用于添加Feature
      this.pointSource = new VectorSource({
        wrapX: false,
        features: []
      })
      this.pointLayer = new VectorLayer({
        source: this.pointSource
      })
      this.map.addLayer(this.pointLayer);//添加图层到地图
       //创建一个点Feature
       this.feature = new Feature(new Point([this.iconDataObj[0].coord[0],this.iconDataObj[0].coord[1]]));
       this.featureStyle = new Style({
            image: new Icon(({
                src: require("@/assets/images/mapImg/position.png"),//设置点图标的图片
                scale: 0.8,//缩放比例
                anchor:[0.5,1],//图片中心
            }))
        });
        this.feature.setStyle(this.featureStyle);//设置点的样式
        this.pointSource.addFeature(this.feature);//将Feature加到source内  
        
				// this.layerObj[layerName] = new window.iGis.layers.IconLayer({
				// 	gisMapObj: this.mapObj,
				// 	isRef: true,
				// 	isHover: false,
        //   layerOptions: {
				// 		isBox: false,
				// 		selSrc: require("@/assets/images/mapImg/position.png"),
				// 		anchor: [15,40]
				// 	}
				// })
				// this.layerObj[layerName].setData(this.layerIcons[layerName], 0)
				// this.layerObj[layerName].refreshLayerByData()
			}
		 }
    }
}
</script>
<style lang="scss" scoped>
.map_warp {
	width: 100%;
	height: 96%;
}

#iGisMap {
	width: 100%;
	height: calc(100vh - 60px - 3px);
	// padding: 12px 12px;
	// position: absolute !important;
	// top: 30px;
	// left: 36px;
	&.showMap {
		left: 0px;
	}
}

.map-floor-bar {
	width: 80px;
	position: absolute;
	z-index: 99;
	right: 33px;
	bottom: 60px;
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: right 0.5s;
	.buildingName {
		color: #fff;
		width: 60px;
		height: 34px;
		display: flex;
		align-items: center;
		background: #202945;
		overflow: hidden;
		&.justify-center {
			justify-content: center;
		}
		&.justify-left {
			justify-content: flex-start;
		}
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;

		li {
			height: 34px;
			background: rgba(#202945, 0.85);
			line-height: 34px;
			text-align: center;
			color: rgba(#fff, 0.5);
			cursor: pointer;
			position: relative;
			font-size: 12px;
			width: 34px;
			.left-arrow {
				width: 0;
				height: 0;
				border: 3px solid transparent;
				border-left-color: #407aee;
				position: absolute;
				content: '';
				top: 9px;
			}

			.right-arrow {
				width: 0;
				height: 0;
				border: 3px solid transparent;
				border-right-color: #407aee;
				position: absolute;
				content: '';
				top: 9px;
				right: 0;
			}

			&.active {
				color: #fff;
				border-left: #407aee solid 2px;
				border-right: #407aee solid 2px;
			}

			&.map-prev,
			&.map-next {
				height: 20px;
				background: #202945;
				line-height: 20px;
				color: #fff;
			}

			&.map-prev {
				margin-bottom: 3px;
			}

			&.last-out {
				height: 35px;
				line-height: 35px;
				background: #3e4766;
				color: #fff;
			}

			&.last {
				margin-top: 3px;
				height: 30px;
				line-height: 15px;
				color: #fff;
				display: flex;
				font-size: 12px;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				p {
					margin: 0;
					padding: 0;
				}

				i {
					transform: rotate(270deg);
					-ms-transform: rotate(270deg); /* IE 9 */
					-moz-transform: rotate(270deg); /* Firefox */
					-webkit-transform: rotate(270deg); /* Safari 和 Chrome */
					-o-transform: rotate(270deg);
				}
			}
		}
	}
}
</style>

<style lang="scss">
#iGisMap {
	.markerPop {
		padding: 10px 14px;
		color: #afb9d0;
		font-size: 14px;
		line-height: 40px;
		border-radius: 4px;
		//background-color: rgba(32,34,48,.9);
		// box-shadow: 0 0 2px #202230;
		border: 1px solid rgba(255,255,255,.2);
		.el-button.device {
			background-color: #4AB7BD !important;
		}
		.el-button {
			margin-top: 12px;
		}
		div {
			width: 280px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
.ol-zoom {
    top: 0.5em;
    left: 105.5em;
    position: absolute;
}
.ol-attribution ul, .ol-attribution button {
    display: none;
}
</style>