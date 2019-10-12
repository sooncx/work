export function getOption(data) {
  return {
    backgroundColor: "#0E1321",
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        return params.name + " : " + params.value[2];
      }
    },
    geo: {
      map: "china",
      zoom: 1.25,
      roam: true,
      itemStyle: {
        normal: {
          areaColor: "#171F3F",
          borderColor: "#111"
        },
        emphasis: {
          areaColor: "#171F3F"
        }
      }
    },
    series: [

      {
        name: "Top 5",
        type: "effectScatter",
        coordinateSystem: "geo",
        data: convertData(
          data
          .sort(function (a, b) {
            return b.value - a.value;
          })
          // .slice(0, 9)
        ),
        symbolSize: function (val) {
          return val[2] / 20;
        },
        showEffectOn: "render",
        rippleEffect: {
          brushType: "stroke"
        },
        hoverAnimation: true,
        // label: {
        //   normal: {
        //     formatter: "{b}",
        //     position: "right",
        //     show: true
        //   }
        // },
        itemStyle: {
          normal: {
            color: "#D2336B",
            shadowBlur: 10,
            shadowColor: "#333"
          }
        },
        zlevel: 1
      }
    ]
  };
}