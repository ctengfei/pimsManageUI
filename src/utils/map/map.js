/*
 * @Description: 全局地图对象模块，在main.js中引入该对象，初始化全局地图组件时，将地图组件对象设置至该模块属性，可以全局使用对应的地图对象
 * @Author: slfang
 * @Date: 2019-11-26 18:42:24
 */
import app from './app'
export default {
  MapInstance2D: null,
  MapInstance3D: null,
  showCallBack: null,
  hideCallBack: null,
  handleClick: null,
  setMapInstance2D(instance) {
    console.log('设置全局地图')
    this.MapInstance2D = instance
  },
  setMapInstance3D(instance) {
    this.MapInstance3D = instance
  },
  showMap2D(callback) {
    if (this.MapInstance2D) {
      this.MapInstance2D.showMap2D();
      if (callback && typeof callback === 'function') {
        callback();
      }
    } else {
      this.showCallBack = callback
    }
  },
  hideMap2D(callback) {
    if (this.MapInstance2D) {
      this.MapInstance2D.hideMap2D();
      this.MapInstance2D.$off('clickPoint');
      if (callback && typeof callback === 'function') {
        callback();
      }
    } else {
      this.hideCallBack = callback
    }
  },
  clearPoint(layerName) {
    if (this.MapInstance2D) {
      this.MapInstance2D.clearPoint(layerName);
    }
  },
  mapReady() {
    if (this.showCallBack && typeof this.showCallBack === 'function') {
      app.AppInstance.showMap2D();
      this.showCallBack();
    }
    if (this.hideCallBack && typeof this.hideCallBack === 'function') {
      app.AppInstance.hideMap2D();
      this.hideCallBack();
    }
  },
  addClickEvent(callback) {
    this.handleClick = callback;
  },
  onClick(data) {
    console.log('clickkkkk')
    if (this.handleClick && typeof this.handleClick === 'function') {
      this.handleClick(data)
    }
  },
  clear() {
    console.log('clearrrrr')
    this.showCallBack = null;
    this.hideCallBack = null;
    this.handleClick = null;
  }
}
