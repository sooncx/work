export default function getOption(flag, params) {//flag 1时为库存数量
    if (flag === 1) {
        return {
            title: {
                text: "库存数量"
            },
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },

            legend: {
                orient: "vertical",
                top: "center",
                x: "left",
                data: [
                    { name: "已出卡", icon: "circle" },
                    { name: "未出卡", icon: "circle" }
                ]
            },
            series: [{
                name: "访问来源",
                type: "pie",
                radius: ["40%", "70%"],
                // avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: "center"
                    }
                    // emphasis: {
                    //     show: true,
                    //     textStyle: {
                    //         fontSize: '30',
                    //         fontWeight: 'bold'
                    //     }
                    // }
                },
                data: [
                    { value: params.outNum, name: "已出卡", itemStyle: { color: "#5992F3" } },
                    { value: params.totalNum - params.outNum, name: "未出卡", itemStyle: { color: "#554BFB" } }
                ]
            }]
        };
    } else {
        return {
            title: {
                text: "SIM卡状态"
            },
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },

            legend: {
                orient: "vertical",
                top: "center",
                x: "left",
                data: [
                    { name: "激活", icon: "circle" },
                    { name: "停用", icon: "circle" },
                    { name: "销卡", icon: "circle" }
                ]
            },
            series: [{
                name: "访问来源",
                type: "pie",
                radius: ["40%", "70%"],
                // avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: "center"
                    }
                    // emphasis: {
                    //     show: true,
                    //     textStyle: {
                    //         fontSize: '30',
                    //         fontWeight: 'bold'
                    //     }
                    // }
                },
                data: [
                    { value: params.activationNum, name: "激活", itemStyle: { color: "#25E5E3" } },
                    { value: params.disableNum, name: "停用", itemStyle: { color: "#FD9C34" } },
                    { value: params.removeNum, name: "销卡", itemStyle: { color: "#95989D" } }
                ]
            }]
        };
    }

}