var mapconfig = {
  // x: 87.56317013130815, //中心点经度和纬度
  // y: 43.87338924273046,
  x: 116.20212412857583, //中心点经度和纬度
  y: 40.05089161432351,
  zoom: 18.6, //地图缩放级别
  maxZoom: 29,
  projection: "EPSG:4326",
  url: JSON.parse(localStorage.getItem("mapSource"))
};

export default mapconfig
