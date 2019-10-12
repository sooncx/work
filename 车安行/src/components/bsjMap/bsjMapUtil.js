import $aMapUtil from "./aMapUtil"
import $bdMapUtil from "./bdMapUtil"
class bsjMapUtil{
    constructor(){
        this.mapType=null
        this.$aMapUtil=$aMapUtil 
        this.$bdMapUtil=$bdMapUtil
        this.$curMapUtil=null;
        this.defaultCreateMarkerOp ={ //创建新图标的默认参数
            icon:{ 
                size:{w:30,h:30} 
            },
            offset:null, 
            // offset：{
            //     w:0,
            //     h:0
            // },
            label:null
        } 
        this.opKey=""
    }
    setMapType(mapType){
        this.mapType=mapType
        switch(this.mapType){
            case "amap":
                this.$curMapUtil=this.$aMapUtil
               
                break;
            case "bdmap":
                this.$curMapUtil=this.$bdMapUtil
                break;
            default:
                console.error("maptype未识别",mapType)
        }
        this.opKey=this.$curMapUtil.opKey
    }
    do(name,op){
        switch(name){
            case "createMarker":
                op=_extendDeep(true,{},this.defaultCreateMarkerOp,op);
                break;      
            case "createText":
                let style={
                    'border-radius': '4px',
                    'background-color': 'white',
                    'padding':'5px 10px',
                    'border-width': 0,
                    'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                    'text-align': 'center',
                    'color': '#666'
                }
                op=_extendDeep(true,{style},op);
                break;      
        }
        return this.$curMapUtil&&this.$curMapUtil[name]&&this.$curMapUtil[name](op)
    }
    getUsePosition(position){ //获取当前地图类型使用的坐标点 position=Object||arrry
        
        if(_.isArray(position)){
            return  position.map(item=>{
                 return this.getUsePosition(item)
             })
        }else if( _.isObject(position)){

            return this.$curMapUtil.positionToLanLat(position)
        }else{
            console.error("getUsePosition参数必须为object或array")
        }
        
    }
  
}
export default new bsjMapUtil();