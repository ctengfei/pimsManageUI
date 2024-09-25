import 'ol/ol.css'
import Cluster from 'ol/source/Cluster';
import Circle from "ol/style/Circle"
import {
  Map,
  View
} from 'ol'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import Overlay from 'ol/Overlay'
import Feature from 'ol/Feature'
import {
  Point,
  LineString,
  Polygon
} from "ol/geom";
import {
  Style,
  Fill,
  Stroke,
  Text,
  Icon
} from 'ol/style'
import {
  getCenter,
  boundingExtent
} from 'ol/extent'
import {
  ImageStatic,
  Vector as VectorSource
} from 'ol/source'
import {
  defaults
} from 'ol/control'
import TileLayer from 'ol/layer/Tile'
import {
  TileSuperMapRest
} from '@supermap/iclient-ol'
import '@supermap/iclient-ol/dist/iclient-openlayers.min.css'
import XYZ from 'ol/source/XYZ'
import {
  unByKey
} from 'ol/Observable'
import mapconfig from '@/api/wggl/mapconfig'
import {
  randomColor
} from '@/utils'
import {
  getBoundaryPoint
} from '@/api/wggl/wgzl'
import {
  GetFeaturesBySQLParameters,
  FeatureService
} from '@supermap/iclient-ol'
import GeoJSON from 'ol/format/GeoJSON';
import {
  getDicts
} from '@/api/system/dict/data'

export default {
  data() {
    return {
      mapOptions: {},
      pointSource: null,
      pointLayer: null,
      poplayer: null,
      mapLayerArr: [],
      mapClick: null,
      popTitle: '',
      showPop: false,
      popData: {
        title: '',
        id: ''
      },
      clusterSource: null,
      clusters: [],
      valLength: 0,
      popup: null,
      mapDataSource: ''
    }
  },
  mounted() {
    this.mapOptions =
      mapconfig.url || JSON.parse(localStorage.getItem('mapSource'))
    this.initMap()
    for (let i = 0; i < this.mapOptions.length; i++) {
      // if (this.mapOptions[i].isDefault === 'Y') {
      //   this.mapView = this.mapOptions[i].dictValue
      //   this.checkMapView(this.mapOptions[i].dictValue)
      // }
      // 暂时默认使用深色地图
      if (this.mapOptions[i].dictValue === '2') {
        this.mapView = this.mapOptions[i].dictValue
        this.checkMapView(this.mapOptions[i].dictValue)
      }
    }
    this.getMapDataSourceUrl()
  },
  methods: {
    getMapDataSourceUrl() {
      let type = process.env.VUE_APP_MAP_URL_DICT + '_zy'
      getDicts(type).then((res) => {
        this.mapDataSource = res.data[0].remark
      })
    },
    // 地图初始化
    initMap() {
      this.pointSource = new VectorSource({
        wrapX: false,
        features: []
      })
      this.pointLayer = new VectorLayer({
        source: this.pointSource
      })
      this.mapLayerArr = []
      for (let i = 0; i < this.mapOptions.length; i++) {
        if (this.mapOptions[i].dictValue == 6) {
          this.mapLayerArr.push(
            new TileLayer({
              source: new XYZ({
                url: this.mapOptions[i].remark,
                wrapX: true
              }),
              visible: false
            })
          )
        } else {
          this.mapLayerArr.push(
            new TileLayer({
              source: new TileSuperMapRest({
                url: this.mapOptions[i].remark,
                wrapX: true
              }),
              visible: false
            })
          )
        }
      }
      // this.mapLayerArr.push(this.pointLayer)
      var mapcontainer = this.$refs.rootmap
      let num = mapconfig.maxZoom * 1 + 3
      this.map = new Map({
        target: mapcontainer,
        layers: this.mapLayerArr,
        view: new View({
          projection: 'EPSG:4326', //使用这个坐标系
          center: [mapconfig.x, mapconfig.y],
          zoom: 9,
          minZoom: 8,
          maxZoom: num
        }),
        controls: defaults({
          zoom: false,
          rotate: false,
          attribution: false
        })
      })

      // var container = document.getElementById('popup')
      // this.poplayer = new Overlay({
      //   element: container,
      //   autuPan: true
      // })
      // this.poplayer.setPosition(undefined)
      // this.map.addOverlay(this.poplayer)
      this.addClick()
      this.addPopup()
      // this.initFeature()
    },
    // 切换图层单选框
    checkMapView(val) {
      for (let i = 1; i <= this.mapOptions.length; i++) {
        if (val == i) {
          this.map
            .getLayers()
            .item(i - 1)
            .setVisible(true)
        } else {
          this.map
            .getLayers()
            .item(i - 1)
            .setVisible(false)
        }
      }
    },
    getChecking(val) {
      this.checkMapView(val)
    }
  }
}
