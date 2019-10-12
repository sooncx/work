class dragResize{
  constructor({wrapEl,dragEl,topStart=false,minHeight=20,maxHeight=500}){
    /***
     el:绑定的元素
     topStart:是否在垂直顶部可以选择上拉伸
     X:是否在水平方向上拉伸 
      
     *  */ 
    this.$wrapEl=wrapEl; //需要改变大小的元素
    this.$dragEl=dragEl||this.$wrapEl; //拉伸触发的元素
    this.topStart=topStart
    this.minHeight=minHeight;
    this.maxHeight=maxHeight;
    this.init();
    this.deepPx=100;//相差多少像素可以进行拉伸
    this.oldEvent=null;
    this.beyondPx=100;//超出这个PX的时候
  }
  init(){
    this.bindMousemove()
  }
  bindMousemove(){
    this.$dragEl.onmousedown=(event)=>{
      var x=event.clientX;
      var y=event.clientY;
      var oBoxW=this.$wrapEl.offsetWidth;
      var oBoxH=this.$wrapEl.offsetHeight;
      var oBoxL=this.$wrapEl.offsetLeft;
      this.isMousedown=true
      this.oldEvent=event;
    }
    document.onmousemove=(event)=>{
      // console.log(event.clientY)
      // var absOffsetY=Math.abs(event.offsetY)
      
      var boxHeight=this.$wrapEl.offsetHeight;
      var elOffsetTop=this.getTop(this.$wrapEl)
      var cursorStyle="default"
      var offsetY=window.innerHeight-event.clientY-boxHeight;
      var isDoClearMousedownStatus=true;//是否清除鼠标按下状态
      if(this.topStart){//是否开启顶部拉伸高度
      //  if(Math.abs(offsetY) <=this.deepPx){ //垂直顶部拉伸高度
        cursorStyle="ns-resize"
        if(this.isMousedown){ //是否按下鼠标左边
          var deepY=event.clientY-(this.oldEvent?this.oldEvent.clientY:event.clientY);
          this.$wrapEl.style.height=Math.min(this.maxHeight, Math.max(this.minHeight,(boxHeight-deepY)))+"px"
          }
      }else{ //以后兼容左右拉伸 else if
        cursorStyle = 'default';
      }
      this.oldEvent=event;
      this.$dragEl.style.cursor = cursorStyle;
    }
    
    document.onmouseup =(event)=>{
     this.clearMousedownStatus()
    }
  }
  clearMousedownStatus(){ //清除按下的状态
    this.isMousedown=false;
    this.oldEvent=null;
    this.$dragEl.style.cursor = 'default';
  }
  getTop(e){
    var offset=e.offsetTop;
    if(e.offsetParent!=null) offset+=this.getTop(e.offsetParent);
    return offset;
  }
}
export default dragResize