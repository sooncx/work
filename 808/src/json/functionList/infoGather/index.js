const config = {
  title: '信息采集',
  children: {
    19: { // CAN总线
      function: 14,
      title: 'CAN总线',
      routerName: 'FunctionStandard',
      info: {
        goal: '测试终端是否支持通过CAN总线采集车辆参数信息。',
        device: '通信转换模块',
        criterion: '要求终端能够上传两路所提供的真实CAN总线数据，平台自动判断上传数据是否与提供数据一致。'
      },
      flows: [{
          describe: '准备（终端上线，设备接入CAN通讯转换模块）'
        },
        {
          describe: ['平台下发', {
            type: 'button',
            title: '终端参数设置指令',
            params: {
              type: '14-2-1'
            }
          }]
        },
        {
          describe: '通过检测平台查看终端上报的CAN总线数据。'
        }, {
          describe: [
            '待终端采集、上报完成，查看', {
              componentName: 'doLookLogBtn',
              type: '14-4-1'
            },
            ',',
            {
              componentName: 'exportBtn',
              type: '14-4-2'
            }
          ]
        }
      ]
    },
    20: { // 车辆载货状态
      function: 15,
      title: '车辆载货状态',
      routerName: 'FunctionStandard',
      info: {
        goal: '危险品车辆和货运车辆终端必选功能。其他可选。 测试终端是否留有车辆载货状态检测装置接口或者通过人工输入方式确定车辆的载货状态(空载、半载、满载)',
        device: '导航卫星信号模拟器',
        criterion: '通过检测平台查看系统日志，是否输出“空载、半载、满载”状态'
      },
      flows: [{
          describe: '准备（终端上线）'
        },
        {
          describe: '检查被测终端是否具有输入车辆载货状态功能。'
        },
        {
          describe: '3.终端依次上报“空载”、“半载”、“满载”，检测平台查看输入是否成功。'
        }
      ]
    },
    // e_AWB: {
    //   function: '电子运单',
    //   title: '电子运单',
    //   routerName: 'FunctionStandard',
    //   info: {
    //     goal: '危险品车辆和货运车辆终端必选功能。其他可选。 测试终端是否留有车辆载货状态检测装置接口或者通过人工输入方式确定车辆的载货状态(空载、半载、满载)',
    //     device: '导航卫星信号模拟器',
    //     criterion: '通过检测平台查看系统日志，是否输出“空载、半载、满载”状态'
    //   },
    //   flows: [
    //     {
    //       describe: '准备（终端上线）'
    //     },
    //     {
    //       describe: ['平台下发', {
    //         type: 'button',
    //         title: '电子运单信息',
    //         params: { type: '16-2-1' }
    //       }]
    //     },
    //     {
    //       describe: [
    //         '设备上报收到的电子运单信息，平台',
    //         {
    //           type: 'button',
    //           title: '核实电子运单信息'
    //         },
    //         '是否正确。'
    //       ]
    //     }
    //   ]
    // },
    21: { // 驾驶员身份识别，电子运单
      function: 17,
      title: '驾驶员身份识别，电子运单',
      routerName: 'FunctionStandard',
      info: {
        goal: '测试终端是否具有驾驶员身份识别功能及支持电子运单信息的采集与显示，并上传至监控中心。',
        device: '无',
        criterion: 'IC卡插入时能正常上报驾驶员上班信息，拔卡时正常上报驾驶员下班信息。电子运单应符合JT/T 617.5的要求。'
      },
      flows: [{
          describe: '准备（检测人员向厂商发放IC卡从业资格证，终端连接刷卡器，终端上线）'
        },
        {
          describe: ['平台下发IC卡认证中心相关', {
            type: 'button',
            title: '终端参数设置',
            params: {
              type: '17-2-1'
            }
          }, '指令']
        },
        {
          describe: '测试人员插入IC卡从业资格证（上班），平台采集信息后检查驾驶员身份信息是否正确。'
        },
        {
          describe: ['平台下发', {
            type: 'button',
            title: '请求上报驾驶员信息指令',
            params: {
              type: '17-4-1'
            }
          }, '，平台采集信息后检测驾驶员身份信息是否正确。']
        }, {
          describe: '测试人员拔出从业资格IC卡，终端上报驾驶员拔卡信息（下班）。'
        }, {
          describe: '测试人员换一张IC卡从业资格证，插入更换后的IC卡从业资格证（上班），平台采集信息后检查驾驶员身份信息是否正确。'
        }, {
          describe: ['平台下发', {
            type: 'button',
            title: '请求上报驾驶员信息指令',
            params: {
              type: '17-4-1'
            }
          }, '，平台采集信息后检测驾驶员身份信息是否正确。']
        }, {
          describe: '测试人员拔出从业资格IC卡，终端上报驾驶员拔卡信息（下班）。'
        },
        // {
        //   describe: ['平台下发', {
        //     type: 'button',
        //     title: '电子运单信息',
        //     params: { type: '16-2-1' }
        //   }]
        // },
        {
          describe: ['设备上报收到的电子运单信息，平台', {
            componentName: 'externButton',
            type: '17-9-1',
            title: '核实电子运单信息'
          }, '是否正确。']
        }
      ]
    },
    22: { // 终端控制与信号采集
      function: 18,
      title: '终端控制与信号采集',
      routerName: 'FunctionStandard',
      info: {
        goal: '平台可远程控制终端，终端支持至少5个开关量和至少2个模拟量。',
        device: '导航卫星信号模拟器、任意波形发生器、直流电源',
        criterion: '平台可远程控制车门的加锁解锁，终端至少具备5个开关量和至少2个模拟量。'
      },
      flows: [{
          describe: '准备（终端上线，检查接口数量是否足够）'
        },
        {
          describe: ['平台通过下发指令，应可以控制终端门锁状态，平台下发',
            {
              type: 'button',
              title: '车门加锁',
              params: {
                type: '18-2-1'
              }
            },
            '指令，终端应在获取命令后，关闭车门上报“车门加锁”状态，平台下发',
            {
              type: 'button',
              title: '车门开启',
              params: {
                type: '18-2-2'
              }
            },
            '指令，终端应在获取命令后，开启车门上报“车门解锁”状态。'
          ]
        },
        {
          describe: '通过导航卫星信号模拟器及脉冲发生器，产生5个开关量和2个模拟量（AD0/AD1），终端监测并上传采集到的数据。'
        }, {
          describe: '改变2个模拟量数值，再次采集并上传。'
        }
      ]
    },
    23: { // 收费结算数据
      function: 28,
      title: '收费结算数据',
      routerName: 'FunctionStandard',
      info: {
        goal: '终端支持收费结算设备，具有收费结算功能。',
        device: '无',
        criterion: '数据采集装置接口，支持采集收费结算信息，并上传至监控中心。'
      },
      flows: [{
          describe: '准备（终端上线，终端连接收费结算外设）'
        },
        {
          describe: '终端可具有收费结算数据采集装置接口，支持采集收费结算信息，并上传至平台。'
        }, {
          describe: '检测人员根据测试准则判断测试是否通过。'
        }
      ]
    },
    24: { // ETC功能
      function: 29,
      title: 'ETC功能',
      routerName: 'FunctionStandard',
      info: {
        goal: '无',
        device: '无',
        criterion: '无'
      },
      flows: [{
          describe: '准备（终端上线，终端连接ETC设备）'
        },
        {
          describe: '终端可与车辆不停车电子收费系统通信，车辆通过ETC通道时接受并上传ETC信息'
        }, {
          describe: '检测人员根据测试准则判断测试是否通过。'
        }
      ]
    },
    25: { // 行驶记录
      function: 21,
      title: '行驶记录',
      routerName: 'FunctionStandard',
      info: {
        goal: '必选功能。终端应具有GB/T 19056所要求的汽车行驶记录功能。',
        device: '无',
        criterion: '人工判定。要求能上传真实完整的行驶记录数据，平台能正确解析各数据块，并判断是否符合GB/T 19056-2012标准的要求。'
      },
      flows: [{
          describe: '准备（终端上线）'
        }, {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '00H-07H命令字',
                params: {
                  type: '21-2-1'
                }
              },
              '终端需上行00H-07H命令字数据,平台能够正确解析。'
            ]
          ]
        }, {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '08H命令字',
                params: {
                  type: '21-3-1'
                }
              },
              '终端需上行08H命令字数据,平台能够正确解析。在上传完成后点击', {
                componentName: 'exportBtn',
                type: '21-3-1',
                title: '上传完成',
                url: 'api/export/excel.json'
              }, '后导出数据导出08H命令字。'
            ]
          ]
        }, {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '09H命令字',
                params: {
                  type: '21-4-1'
                }
              },
              '终端需上行09H命令字数据,平台能够正确解析。在上传完成后点击', {
                componentName: 'exportBtn',
                type: '21-4-1',
                title: '上传完成',
                url: 'api/export/excel.json'
              }, '后导出数据导出09H命令字。'
            ]
          ]
        }, {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '10H命令字',
                params: {
                  type: '21-5-1'
                }
              },
              '终端需上行10H命令字数据,平台能够正确解析。在上传完成后点击', {
                componentName: 'exportBtn',
                type: '21-5-1',
                title: '上传完成',
                url: 'api/export/excel.json'
              }, '后导出数据导出10H命令字。'
            ]
          ]
        }, {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '11H命令字',
                params: {
                  type: '21-6-1'
                }
              },
              '终端需上行11H命令字数据,平台能够正确解析。在上传完成后点击', {
                componentName: 'exportBtn',
                type: '21-6-1',
                title: '上传完成',
                url: 'api/export/excel.json'
              }, '后导出数据导出11H命令字。'
            ]
          ]
        },
        {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '12H命令字',
                params: {
                  type: '21-7-1'
                }
              },
              '终端需上行12H命令字数据,平台能够正确解析。在上传完成后点击', {
                componentName: 'exportBtn',
                type: '21-7-1',
                title: '上传完成',
                url: 'api/export/excel.json'
              }, '后导出数据导出12H命令字。'
            ]
          ]
        }, {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '13H命令字',
                params: {
                  type: '21-8-1'
                }
              },
              '终端需上行13H命令字数据,平台能够正确解析。在上传完成后点击', {
                componentName: 'exportBtn',
                type: '21-8-1',
                title: '上传完成',
                url: 'api/export/excel.json'
              }, '后导出数据导出13H命令字。'
            ]
          ]
        }, {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '14H命令字',
                params: {
                  type: '21-9-1'
                }
              },
              '终端需上行14H命令字数据,平台能够正确解析。在上传完成后点击', {
                componentName: 'exportBtn',
                type: '21-9-1',
                title: '上传完成',
                url: 'api/export/excel.json'
              }, '后导出数据导出14H命令字。'
            ]
          ]
        }, {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '15H命令字',
                params: {
                  type: '21-10-1'
                }
              },
              '终端需上行15H命令字数据,平台能够正确解析。在上传完成后点击', {
                componentName: 'exportBtn',
                type: '21-10-1',
                title: '上传完成',
                url: 'api/export/excel.json'
              }, '后导出数据导出15H命令字。'
            ]
          ]
        }
      ]
    },
    26: { // 终端休眠  26
      function: 26,
      title: '终端休眠',
      routerName: 'FunctionStandard',
      info: {
        goal: '必选项，终端应具备远程功能。',
        device: '无',
        criterion: '无'
      },
      flows: [{
          describe: '准备（终端上线）'
        },
        {
          describe: ['关闭除无线通信模块外其他不必要设备，卫星定位模块在需要上传时自动唤醒。平台下发',
            {
              type: 'button',
              title: '设置休眠参数',
              params: {
                type: '26-2-1'
              }
            },
            '（休眠汇报位置间隔0x0027）'
          ]
        }, {
          describe: '关闭ACC时终端进入休眠状态'
        }, {
          describe: '休眠期间，数据上传频率应按照初始化设置的休眠参数“自动持续降低数据上传频率”，关闭ACC 5分钟后终端向平台发送一次定位信息，之后间隔10分钟后再发送一次。终端在休眠期间应以不超过30s的时间间隔向平台发送心跳连接，确保链路不断。'
        }
      ]
    },
  }
}
config.childrenNum = Object.keys(config.children).length
export default config
