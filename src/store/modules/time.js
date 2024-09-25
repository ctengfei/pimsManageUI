import Cookies from 'js-cookie'
import { reject } from 'lodash'
import { queryPreset, isPreset } from '@/api/monitor/timemonitor'

const state = {
  sidebar: {
    // opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : false,
    opened:false,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'small',
  scrollTop: 0,
  selectList: [],
  presetList: [],
  isPreset: false,
  cruiseStaus: {
    showCruiseBtn: false,
    id: ''
  },
  btnDataList: []
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  SET_SCROLL_TOP: (state, scrollTop) => {
    state.scrollTop = scrollTop
  },
  SET_SELECTED_DATA: (state, selectList) => {
    state.selectList = selectList
  },
  SET_CRUISE_STATUS: (state, cruiseStaus) => {
    state.cruiseStaus = cruiseStaus
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_PRSET_DATA: (state, presetList) => {
    state.presetList = presetList
  },
  SET_BTN_DATA: (state, btnDataList) => {
    state.btnDataList = btnDataList
  },
  SET_IS_PRESET: (state, isPreset) => {
    state.isPreset = isPreset
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  // GetPresetList({commit}, data) {
  //   return new Promise((resolve, reject) => {
  //     queryPreset(data).then(res => {
  //       if (res.meta.status === 200) {
  //         commit('SET_PRSET_DATA', res.data)
  //       } else {
  //         commit('SET_PRSET_DATA', [])
  //       }
  //       resolve(res)
  //     }).catch(err => {
  //       reject('err', err)
  //     })
  //   })
  // },
  GetPresetList({commit}, param) {
    return new Promise((resolve, reject) => {
      queryPreset(param.url, param.method, param.data).then(res => {
        if (res.code === 200) {
          commit('SET_PRSET_DATA', res.data.ptzPresetInfoList.ptzPresetInfo)
        } else {
          commit('SET_PRSET_DATA', [])
        }
        resolve(res)
      }).catch(err => {
        reject('err', err)
      })
    })
  },
  // GetIsPreset({commit}, data) {
  //   return new Promise((resolve, reject) => {
  //     isPreset(data).then(res => {
  //       if (res.meta.status === 200) {
  //         commit('SET_IS_PRESET', true)
  //       } else {
  //         commit('SET_IS_PRESET', false)
  //       }
  //       resolve(res)
  //     }).catch(err => {
  //       reject('err', err)
  //     })
  //   })
  // },
  GetIsPreset({commit}, params) {
    return new Promise((resolve, reject) => {
      isPreset(params.url, params.method, params.data).then(res => {
        if (res.code === 200) {
          commit('SET_IS_PRESET', true)
        } else {
          commit('SET_IS_PRESET', false)
        }
        resolve(res)
      }).catch(err => {
        reject('err', err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
