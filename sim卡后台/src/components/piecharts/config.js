export function getOption() {
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
    series: [
      {
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
          { value: 335, name: "已出卡", itemStyle: { color: "#5992F3" } },
          { value: 310, name: "未出卡", itemStyle: { color: "#554BFB" } }
        ]
      }
    ]
  };
}
