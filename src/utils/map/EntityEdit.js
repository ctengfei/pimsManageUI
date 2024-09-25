import {
    updateFence
} from "@/api/comMap/commap.js";
import { Message } from 'element-ui'
class EntityEdit {
    setEntityEdit(GisMapObj) {
        this.viewer = GisMapObj.viewer;
        this.initEventHandler(GisMapObj);
    }
    //鼠标事件
    initEventHandler(GisMapObj) {
        this.eventHandler = new ISGis.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.initParm(GisMapObj);
    }
    /*初始化数据*/
    initParm(GisMapObj) {
        if(GisMapObj){
            this.GisMapObj = GisMapObj
        }
        // 用于保存实体的对象
        this.editEntity = undefined;

        // 判断是否处于编辑状态
        this.isEditing = false;

        // 设置当前的编辑点
        this.editVertext = undefined;
        // 清空编辑点ID数组
        this.pointsId = [];
        /*中间编辑点数组*/
        this.centerPointsId = [];
    }
    //激活编辑
    activate(obj) {
        this.deactivate();
        //鼠标左键点击事件 鼠标左键点击拾取需要编辑的对象
        this.initLeftClickEventHandler(obj);
    }
    ScreenToLonLatAlt(ObjArr) {
        //世界坐标==>地理坐标
        // var ellipsoid = this.viewer.scene.globe.ellipsoid;
        return new Promise(function (resolve, reject) {
            let tempList = []
            for (let index = 0; index < ObjArr.length; index++) {
                //方法一
                var position = ISGis.Util.Transfrom.cartesianToLonlat(
                    ObjArr[index]
                );
                //方法二
                // var xyz = new ISGis.Cesium.Cartesian3(ObjArr[index].x, ObjArr[index].y, ObjArr[index].z);
                // var wgs84 = ellipsoid.cartesianToCartographic(xyz);
                tempList.push(position)
            }
            resolve(tempList)
        });
    }
    //禁用编辑
    deactivate(id, callback) {
        let polygonArr = []
        let lon = [],
            lat = [],
            height = [];
        if (this.editEntity && this.editEntity.polygon && this.editEntity.polygon.hierarchy) {
            if (id) {
                let lonlats = this.editEntity.polygon.hierarchy.getValue().positions
                this.ScreenToLonLatAlt(lonlats).then((res) => {
                    for (let i = 0; i < res.length; i++) {
                        let worldToLonlat = res[i];
                        polygonArr.push(worldToLonlat[0], worldToLonlat[1]);
                        lon.push(worldToLonlat[0]);
                        lat.push(worldToLonlat[1]);
                        height.push(worldToLonlat[2]);
                    }
                    let polygonCenter = [
                        (Math.min.apply(null, lon) + Math.max.apply(null, lon)) / 2,
                        (Math.min.apply(null, lat) + Math.max.apply(null, lat)) / 2,
                        Math.max.apply(null, height),
                    ];
                    let obj = {
                        id: id,
                        points: polygonArr.toString(),
                        polygonCenter: polygonCenter.toString(),
                    };
                    updateFence("/vm/gis/fence", obj)
                        .then((res) => {
                            if (res.meta.status === 200) {
                                callback(res)
                            } else {
                                Message.error(res.meta.message);
                            }
                        })
                        .catch((err) => {
                            Message.error("数据访问失败！", err);
                        });
                })
            }
        }
        this.eventHandler.removeInputAction(ISGis.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.unRegisterEvents();
        this.clearAllEditVertex();
        this.initParm()
    }
    // 左键点击事件--此事件为手工拼装，需根据要求优化--忽删除
    initLeftClickEventHandler(e) {
        // this.eventHandler.setInputAction(e => {
            // let e = {x: 670.75, y: 389}
            //通过pick进行地形上的坐标的获取
            let id = this.viewer.scene.pick(e)
            if(!id || !id.id){
                e.x=e.x+200
                id = this.viewer.scene.pick(e)
                if(!id || !id.id){
                    e.x=e.x+200
                    id = this.viewer.scene.pick(e)
                    if(!id || !id.id){
                        e.x=e.x+200
                        id = this.viewer.scene.pick(e)
                    }
                }
            }
            // let id = this.viewer.scene.pick(e.position);
            // 拾取到对象 判断拾取到的对象类型
            if (!id || !id.id || id.id.id.indexOf("polygon") > 0) {
                /*保存的数据*/
                if (this.editEntity) {
                    console.log(JSON.stringify(this.editEntity.polygon.hierarchy._value))
                    this.clearAllEditVertex();
                    this.initParm()
                }
                return;
            };
            //重复点击同一个对象
            if (this.editEntity && this.editEntity.id == id.id.id) return;
            this.handlePickEditEntity(id.id);
        // }, ISGis.Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    //处理拾取到的对象
    handlePickEditEntity(pickId) {
        this.isEditing = false;
        this.editEntity = pickId;
        this.createEditVertex();
        // this.createMidVertex();
        this.unRegisterEvents();
        this.registerEvents();
    }

    //注册事件监听
    registerEvents() {
        //鼠标左键按下事件 当有对象被选中时 如果拾取到编辑辅助要素 表示开始改变对象的位置
        this.initLeftDownEventHandler();
        //鼠标移动事件 鼠标移动 如果有编辑对象 表示改变编辑对象的位置
        this.initMouseMoveEventHandler();
        //鼠标左键抬起事件 当有编辑对象时
        this.initLeftUpEventHandler();
        /*右键删除*/
        this.initmiddleclickHander();
    }
    /*右键删除*/
    initmiddleclickHander() {
        this.eventHandler.setInputAction((e) => {
            let id = this.viewer.scene.pick(e.position);
            // 拾取到对象 判断拾取到的对象类型
            if (!id || !id.id || !id.id.type) return;
            //拾取到具有type 属性的entity对象
            console.log(this.editEntity.polygon.hierarchy._value.positions.length)
            if (id.id.type == "EditVertex" && this.editEntity.polygon.hierarchy._value.positions.length > 3) {
                this.editEntity.polygon.hierarchy._value.positions.splice(id.id.vertexIndex, 1);
                this.editEntity.polygon.hierarchy = this.editEntity.polygon.hierarchy._value;
                this.clearAllEditVertex();
                this.createEditVertex();
                //  this.createMidVertex();
            }
        }, ISGis.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    //取消事件监听
    unRegisterEvents() {
        this.eventHandler.removeInputAction(ISGis.Cesium.ScreenSpaceEventType.LEFT_DOWN);
        this.eventHandler.removeInputAction(ISGis.Cesium.ScreenSpaceEventType.LEFT_UP);
        this.eventHandler.removeInputAction(ISGis.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    //场景鼠标左键按下事件
    initLeftDownEventHandler() {
        this.eventHandler.setInputAction((e) => {
            let id = this.viewer.scene.pick(e.position);
            // 拾取到对象 判断拾取到的对象类型
            if (!id || !id.id || !id.id.type) {
                return;
            };
            //拾取到具有type 属性的entity对象
            if (id.id && id.id.type == "EditVertex") {
                this.isEditing = true;
                //禁用场景的旋转移动功能 保留缩放功能
                this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
                // this.viewer.scene.screenSpaceCameraController.enableZoom = false;//缩放
                this.viewer.scene.screenSpaceCameraController.enableRotate = false;
                //改变鼠标状态
                this.viewer.enableCursorStyle = false;
                this.viewer._element.style.cursor = '';
                document.body.style.cursor = "move";
                this.editVertext = id.id;
                this.editVertext.show = false;
            } else if (id.id && id.id.type == "EditMidVertex") {
                this.isEditing = true;
                this.editVertext = id.id;
                this.editEntity.polygon.hierarchy._value.positions.splice(id.id.vertexIndex + 1, 0, id.id.position._value);
                this.viewer.scene.screenSpaceCameraController.enableTranslate = false;
                // this.viewer.scene.screenSpaceCameraController.enableZoom = false;//缩放
                this.viewer.scene.screenSpaceCameraController.enableRotate = false;
                this.viewer.enableCursorStyle = false;
                this.viewer._element.style.cursor = '';
                document.body.style.cursor = "move";
            }
        }, ISGis.Cesium.ScreenSpaceEventType.LEFT_DOWN);
    }

    //场景鼠标左键抬起事件
    initLeftUpEventHandler() {
        this.eventHandler.setInputAction(((e) => {
            if (!this.isEditing) return;
            this.viewer.enableCursorStyle = true;
            document.body.style.cursor = "pointer";
            this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
            this.editVertext.show = true;
            this.isEditing = false;
        }), ISGis.Cesium.ScreenSpaceEventType.LEFT_UP);
    }

    //场景鼠标移动事件
    initMouseMoveEventHandler() {
        this.eventHandler.setInputAction(((e) => {
            if (!this.isEditing) return;
            if (this.editVertext.type == "EditVertex" || this.editVertext.type == "EditMidVertex") {
                // 获取屏幕坐标，移动监听与点击有所不同，所以有起始位置和终点位置
                let windowPosition = e.startPosition;
                // 将屏幕坐标转为笛卡尔坐标
                let ellipsoid = this.viewer.scene.globe.ellipsoid;
                let cartesian = this.viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
                // 如果点击到地球外，那么返回
                if (!cartesian) {
                    return;
                }
                // 更新编辑点的位置
                this.editVertext.position = cartesian;
                // 创建面标每个点位置信息的数组，并循环赋值
                let points = [];

                for (let id of this.pointsId) {
                    points.push(this.viewer.entities.getById(id).position._value);
                }
                // 更新面标的位置数组
                this.editEntity.polygon.hierarchy = points;

            }
            //this.EditMoveCenterPositoin = this.getCenterPosition();
        }), ISGis.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    //创建编辑节点
    createEditVertex() {
        var positions = this.editEntity.polygon.hierarchy._value.positions;
        // 生成编辑点
        this.pointsId = [];
        for (var i = 0; i < positions.length; i++) {
            let point = this.viewer.entities.add({
                type: "EditVertex",
                position: positions[i],
                vertexIndex: i,
                point: {
                    color: ISGis.Cesium.Color.WHITE,
                    pixelSize: 8,
                    outlineColor: ISGis.Cesium.Color.BLACK,
                    outlineWidth: 1
                }
            });
            // 保存点的ID以便删除
            this.pointsId.push(point.id);
        }
    }
    /*两个点中间的点*/
    createMidVertex() {
        var positions = this.editEntity.polygon.hierarchy._value.positions;
        this.centerPointsId = [];
        for (var i = 0; i < positions.length; i++) {
            var cartographic = ISGis.Cesium.Cartographic.fromCartesian(positions[i], this.viewer.scene.globe.ellipsoid, new ISGis.Cesium.Cartographic())
            positions[i].Longitude = ISGis.Cesium.Math.toDegrees(cartographic.longitude);
            positions[i].Latitude = ISGis.Cesium.Math.toDegrees(cartographic.latitude);
            if (i != positions.length - 1) {
                var cartographic2 = ISGis.Cesium.Cartographic.fromCartesian(positions[i + 1], this.viewer.scene.globe.ellipsoid, new ISGis.Cesium.Cartographic())
                positions[i + 1].Longitude = ISGis.Cesium.Math.toDegrees(cartographic2.longitude);
                positions[i + 1].Latitude = ISGis.Cesium.Math.toDegrees(cartographic2.latitude);
                var point = this.getNewRollPoint(positions[i], positions[i + 1])
            } else if (i == positions.length - 1) {
                var point = this.getNewRollPoint(positions[i], positions[0])
            }
            if (point) {
                var entities = this.viewer.entities.add({
                    type: "EditMidVertex",
                    position: ISGis.Cesium.Cartesian3.fromDegrees(point[0], point[1]),
                    vertexIndex: i,
                    point: {
                        color: ISGis.Cesium.Color.WHITE,
                        pixelSize: 8,
                        outlineColor: ISGis.Cesium.Color.RED,
                        outlineWidth: 1
                    }
                });
                this.centerPointsId.push(entities.id)
            }
        }
    };
    /*清空两个点的中心点*/
    clearMidVertex() {
        for (var i = 0; i < this.centerPointsId.length; i++) {
            this.viewer.entities.removeById(this.centerPointsId[i]);
        }
    }
    /*清除所有点位*/
    clearAllEditVertex() {
        for (var i = 0; i < this.centerPointsId.length; i++) {
            this.viewer.entities.removeById(this.centerPointsId[i]);
        }
        for (var i = 0; i < this.pointsId.length; i++) {
            this.viewer.entities.removeById(this.pointsId[i]);
        }
    }
    /*求两个点的中点 经纬度*/
    getNewRollPoint(a, b) {
        var len = Math.sqrt((a.Longitude - b.Longitude) * (a.Longitude - b.Longitude) + (a.Latitude - b.Latitude) * (a.Latitude - b.Latitude)) / 2;
        var r = Math.sqrt((a.Longitude - b.Longitude) * (a.Longitude - b.Longitude) + (a.Latitude - b.Latitude) * (a.Latitude - b.Latitude));
        var cx = (len * (b.Longitude - a.Longitude)) / r + a.Longitude;
        var cy = (len * (b.Latitude - a.Latitude)) / r + a.Latitude;
        return [cx, cy]
    }

}
export default new EntityEdit()