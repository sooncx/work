export function getOption(data) {

  //  转化数据
  let fomatData = data.map(item => {
    return {
      value: item.value,
      name: `${item.name} (${item.value})`,
      icon: "circle",
      itemStyle: {
        color: item.color
      }
    }
  })
  console.log(fomatData)
  return {
    // tooltip: {
    //   trigger: "item",
    //   formatter: "{a} <br/>{b}: {c} ({d}%)"
    // },
    legend: {
      orient: "vertical",
      right: 50,
      top: 50,
      bottom: 50,
      textStyle: {
        color: "#B0CCFF"
      },
      data: fomatData
    },
    series: [{
      center: ["35%", "45%"],
      name: "车辆状态统计",
      type: "pie",
      radius: ["60%", "70%"],
      avoidLabelOverlap: true,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '12',
          }
        }
      },
      data: fomatData
    }]
  };

}