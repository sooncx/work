export function getOption() {
    return {
        backgroundColor:'#151D32',
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[{name:'出库',icon:'rect'},{name:'入库',icon:'rect'}],
            left:'30',
            itemGap:35,
            itemHeight:5,
            itemWidth:20,
            top:10,
            textStyle:{
                color:'#6877A2'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine:{
                                    lineStyle:{
                                        color:'#B0CCFF',
                                        opacity:0.2,
                                        width:1,//这里是为了突出显示加上的
                                    }
                                },
            data: [{value:'周8',textStyle:{color:'#B0CCFF'}}
            ,
            {value:'周一',textStyle:{color:'#B0CCFF'}}
            ,{value:'周2',textStyle:{color:'#B0CCFF'}},
            {value:'周3',textStyle:{color:'#B0CCFF'}},
            {value:'周4',textStyle:{color:'#B0CCFF'}},
            {value:'周5',textStyle:{color:'#B0CCFF'}},
            {value:'周6',textStyle:{color:'#B0CCFF'}},]
        },
        yAxis: {
                            type : 'value',
                                splitLine: {
                                    lineStyle: {
                                        // 使用深浅的间隔色
                                        color: ['#1B3A72']
                                    }
                                },
                                axisLine:{
                                    lineStyle:{
                                        opacity:0.2,
                                        color:'#B0CCFF',
                                        width:1,//这里是为了突出显示加上的
                                    }
                                }
        },
        series: [
            {
                name:'出库',
                type:'line',
                stack: '总量',
                data:[120, 132, 101, 134, 90, 230, 210],
            itemStyle:{
                    color:'#821012'
                }
            },
            {
                name:'入库',
                type:'line',
                stack: '总量',
                data:[220, 182, 191, 234, 290, 330, 310],
                  itemStyle:{
                    color:'#1941AA'
                }
            }
        ]
    };
    
}