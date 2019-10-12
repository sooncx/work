export function getOption(inData, outData, lineData) {
    return {
        backgroundColor: '#151D32',
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [{
                name: '出库',
                icon: 'rect'
            }, {
                name: '入库',
                icon: 'rect'
            }],
            left: '30',
            itemGap: 35,
            itemHeight: 5,
            itemWidth: 20,
            top: 10,
            textStyle: {
                color: '#6877A2'
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
            axisLine: {
                lineStyle: {
                    color: '#B0CCFF',
                    opacity: 0.2,
                    width: 1, //这里是为了突出显示加上的
                }
            },
            data: lineData,
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    // 使用深浅的间隔色
                    color: ['#1B3A72']
                }
            },
            axisLine: {
                lineStyle: {
                    opacity: 0.2,
                    color: '#B0CCFF',
                    width: 1, //这里是为了突出显示加上的
                }
            }
        },
        series: [{
                name: '出库',
                type: 'line',
                stack: '总量',
                data: outData,
                itemStyle: {
                    color: '#821012'
                }
            },
            {
                name: '入库',
                type: 'line',
                stack: '总量',
                data: inData,
                itemStyle: {
                    color: '#1941AA'
                }
            }
        ]
    };

}