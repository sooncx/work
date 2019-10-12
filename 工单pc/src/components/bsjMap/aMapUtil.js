class  mapBasics{ //**地图基础类***
    constructor(){
        this.opKey="aMap" //外部参数op给当前map使用key 
    }
    setZoom(op){ //设置地图显示的缩放级别
        /* 
            op={
                level:Number 3-18
                map:map
            }
        */
        op.map&&op.map.setZoom(op.level)
    }
    zoomIn(map){ //地图放大一级显示
        map&&map.zoomIn()
    }
    zoomOut(map){ //地图缩小一级显示
        map&&map.zoomOut()
    }
    panTo({map,position}){ //地图中心点平移至指定点位置
        map&&map.panTo(this.positionToLanLat(position))
    }
    setFitView(op){
        /*
            op={
                map,overlayList,immediately,avoid,maxZoom
            }
        
        */
       var useOp=Object.assign({
        immediately:false, //immediately代表是否需要动画过
        avoid:[0,0,0,0] //avoid代表上下左右的像素避让宽
        // maxZoom maxZoom代表fitView之后的最大级别
       },op)
       
        useOp.map&&useOp.map.setFitView(useOp.overlayList,useOp.immediately,useOp.avoid)
    }
    
    clearMap(map){ //删除地图上所有的覆盖物
        map.clearMap()
    }
    destroy(map){ //注销地图对象，并清空地图容器
        map.destroy()
    }
    LngLat(x,y){ //x=lng=114.35883704574624, y=lat= 30.560517115344304
        //   new AMap.LngLat(116.400433, 39.908084),
        return new AMap.LngLat(x,y)
    }
    positionToLanLat(position){
        var lanLat=position[this.opKey]||position
        return lanLat.x?this.LngLat(lanLat.x,lanLat.y):lanLat
    }
    positionListToLanLat(list){
        var result=[];
        list.map(item=>{
            result.push(this.positionToLanLat(item))
        })
        return result;
    }
    Size(widthSize,heightSize){
        return new AMap.Size(widthSize,heightSize)
    }
    opSizeToMapSize(size){
        return this.Size(size.w,size.h)
    }
    Pixel(offset){
        offset=offset[this.opKey]||offset
        var {w,h}=offset
        return new AMap.Pixel(w,h)
    }
    bindEvent(name,call){ //为marker绑定事件 //当前的this为marker
        if(typeof call !=="function") console.error("call必须为function")
        this.on(name,(e)=>{ //_data为当前marker绑定的数据，e为高德地图返回的evevt事件一些其他参数
            var baseE={
                type: e.type, //事件类型。
                target:e.target, //	发生事件的目标对象。
                position:e.lnglat,  //发生事件时光标所在处的经纬度坐标。
                pixel:e.pixel, //	发生事件时光标所在处的像素坐标。
            }
            call(this["_data"],baseE)
        })
    }
    removeEvent(name,call){//为name解绑事件 //当前的this为marker
        /**
         * click
         * 
         * **/
        if(typeof call !=="function") console.error("call必须为function")
        this.off(name,call)
    }
    
}

class markerUpdateUtil extends  mapBasics{ //marker的基本方法
    constructor(marker){
        super() //使用“this”之前首先调用 super()。
        this.marker=marker
    }
    setPosition(position){
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
    setAngle(angle){
        /*
        angle:50 Number
        */
        this.marker.setAngle(angle)
    }
    setText(t){ //	修改文本内容
        this.marker&&this.marker.setText(t)
    }
    hide(){
        this.marker&&this.marker.hide()
    }
    show(){
        this.marker&&this.marker.show()
    }
    remove(map){
        map.remove(this.marker)
    }
    setContent(content){
        this.marker.setContent(content)
    }
    open(map,position){
        this.marker.open(map,this.positionToLanLat(position))
    }
    close(){
        this.marker.close()
    }
    setOffset(offset){ //	设置Marker偏移量
        this.marker.setOffset(this.Pixel(offset))
    }
    setPath(path){ //折线专属方法
        this.marker.setPath(path)
    }
    getPath(){//折线专属方法
        return this.marker.getPath()
    }
}

class TileLayerUtils{
    constructor(tileLayer){
        this.tileLayer=tileLayer
    }
    show(){
        this.tileLayer.show()
    }
    hide(){
        this.tileLayer.hide()
    }
}
class aMapUtil extends  mapBasics{
    constructor(){
        super()//使用“this”之前首先调用 super()。
       
    }
    markBindProto(mark,op,type){ //mark为当前覆盖物 op为生成当前覆盖物的所有参赛 type为覆盖物的类型
        mark["__type"] = type
        mark.$util=new markerUpdateUtil(mark);
        mark._data=Object.assign({},op)
        mark.$bindEvent=  this.bindEvent
        mark.$removeEvent=  this.removeEvent
    }
    /*******公布给外部实用类*********/
    setCenter(op){ //设置地图显示的中心点
        
        op.map.setCenter(this.positionToLanLat(op.position))
    }
    show(op){
        if(_.isArray(op.marker)){
            op.marker.map(item=>{
                item.show()
            })
        }else{
            op.marker&&op.marker.show();
        }
    }
    hide(op){
        if(_.isArray(op.marker)){
            
            op.marker.map(item=>{
                item.hide()
            })
        }else{
            op.marker&&op.marker.hide();
        }
       
    }
    remove(op){ //删除覆盖物/图层。参数为单个覆盖物/图层，或覆盖物/图层的数组。
         if(!op.map){
             return
         }
        if(op.overlayers){
            if(_.isArray(op.overlayers)){
                if(op.overlayers.length>0){
                    op.map.remove(op.overlayers)
                }
            }else{
                op.overlayers&&op.map.remove(op.overlayers)
            }
        }
        if(op.marker){
            if(_.isArray(op.marker)){
                if(op.marker.length>0){
                    op.map.remove(op.marker)
                }
            }else{
                op.marker&&op.map.remove(op.marker)
            }
        }
       
        /*
            op:{
                map:map,
                overlayers:marker1||[marker1,marker2,polygon1]
            }
        
        */
    }
    createMarker(op){ //创建新图标
        var markParams={
            position:this.positionToLanLat(op.position),
            icon:new AMap.Icon({
                [op.icon.imageSize?'imageSize':'']:op.icon.imageSize?this.opSizeToMapSize(op.icon.imageSize):"",
                [op.icon.size?'size':'']:op.icon.size?this.opSizeToMapSize(op.icon.size):"",
                // this.opSizeToMapSize(op.icon.imageSize),
                image:op.icon.image
            }),
            zIndex:op.zIndex
        }
       if(op.map){
            markParams["map"]=op.map
        }
        if(op.offset){
            markParams["offset"]=this.Pixel(op.offset)
        }
        if(op.angle){
            markParams.angle=op.angle;
        }
        if(op.label){
            markParams["label"]={
                content:'<div class="bsj-map-label">'+op.label.labelTxt+'</div>',
                offset:this.Pixel(op.label.offset),
                direction :"center"
            }
        }
    
        var newMarker= new AMap.Marker(markParams);
        this.markBindProto(newMarker,op)
        
        return newMarker
        
       
     
    }
    createPolygon(op){ //创建多边形围栏pc为多边形 
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
    
        var path=op.path[this.opKey]||op.path;
        var usePath=[]
        path.map(item=>{
            usePath.push(this.LngLat(
                item.x,item.y
            ))
        })
        op=Object.assign({
            strokeColor: "#FF33FF",
            fillColor: '#1791fc',
            strokeWeight: 3,
            strokeOpacity: 0.2,
            fillOpacity: 0.3,
        },op,{
            path:usePath
        });
        
        var newPoly=new AMap.Polygon(op)
        if(op.map) op.map.add(newPoly);
        
        this.markBindProto(newPoly,op)
        return newPoly
    }
    createCircle(op){//创建圆形围栏
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
       var useOp=Object.assign({
            strokeColor: "#F33",  //线颜色
            strokeOpacity: 1,  //线透明度
            strokeWeight: 3,  //线粗细度
            fillColor: "#41cac0",  //填充颜色
            fillOpacity: 0.4 //填充透明度
       },op,{
        center:this.positionToLanLat(op.center)
       })
       
       var newCircle=new AMap.Circle(useOp);
       this.markBindProto(newCircle,useOp)
       return  newCircle
    }
    createPolyline(op){ //回执轨迹回放线条
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
        op=Object.assign({
            strokeColor: '#44AEFF',   // 线颜色
            strokeOpacity: 1,         // 线透明度
            strokeWeight: 4,          // 线宽
            outlineColor: "#14578A",
            isOutline:false,
            strokeStyle: 'solid',     // 线样式
            strokeDasharray: [10, 5], // 补充线样式
            geodesic: true            // 绘制大地线
        },op,{path:this.positionListToLanLat(op.path[this.opKey]||op.path)})
        
        var newPolyline=new AMap.Polyline(op);
        op.map&&newPolyline.setMap(op.map)
        this.markBindProto(newPolyline,op)
        return  newPolyline
    }
    createText(op){ //创建文本标记label
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
       
        var useOp=Object.assign({
                anchor:'center',
                draggable:false,
                angle:0,
                style:{
                    'border-radius': '4px',
                    'background-color': 'white',
                    'padding':'5px 10px',
                    'border-width': 0,
                    'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                    'text-align': 'center',
                    'color': '#666'
                }
        },op,{
            position:this.positionToLanLat(op.position)
        })
        if(op.offset){
            useOp["offset"]=this.Pixel(op.offset)
        }
       var text = new AMap.Text(useOp);
       this.markBindProto(text,useOp)
       
       return text
    }
    createInfoWindow(op){ //弹出一个详细信息展示窗体
        var useOp=Object.assign({
            isCustom:true,
            autoMove:false,
            closeWhenClickMap:false,
        },op)
        if(useOp.offset){
            useOp.offset=this.Pixel(useOp.offset)
        }
        var infoWindow=new AMap.InfoWindow(useOp)
        this.markBindProto(infoWindow,useOp)
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
    createSatellite(map){ //创建卫星图
        var Satellite= new AMap.TileLayer.Satellite();
        map&&Satellite.setMap(map)

        Satellite.$utils=new TileLayerUtils(Satellite)
        return Satellite
    }
    createTraffic(map){ //创建交通图
        var Traffic= new AMap.TileLayer.Traffic();
        map&&Traffic.setMap(map)
        Traffic.$utils=new TileLayerUtils(Traffic)
        return Traffic
    }
    IsContainPoint({map,position}) {
        //lng: 113.40593003541318 lat: 22.915450130787775
        let lng=position.lng;
        let lat=position.lat;
        var B = map.getBounds();
        var A = map.getZoom() * 2;
        var F = B.getSouthWest();
        var D = B.getNorthEast();
        F = new AMap.LngLat(F.getLng() + (0.04 / A),F.getLat() + (0.025 / A));
        D = new AMap.LngLat(D.getLng() - (0.04 / A),D.getLat() - (0.025 / A));
        B = new AMap.Bounds(F,D);
        var G = B.contains(new AMap.LngLat(lng,lat));
        return G
    }
}
export default new aMapUtil()