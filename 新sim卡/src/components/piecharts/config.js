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
      x: "center",
      // y: "bottom",
      bottom: "0",
      textStyle: {
        color: "#B0CCFF"
      },
      data: fomatData
    },
    series: [{
      center: ["50%", "33%"],
      name: "SIM卡",
      type: "pie",
      radius: ["50%", "60%"],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false
        }
      },
      data: fomatData
    }]
  };

}