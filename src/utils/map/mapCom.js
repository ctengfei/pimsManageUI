/*
 * @version: 
 * @Author: sscaij
 * @Date: 2021-04-22 14:45:22
 * @LastEditTime: 2021-08-09 10:51:03
 * @LastEditors: sscaij
 */
//常量
import { getStringByKey } from "@/utils/voice.js";
import { getAllDevice } from "@/api/resource.js";
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;
let permission = {
  search: "resource::deviceManage:allSearch",
}
//查询所有已挂载的摄像头
export function getAllCamera(callback) {
  let parameter = {
  };
  let temparr = [];
  (parameter.url = getStringByKey(permission.search, "url")),
    (parameter.method = getStringByKey(permission.search, "method"));
  getAllDevice(parameter).then((res) => {
    if (res.data) {
      let array = res.data;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        temparr[index] = [
          {
            longitude: Number(element.longitude),
            latitude: Number(element.latitude),
            altitude: Number(element.altitude),
            id: element.deviceId,
            name: element.name,
            address: element.address,
            hasAlarm: element.hasAlarm,
            protocol: element.protocol
          }];
      }
    } else {
      console.log("获取摄像头数据失败")
    }
    return callback(temparr);
  });
}
//查询设备并且绘制点
export function addDraws(templist, EntityManage) {
  // 设备数据
  for (let i = 0; i < templist.length; i++) {
    let element = [templist[i][0], templist[i][1]];
    let id = templist[i][3];
    let name = templist[i][4];
    EntityManage.addEntities([
      {
        type: "billboard",
        id: id,
        name: name,
        scale: 0.8,
        image: require("@/assets/images/map/camera.png"),
        position: element,
        VerticalOrigin: ISGis.Entities.VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        properties: element,
      },
      {
        type: "label",
        id: "point_label" + i,
        name: "point_label" + i,
        text: name,
        style: ISGis.Entities.LabelStyle.FILL,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        pixelOffset: [0, 20],
        font: "20px sans-serif",
        fillColor: "#67c23a",
        position: element,
      },
    ]);
  }
}
//轨迹展示
export function playback(viewer, position) {
  let color = ISGis.Cesium.Color.GREEN
  let data = [];
  data[0] = position

  // 起始时间
  let start = ISGis.Cesium.JulianDate.fromDate(new Date(2021, 4, 27));
  // 结束时间
  let stop = ISGis.Cesium.JulianDate.addSeconds(
    start,
    360,
    new ISGis.Cesium.JulianDate()
  );
  // //加点
  for (let i = 0; i < data[0].length; i++) {
    viewer.entities.add({
      id: "pointline" + i,
      name: "pointline" + i,
      position: ISGis.Cesium.Cartesian3.fromDegrees(
        data[0][i].longitude,
        data[0][i].dimension,
        data[0][i].height
      ),
      billboard: {
        image: require("@/assets/images/map/draw.png"),
        VerticalOrigin: ISGis.Entities.VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scale: 0.5
      },
    });
  }
  viewer.clock.canAnimate = false; //时间轴暂停
  viewer.clock.shouldAnimate = false; //时间轴暂停
  // 设置始时钟始时间
  viewer.clock.startTime = start.clone();
  // 设置时钟当前时间
  viewer.clock.currentTime = start.clone();
  // 设置始终停止时间
  viewer.clock.stopTime = stop.clone();
  // 时间速率，数字越大时间过的越快
  viewer.clock.multiplier = 1;
  // 时间轴
  viewer._timeline.zoomTo(start, stop);
  // 循环执行,即为2，到达终止时间，重新从起点时间开始
  viewer.clock.clockRange = ISGis.Cesium.ClockRange.LOOP_STOP;
  // 循环执行,即为1，到达终止时间，重新从起点时间开始
  // viewer.clock.clockRange = ISGis.Cesium.ClockRange.CLAMPED;
  //0
  // viewer.clock.clockRange = ISGis.Cesium.ClockRange.UNBOUNDED;




  var linePos = [];
  for (let j = 0; j < data.length; j++) {
    for (let i = 0; i < data[j].length; i++) {
      linePos.push(data[j][i].longitude);
      linePos.push(data[j][i].dimension);
      linePos.push(data[j][i].height);
    }
    let property = computeFlight(start, data[j]);
    //添加模型 //利用entity进行加载
    let planeModel = viewer.entities.add({
      // 和时间轴关联
      availability: new ISGis.Cesium.TimeIntervalCollection([
        new ISGis.Cesium.TimeInterval({
          start: start,
          stop: stop,
        }),
      ]),
      position: property,
      // 根据所提供的速度计算模型的朝向
      orientation: new ISGis.Cesium.VelocityOrientationProperty(property),
      point: { pixelSize: 20, color: color },
      //解决模型无法加载问题
      path: new ISGis.Cesium.PathGraphics({
        material: new ISGis.Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.3,//轨迹线的发光强度
          color: ISGis.Cesium.Color.White,//颜色
        }),
        width: 3,
      })
    });
  }
  let property1 = viewer.entities.add({
    polyline: {
      positions: ISGis.Cesium.Cartesian3.fromDegreesArrayHeights(linePos),
      width: 2,
      material: new ISGis.Cesium.PolylineOutlineMaterialProperty({
        color: new ISGis.Cesium.Color(53 / 255, 57 / 255, 255 / 255, 0.8),
        outlineWidth: 0.2,
        outlineColor: new ISGis.Cesium.Color(
          65 / 255,
          105 / 255,
          225 / 255,
          0.8
        ), // 线框颜色
      }),
    },
  });
}

export function loadMapplay(GisMapObj, timeline, animation, val) {
  let LayerGather = ISGis.Map.LayerGather;
  let xian = []
  if (val == "0") {
    xian = [LayerGather.gaodeImg, LayerGather.gaodeCia]
  } else {
    xian = [{
      id: 'xian',
      maximumLevel: 16,
      type: "XYZSERVER",
      url: '/map/changan/{z}/{x}/{y}.png',
      extent: ["107.57813", "33.67059", "109.86328", "34.80469"]
    }]
  }
  //返回一个Promise对象
  return new Promise(function (resolve, reject) {
    GisMapObj = new ISGis.Map("/ISGIS"); //'./ISGIS/'指向ISGIS插件包路径
    GisMapObj["loadMap"]({
      divId: "cesiumContainer",
      baseLayerPicker: true,
      shouldAnimate: true,
      timeline: timeline,
      animation: animation,
      // isLonLatHeight: true, //显示
      isTerrain: true,
      // selectionIndicator: false,
      sceneMode: 3,
      terrainUrl: "https://terrain.gbim360.com/", //此处可更换地形terrain数据
      // imageryLayer: ISGis.Map.LayerGather.gaodeImg, //此处可更换地图，插件内部提供地图类型可查看ISGis.Map.LayerGather
      imageryViewModels: [
        {
          viewName: "高德影像",
          viewTooltip: "高德影像",
          viewIconUrl: require("@/assets/images/map/mapboxSatellite.png"),
          imageryLayers: xian,
        }
      ],
    });
    GisMapObj.scene.globe.baseColor = new ISGis.Cesium.Color(1, 1, 1, 1)//修改背景色
    GisMapObj.scene.screenSpaceCameraController.enableCollisionDetection = true; //为true时相机不可以进入地下
    let sscc = GisMapObj.scene.screenSpaceCameraController;
    // 降低转动地球时的转动速率
    sscc._maximumRotateRate = 1; // 原始大小 1.77
    // 提高手势缩放速率
    sscc._maximumZoomRate = 590637627200000; // 原始大小 5906376272000
    sscc._minimumZoomRate = 1000; // 原始大小 20
    // 变焦时相机位置的最大大小（以米为单位），即地球大小控制，在enableCollisionDetection = true时有效
    sscc.maximumZoomDistance = 20000000;
    sscc.minimumZoomDistance = 30; //为0时相机也不可进入地下
    resolve(GisMapObj)
  });
}

export function loadMap(GisMapObj, val) {
  let LayerGather = ISGis.Map.LayerGather;
  //返回一个Promise对象
  let xian = []
  if (val == "0") {
    xian = [LayerGather.gaodeImg, LayerGather.gaodeCia]
  } else {
    xian = [{
      id: 'xian',
      maximumLevel: 16,
      type: "XYZSERVER",
      url: '/map/changan/{z}/{x}/{y}.png',
      extent: ["107.57813", "33.67059", "109.86328", "34.80469"]
    }]
  }
  return new Promise(function (resolve, reject) {
    GisMapObj = new ISGis.Map("/ISGIS"); //'./ISGIS/'指向ISGIS插件包路径
    GisMapObj["loadMap"]({
      divId: "cesiumContainer",
      baseLayerPicker: true,
      shouldAnimate: true,
      isLonLatHeight: true, //显示
      isTerrain: true,
      selectionIndicator: false,
      sceneMode: 3,
      terrainProvider: ISGis.Cesium.createWorldTerrain(),
      terrainUrl: "https://terrain.gbim360.com/", //此处可更换地形terrain数据
      // imageryLayer: ISGis.Map.LayerGather.gaodeImg, //此处可更换地图，插件内部提供地图类型可查看ISGis.Map.LayerGather
      imageryViewModels: [
        {
          viewName: "高德影像",
          viewTooltip: "高德影像",
          viewIconUrl: require("@/assets/images/map/mapboxSatellite.png"),
          imageryLayers: xian,
        }
      ],
    });
    GisMapObj.scene.screenSpaceCameraController.enableCollisionDetection = true; //为true时相机不可以进入地下
    let sscc = GisMapObj.scene.screenSpaceCameraController;
    // 降低转动地球时的转动速率
    sscc._maximumRotateRate = 1; // 原始大小 1.77
    // 提高手势缩放速率
    sscc._maximumZoomRate = 590637627200000; // 原始大小 5906376272000
    sscc._minimumZoomRate = 1000; // 原始大小 20
    // 变焦时相机位置的最大大小（以米为单位），即地球大小控制，在enableCollisionDetection = true时有效
    sscc.maximumZoomDistance = 20000000;
    sscc.minimumZoomDistance = 30; //为0时相机也不可进入地下
    resolve(GisMapObj)
  });
}
/**
 * 
 * 即 高德 转 天地图
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
export function gcj02ToWgs(lng, lat) {
  var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
  var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
  var lng1 = +lng;
  var lat1 = +lat;
  var dlat = transformlat(lng1 - 105.0, lat1 - 35.0);
  var dlng = transformlng(lng1 - 105.0, lat1 - 35.0);
  var radlat = lat1 / 180.0 * PI;
  var magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  var sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
  dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
  var mglat = lat1 + dlat;
  var mglng = lng1 + dlng;
  var latlng = []
  latlng[0] = lng1 * 2 - mglng;
  latlng[1] = lat1 * 2 - mglat;
  return latlng;
}


/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
export function bd09togcj02(bd_lon, bd_lat) {
  var x_pi = (3.14159265358979324 * 3000.0) / 180.0;
  var x = bd_lon - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat];
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function gcj02tobd09(lng, lat) {
  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) - 0.0022;
  // var bd_lng = z * Math.cos(theta) + 0.0065;
  // var bd_lat = z * Math.sin(theta) + 0.0060;
  return [bd_lng, bd_lat]
}

/**
 * WGS84转火星坐标系 (GCJ-02)
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function wgs84togcj02(lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return [mglng, mglat]
  }
}

/**
 * 火星坐标系 (GCJ-02) 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
export function gcj02towgs84(lng, lat) {
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0);
    var dlng = transformlng(lng - 105.0, lat - 35.0);
    var radlat = lat / 180.0 * PI;
    var magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    var sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    var mglat = lat + dlat;
    var mglng = lng + dlng;
    return [lng * 2 - mglng, lat * 2 - mglat]
  }
}

// 谷歌转84
export function transformPos(param) {
  var pos = param.positions;
  var noHeight = param.noHeight;
  var type = param.type;
  var fun = gcj02towgs84;
  if (type == 'gcj02') {
    fun = wgs84togcj02;
  }
  if (_mapType == 'google') {
    // pos[0][0]经度，pos[0][1]纬度
    if (Object.prototype.toString.call(pos[0]).indexOf('Array') > -1) {
      var newArr = [];
      for (var i = 0; i < pos.length; i++) {
        var gArr = fun(pos[i][0], pos[i][1])
        if (pos[i][2]) {
          gArr[2] = pos[i][2]
        }
        newArr.push(gArr)
      }
      return newArr
    } else if (pos.length >= 3) {
      if (!noHeight) {
        var newArr = [];
        for (var i = 0; i < pos.length; i += 3) {
          var gArr = fun(pos[i], pos[i + 1])
          newArr.push(gArr[0], gArr[1], pos[i + 2])
        }
        return newArr
      } else {
        var newArr = [];
        for (var i = 0; i < pos.length; i += 2) {
          var gArr = fun(pos[i], pos[i + 1])
          newArr.push(gArr[0], gArr[1])
        }
        return newArr
      }
    } else {
      // pos[0]经度，pos[1]纬度, pos[2]高程
      var gArr = fun(pos[0], pos[1])
      if (pos[2]) {
        gArr[2] = pos[2]
      }
      return gArr
    }
  } else {
    return pos;
  }
}

export function transformlat(lng, lat) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret
}

export function transformlng(lng, lat) {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
export function out_of_china(lng, lat) {
  return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
}
// gps转笛卡尔坐标[[x,y,z],[x,y,z]]
export function gpsPointsToCartesian3s(gpsPoints) {
  let tempArr = [];
  for (let i = 0; i < gpsPoints.length; i++) {
    const element = gpsPoints[i];
    tempArr.push(
      ISGis.Cesium.Cartesian3.fromDegrees(
        element[0],
        element[1],
        element[2]
      )
    );
  }
  return tempArr;
}

export function colorRgb(sColor, opacity) {
  sColor = sColor.toLowerCase();
  //十六进制颜色值的正则表达式
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    return "rgba(" + sColorChange.join(",") + "," + opacity + ")";
  }
  return sColor;
};
/**
    * 计算飞行
    * @param source 数据坐标
    * @returns {SampledPositionProperty|*}
    */
function computeFlight(start, source) {
  // 取样位置 相当于一个集合
  let property = new ISGis.Cesium.SampledPositionProperty();
  for (let i = 0; i < source.length; i++) {
    let time = ISGis.Cesium.JulianDate.addSeconds(
      start,
      source[i].time,
      new ISGis.Cesium.JulianDate()
    );
    let position = ISGis.Cesium.Cartesian3.fromDegrees(
      source[i].longitude,
      source[i].dimension,
      source[i].height
    );
    // 添加位置，和时间对应
    property.addSample(time, position);
  }
  return property;
}