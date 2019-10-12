export default ({startDate,endDate})=>{
    var dateTime1=new Date(startDate).getTime();
    var dateTime2=new Date(endDate).getTime();
    var diffTime=dateTime1-dateTime2;
 
        //计算出相差天数
        var days=Math.floor(date3/(24*3600*1000))
 
        //计算出小时数
 
        var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000))
        //计算相差分钟数
        var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000))
        //计算相差秒数
        var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数

}