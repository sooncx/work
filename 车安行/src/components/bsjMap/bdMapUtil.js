class mapBasics { //**地图基础类***
    constructor() {
        this.opKey = "bMap" //外部参数op给当前map使用key 
    }
    setZoom(op) { //设置地图显示的缩放级别
        /* 
            op={
                level:Number 3-18
                map:map
            }
        */
        op.map && op.map.setZoom(op.level)
    }
    zoomIn(map) { //地图放大一级显示
        map && map.zoomIn()
    }
    zoomOut(map) { //地图缩小一级显示
        map && map.zoomOut()
    }
    panTo({
        map,
        position
    }) { //地图中心点平移至指定点位置
        map && map.panTo(this.positionToLanLat(position))
    }
    setFitView(op) {
        /*
            op={
                map,overlayList,immediately,avoid,maxZoom
            }
        */
        var useOp = Object.assign({
            immediately: false, //immediately代表是否需要动画过
            avoid: [0, 0, 0, 0] //avoid代表上下左右的像素避让宽
            // maxZoom maxZoom代表fitView之后的最大级别
        }, op)
        // useOp.map && useOp.map.setFitView(useOp.overlayList, useOp.immediately, useOp.avoid)
        if (useOp.map && useOp.overlayList) {
            let bPoints = [];
            useOp.overlayList.forEach(item => {
                // this.getPoints(item);
                bPoints.push.apply(bPoints, this.getPoints(item))
            });
            useOp.map.setViewport(bPoints, {
                enableAnimation: useOp.immediately,
                margins: [useOp.avoid[0], useOp.avoid[3], useOp.avoid[1], useOp.avoid[2]]
            });
        }
    }

    getPoints(mark) {
        let type = mark.__type;
        let arr = [];
        switch (type) {
            case "marker":
                arr.push(mark.getPosition())
                break;
            case "polyline":
                arr = mark.getPath();
                break;
            case "polygon":
                console.log("type:", type, "Position", mark.getPath())
                arr = mark.getPath();
                break;
            case "circle":
                console.log("type:", type, "Position", mark.getCenter())
                arr.push(mark.getCenter())
                break;
            case "label":
                console.log("type:", type, "Position", mark.getPosition())
                arr.push(mark.getPosition())
                break;

            default:
                break;
        }
        // console.log(type,arr)
        return arr;
    }

    offset(size){
        size=size[this.opKey]||size
        var {w,h}=size
        return new BMap.Size(w,h)
    }

    clearMap(map) { //删除地图上所有的覆盖物
        map.clearOverlays()
    }
    destroy(map) { //注销地图对象，并清空地图容器
        map.destroy()
    }
    LngLat(x, y) { //x=lng=39.922501, y=lat=116.387271
        //   new BMap.LngLat(116.400433, 39.908084),
        return new BMap.Point(y, x)
    }
    positionToLanLat(position) {
        // x: 122.39859307799088 y: 43.993561802294636
        var lanLat = position[this.opKey] || position
        
        return lanLat.x ? this.LngLat(lanLat.x, lanLat.y) : lanLat
    }
    positionListToLanLat(list) {
        var result = [];
        list.map(item => {
            result.push(this.positionToLanLat(item))
        })
        return result;
    }
    Size(widthSize, heightSize) {
        
        return new BMap.Size(widthSize, heightSize)
    }
    Pixel(offset) {
        offset=offset[this.opKey]||offset
        var {w,h}=offset
        return new BMap.Pixel(offset.w, offset.h)
    }
    bindEvent(name, call) { //为marker绑定事件 //当前的this为marker
        if (typeof call !== "function") console.error("call必须为function")
        // debugger
        this.addEventListener(name, (e) => { //_data为当前marker绑定的数据，e为高德地图返回的evevt事件一些其他参数
            var baseE = {
                type: e.type, //事件类型。
                target: e.target, //	发生事件的目标对象。
                position: e.point, //发生事件时光标所在处的经纬度坐标。
                pixel: e.pixel, //	发生事件时光标所在处的像素坐标。
            }
            call(this["_data"], baseE)
        })
    }
    removeEvent(name, call) { //为name解绑事件 //当前的this为marker
        /**
         * click
         * 
         * **/
        if (typeof call !== "function") console.error("call必须为function")
        this.off(name, call)
    }
    setMap(map, marker) {
        map.addOverlay(marker)
    }

}

class markerUpdateUtil extends mapBasics { //marker的基本方法
    constructor(marker) {
        super() //使用“this”之前首先调用 super()。
        this.marker = marker
    }
    setPosition(position) {
        /*
            position={
                aMap:{
                    x:114.3517870685943,
                        y:30.384989654327615
                },
                bdMap:{
                    x:114.3517870685943,
                        y:30.384989654327615
                }
            }
            或者
            position={
                x:114.3517870685943,
                y:30.384989654327615
            }
        */
        this.marker.setPosition(this.positionToLanLat(position))
    }
    setAngle(angle) {
        /*
        angle:50 Number
        */
        this.marker.setRotation(angle)
    }
    setText(t) { //	修改文本内容 百度地图就是setContent方法没有写错，别改
        this.marker && this.marker.setContent(t);
    }
    hide() {
        this.marker && this.marker.hide()
    }
    show() {
        this.marker && this.marker.show()
    }
    remove(map) {
        map.remove(this.marker)
    }
    setContent(content) {
        this.marker.setContent&&this.marker.setContent(content.innerHTML)
        this.marker._setContent&&this.marker._setContent(content.innerHTML)
        // this.marker.setContent(content.innerHTML)
        // this.marker.redraw();
    }
    open(map, position) {
        if(this.marker._data.isCustom){
            this.marker.open();
        }else{
            var point = this.positionToLanLat(position);
            map.openInfoWindow(this.marker,point);
        }
        // this.marker.open(map, this.positionToLanLat(position))
    }
    close() {
        this.marker.close()
    }
    setOffset(offset) { //	设置Marker偏移量
        this.marker.setOffset(this.offset(offset))
    }
    setPath(path) { //折线专属方法
        this.marker.setPath(path)
    }
    getPath() { //折线专属方法
        return this.marker.getPath()
    }
    IsContainPoint(position){

    }
}

class TileLayerUtils {
    constructor(tileLayer) {
        this.tileLayer = tileLayer
    }
    show() {
        this.tileLayer.show()
    }
    hide() {
        this.tileLayer.hide()
    }
}
class bdMapUtil extends mapBasics {
    constructor() {
        super() //使用“this”之前首先调用 super()。

    }
    markBindProto(mark, op, type) { //mark为当前覆盖物 op为生成当前覆盖物的所有参赛 type为覆盖物的类型
        mark["__type"] = type
        mark.$util = new markerUpdateUtil(mark);
        mark._data = Object.assign({}, op)
        mark.$bindEvent = this.bindEvent
        mark.$removeEvent = this.removeEvent
    }
    /*******公布给外部实用类*********/
    setCenter(op) { //设置地图显示的中心点

        op.map.setCenter(this.positionToLanLat(op.position))
    }
    show(op) {
        if (_.isArray(op.marker)) {
            op.marker.map(item => {
                item.show()
            })
        } else {
            op.marker && op.marker.show();
        }
    }
    hide(op) {
        if (_.isArray(op.marker)) {
            op.marker.map(item => {
                item.hide()
            })
        } else {
            op.marker && op.marker.hide();
        }

    }
    remove(op) { //删除覆盖物/图层。参数为单个覆盖物/图层，或覆盖物/图层的数组。
        if (!op.map) {
            return
        }
        var overlayList = op.overlayers || op.marker
        if (overlayList) {
            if (_.isArray(overlayList)) {
                if (overlayList.length > 0) {
                    // op.map.remove(overlayList)
                    this.clearMap(op.map)
                }
            } else {
                overlayList && op.map.removeOverlay(overlayList)
            }
        }

        /*
            op:{
                map:map,
                overlayers:marker1||[marker1,marker2,polygon1]
            }
        */
    }
    createMarker(op) { //创建新图标
        var position = this.positionToLanLat(op.position);
        var markParams = {
            icon: new BMap.Icon(op.icon.image, op.icon.imageSize?this.Size(op.icon.imageSize.w,op.icon.imageSize.h):{}),
        }
        if (op.offset) {
            markParams.offset= this.offset(op.offset) ;
        }
        if(op.angle){
            markParams.rotation=op.angle;
        }
        var newMarker = new BMap.Marker( position , markParams);
       
       
         if (op.label) {
            newMarker.setLabel(this.createText({
                map:op.map,
                text:op.label.labelTxt,
                position:position,
                offset:op.label.offset,
              
            }))
        } 
        this.markBindProto(newMarker, op, "marker")
        op.overlay=newMarker;
        this.addOverlay(op);
        if(op.zIndex){
            newMarker.setZIndex(op.zIndex)
        }
        return newMarker
    }
    createPolygon(op) { //创建多边形围栏pc为多边形 
        /*** 
         * op={
              path: points,//设置多边形边界路径
            strokeColor: "#FF33FF", //线颜色
            strokeOpacity: 0.2, //线透明度
            strokeWeight: 3,    //线宽
            fillColor: "#1791fc", //填充色
            fillOpacity: 0.35, //填充透明度
            bubble: true,
            title: areaSource[i].pathName
        }
         * 
        */

        var path = op.path[this.opKey] || op.path;
        var usePath = []
        path.map(item => {
            usePath.push(this.LngLat(
                item.x, item.y
            ))
        })
        op = Object.assign({
            strokeColor: "#FF33FF",
            fillColor: '#1791fc',
            strokeWeight: 3,
            strokeOpacity: 0.2,
            fillOpacity: 0.3,
            zIndex: 50,
        }, op);

        var newPoly = new BMap.Polygon(usePath, op)
        if (op.map) op.map.addOverlay(newPoly);

        this.markBindProto(newPoly, op, 'polygon')
        return newPoly
    }
    createCircle(op) { //创建圆形围栏
        /*
        op={
             center:{
                 aMap:{x,y},
                 bMap:{x,y}
             }, // 圆心位置
             radius: 1000,  //半径
            strokeColor: "#F33",  //线颜色
            strokeOpacity: 1,  //线透明度
            strokeWeight: 3,  //线粗细度
            fillColor: "#ee2200",  //填充颜色
            fillOpacity: 0.35 //填充透明度
        }
        */
        var center = this.positionToLanLat(op.center);
        var useOp = Object.assign({
            strokeColor: "#F33",  //线颜色
            strokeOpacity: 1,  //线透明度
            strokeWeight: 3,  //线粗细度
            fillColor: "#41cac0",  //填充颜色
            fillOpacity: 0.4 //填充透明度
        }, op)
        var newCircle = new BMap.Circle(center,useOp.radius,useOp);
        this.markBindProto(newCircle, useOp, 'circle')
        op.map.addOverlay(newCircle);            //增加圆
        return newCircle
    }
    createPolyline(op) { //回执轨迹回放线条
        /*
            op={
                map：map,
                path: lineArr,            // 设置线覆盖物路径
                strokeColor: '#3366FF',   // 线颜色
                strokeOpacity: 1,         // 线透明度
                strokeWeight: 2,          // 线宽
                strokeStyle: 'solid',     // 线样式
                strokeDasharray: [10, 5], // 补充线样式
                geodesic: true            // 绘制大地线
            }
        */
        op = Object.assign({
            strokeColor: '#44AEFF', // 线颜色
            strokeOpacity: 1, // 线透明度
            strokeWeight: 4, // 线宽
            outlineColor: "#14578A",
            // isOutline: true,
            strokeStyle: 'solid', // 线样式
            strokeDasharray: [10, 5], // 补充线样式
            geodesic: true // 绘制大地线
        }, op, {
            path: this.positionListToLanLat(op.path[this.opKey] || op.path)
        })
        var newPolyline = new BMap.Polyline(this.positionListToLanLat(op.path[this.opKey] || op.path), op);
        this.setMap(op.map, newPolyline)
        this.markBindProto(newPolyline, op, 'polyline')
        return newPolyline
    }
    createText(op) { //创建文本标记label
        /* 
            op={text:'纯文本标记',
                anchor:'center', // 设置文本标记锚点
                draggable:true,
                cursor:'pointer',
                angle:0,
                style:{
                    'padding': '.75rem 1.25rem',
                    'margin-bottom': '1rem',
                    'border-radius': '.25rem',
                    'background-color': 'white',
                    'width': '15rem',
                    'border-width': 0,
                    'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                    'text-align': 'center',
                    'font-size': '20px',
                    'color': 'blue'
                },
                position: [116.396923,39.918203]}
        */
        var useOp = Object.assign({
            style: {
                'border-radius': '4px',
                'background-color': 'white',
                'padding': '5px 10px',
                'border-width': 0,
                'box-shadow': '0 2px 6px 0 rgba(236, 233, 233, .1)',
                'text-align': 'center',
                'color': '#666'
            }
        }, op, {
            position: this.positionToLanLat(op.position)
        })
        if (op.offset) {
            useOp["offset"] = this.offset(op.offset)
        }
        var label = new BMap.Label(useOp.text,useOp);
        label.setStyle(useOp.style)
        this.setMap(op.map, label)
        this.markBindProto(label, useOp, 'label')
        
        return label
    }
    createInfoWindow(op) { //弹出一个详细信息展示窗体
        if(op.offset){
            op.offset= this.offset(op.offset);
        }
        var useOp = Object.assign({
            enableAutoPan: false,
            enableCloseOnClick: false,
            width : 0
        }, op)
        var infoWindow=null
        infoWindow = new BMap.InfoWindow("",useOp)
        this.markBindProto(infoWindow, useOp, 'infoWindow')
        return infoWindow
        /*
            isCustom

            Boolean

            是否自定义窗体。设为true时，信息窗体外框及内容完全按照content所设的值添加（默认为false，即在系统默认的信息窗体外框中显示content内容）

            autoMove

            Boolean

            是否自动调整窗体到视野内（当信息窗体超出视野范围时，通过该属性设置是否自动平移地图，使信息窗体完全显示）

            closeWhenClickMap

            Boolean

            控制是否在鼠标点击地图后关闭信息窗体，默认false，鼠标点击地图后不关闭信息窗体

            content

            String/HTMLElement

            显示内容，可以是HTML要素字符串或者HTMLElement对象，自定义窗体示例

            size

            Size

            信息窗体尺寸（isCustom为true时，该属性无效）

            anchor

            String

            信息窗体锚点。 
            默认值：'bottom-center' 
            可选值：'top-left'|'top-center'|'top-right'|'middle-left'|'center'|'middle-right'|'bottom-left'|'bottom-center'|'bottom-right'                                                                                          （自v1.4.13 新增）

            offset

            Pixel

            信息窗体显示位置偏移量。默认基准点为信息窗体的底部中心（若设置了anchor，则以anchor值为基准点）。

            position

            LngLat

            信息窗体显示基点位置

            （自v1.2 新增）
            showShadow

            Boolean

            Boolean 控制是否显示信息窗体阴影，取值false时不显示窗体阴影，取值true时显示窗体阴影

            默认值：false
        */
    }
    createSatellite(map) { //创建卫星图
        var Satellite = new BMap.TileLayer.Satellite();
        this.setMap(op.map, Satellite)

        Satellite.$utils = new TileLayerUtils(Satellite)
        return Satellite
    }
    createTraffic(map) { //创建交通图
        var Traffic = new BMap.TileLayer.Traffic();
        map && Traffic.addOverlay(map)
        this.setMap(op.map, Traffic)
        Traffic.$utils = new TileLayerUtils(Traffic)
        return Traffic
    }
    addOverlay(op) {
        op.map.addOverlay(op.overlay);
    }
    IsContainPoint({map,position}){
        //lng: 113.40593003541318 lat: 22.915450130787775
        let lng=position.lng;
        let lat=position.lat;
        var bound = map.getBounds();
        return bound.containsPoint(new BMap.Point(lng, lat));
        var bounds = map.getBounds();
        var izoom = map.getZoom() * 2;
        var southwest = bounds.getSouthWest();
        var northeast = bounds.getNorthEast();
        southwest = new BMap.Point(southwest.getLng() + (0.04 / izoom), southwest.getLat() + (0.025 / izoom));
        northeast = new BMap.Point(northeast.getLng() - (0.04 / izoom), northeast.getLat() - (0.025 / izoom));
        bounds = new BMap.Bounds(southwest, northeast)
        var bool = bounds.contains(new BMap.Point(lng, lat));
        return bool;
    }
}
export default new bdMapUtil()