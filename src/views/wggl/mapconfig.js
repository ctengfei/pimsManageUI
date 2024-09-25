/*
 * @Author: renjianwu jwrenx@isstech.com
 * @Date: 2023-03-29 14:38:38
 * @LastEditors: renjianwu jwrenx@isstech.com
 * @LastEditTime: 2023-04-13 09:30:47
 * @FilePath: \pimsManageUI\src\views\wggl\mapconfig.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var mapconfig = {
  // x: 116.21610617587, //中心点经度和纬度
  // y: 39.8666427002389,
  x: 116.20212412857583, //中心点经度和纬度
  y: 40.05089161432351,
  zoom: 18.6, //地图缩放级别
  maxZoom: 29,
  projection: "EPSG:4326",
  url: JSON.parse(localStorage.getItem("mapSource"))
};

export default mapconfig
