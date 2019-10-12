const CITYS = {
  海门: [121.15, 31.89],
  丽水: [119.92, 28.45],
  洛阳: [112.44, 34.7],
  秦皇岛: [119.57, 39.95],
  株洲: [113.16, 27.83],
  石家庄: [114.48, 38.03],
  大庆: [125.03, 46.58],
  广东:[100.03, 32.58],

};
var convertData = function(data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = CITYS[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value)
      });
    }
  }
  return res;
};
export function getOption(data) {
  return {
    backgroundColor: "#0E1321",
    tooltip: {
      trigger: "item",
      formatter: function(params) {
        return params.name + " : " + params.value[2];
      }
    },
    geo: {
      map: "china",
      zoom:1.25,
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
            .sort(function(a, b) {
              return b.value - a.value;
            })
            // .slice(0, 9)
        ),
        symbolSize: function(val) {
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
