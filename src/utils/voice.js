/*
 * @version: 
 * @Author: sscaij
 * @Date: 2021-03-31 14:03:42
 * @LastEditTime: 2021-10-11 14:07:13
 * @LastEditors: sscaij
 */

import store from '../store'
/**
 * @param {string} key
 * @returns {Object}
 */
export function getObjByKey(key) {
    if (store.getters.btnpremissAll[key]) {
      return store.getters.btnpremissAll[key]
    }
    return {url:"",method:""}
}
/**
 * 此方法支持按钮上绑定多个权限 url
 * @param {string} key code
 * @param {number}  i url顺序
 * @returns {String}
 */
export function getStringByKey(key,par,i) {
    if (store.getters.btnpremissAll[key]) {
      if(par == 'url'){
        var pos = store.getters.btnpremissAll[key].url.indexOf(';');
        if (pos > -1) {
            var arr = new Array();
            arr = store.getters.btnpremissAll[key].url.split(";");
            return arr[i]
        }
        return store.getters.btnpremissAll[key].url
      }
      if(par == 'method'){
        var pos = store.getters.btnpremissAll[key].method.indexOf(';');
        if (pos > -1) {
            var arr = new Array();
            arr = store.getters.btnpremissAll[key].method.split(";");
            return arr[i]
        }
        return store.getters.btnpremissAll[key].method
      }
    }
    return ''
}