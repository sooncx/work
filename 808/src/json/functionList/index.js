/*
测试功能列表
    function 当前功能id，当前默认为当前标题 和请求api的时候需要
    title: String   //功能标题 必填
    info: {
      goal:  String   //目的, 必填
      device: String   //设备,必填
      criterion:String   //准则, 必填
    },
    flows:[] //检测流程， 必填 最少一项
*/

import multimedia from './multimedia'
import alarm from './alarm'
import device from './device'
import infoGather from './infoGather'
import {
  handlerCountStep
} from './handlerBeforeLeave'
const count_420 = 420
const count_10000 = 10000
export default {
  alarm,
  device,
  infoGather,
  multimedia,
  '1': { // 定位
    title: '定位',
    childrenNum: 2,
    children: {
      1: {
        function: 19,
        title: '定位精度',
        routerName: 'FunctionStandard',
        info: {
          goal: '必选功能。测试终端的定位性能。如终端具有2个以上卫星定位模块，则应分别测试其所有的卫星定位模块的定位精度。',
          device: '导航卫星信号模拟器',
          criterion: '北斗兼容终端三种定位模式的水平定位精度结果都不大于15米，高程精度不大于30米，速度精度不大于2m/s；GPS终端只需测试GPS定位模式。'
        },
        flows: [{
            describe: '准备（终端上线）'
          },
          {
            describe: ['设置单北斗“单DB2“模式：',
              {
                type: 'button',
                title: '设置定位模块参数指令',
                params: {
                  type: '19-2-1'
                }
              },
              ' 参数为切换定位模块至单北斗模式。'
            ]
          },
          {
            title: '设置单北斗“单DB2“模式：',
            beforeLeave: handlerCountStep,
            count: count_420,
            describe: [
              [
                '待模拟器场景启动十分钟后，', {
                  type: 'button',
                  title: '设置终端参数0x0029=1S',
                  params: {
                    type: '19-3-1'
                  }
                }, ' 将终端0200间隔调为1秒1条；'
              ],
              [{
                  componentName: 'externButton',
                  type: '19-3-1',
                  title: '开始计数'
                },
                {

                  componentName: 'dispalyCount',
                  title: '0',
                  count: count_420
                },
                '计' + count_420 + '条'
              ],
              [{
                  type: 'button',
                  title: '设置终端参数0x0029=30S',
                  params: {
                    type: '19-3-2'
                  }
                },
                '恢复终端0200间隔为30秒1条'
              ],
              [{
                  componentName: 'externButton',
                  type: '19-3-3',
                  title: '查看定位精度'
                },
                '根据“准则“内要求，确认该项测试是否通过。'
              ]
            ]
          },
          {
            describe: ['设置单GPS“单GPS“模式：',
              {
                type: 'button',
                title: '设置定位模块参数指令',
                params: {
                  type: '19-4-1'
                }
              },
              ',参数为切换定位模块至单GPS模式。'
            ]
          },
          {
            title: '设置单GPS“单GPS“模式：',
            beforeLeave: handlerCountStep,
            count: count_420,
            describe: [
              [
                '待模拟器场景启动十分钟后，', {
                  type: 'button',
                  title: '设置终端参数0x0029=1S',
                  params: {
                    type: '19-5-1'
                  }
                }, ' 将终端0200间隔调为1秒1条；'
              ],
              [{
                  componentName: 'externButton',
                  type: '19-5-1',
                  title: '开始计数'
                },
                {

                  componentName: 'dispalyCount',
                  title: '0',
                  count: count_420
                },
                '计' + count_420 + '条'
              ],
              [{
                  type: 'button',
                  title: '设置终端参数0x0029=30S',
                  params: {
                    type: '19-5-2'
                  }
                },
                '恢复终端0200间隔为30秒1条'
              ],
              [{
                  componentName: 'externButton',
                  type: '19-5-3',
                  title: '查看定位精度'
                },
                '根据“准则“内要求，确认该项测试是否通过。'
              ]
            ]
          },
          {
            describe: [
              '设置BD2/GPS模式“双模模式“', {
                type: 'button',
                title: '设置定位模块参数指令',
                params: {
                  type: '19-6-1'
                }
              }, ' 参数为切换定位模块至BD2/GPS模式。'
            ]
          },
          {
            title: 'BD2/GPS模式测试方法',
            beforeLeave: handlerCountStep,
            count: count_420,
            describe: [
              [
                '待模拟器场景启动十分钟后，', {
                  type: 'button',
                  title: '设置终端参数0x0029=1S',
                  params: {
                    type: '19-7-1'
                  }
                }, ' 将终端0200间隔调为1秒1条；'
              ],
              [{
                  componentName: 'externButton',
                  type: '19-7-1',
                  title: '开始计数'
                },
                {
                  componentName: 'dispalyCount',
                  title: '0',
                  count: count_420
                },
                '计' + count_420 + '条'
              ],
              [{
                  type: 'button',
                  title: '设置终端参数',
                  params: {
                    type: '19-7-2'
                  }
                },
                '恢复终端0200间隔为30秒1条'
              ],
              [{
                  componentName: 'externButton',
                  type: '19-7-3',
                  title: '查看定位精度'
                },
                '根据“准则“内要求，确认该项测试是否通过。'
              ]
            ]
          }
        ]
      },
      '2': { // 位置信息
        function: 24,
        title: '位置信息',
        routerName: 'FunctionStandard',
        info: {
          goal: '无',
          device: '无',
          criterion: '无'
        },
        flows: [{
            describe: '准备（设备上线）'
          },
          {
            describe: ['终端应具备定时上报和定距上报功能，平台下发',
              {
                type: 'button',
                title: '最小定距报送距离',
                params: {
                  type: '24-2-1'
                }
              },
              '指令，平台下发',
              {
                type: 'button',
                title: '清除定矩报送指令',
                params: {
                  type: '24-2-2'
                }
              }
            ]
          },
          {
            describe: ['平台下发',
              {
                type: 'button',
                title: '最大定距报送距离',
                params: {
                  type: '24-3-1'
                }
              },
              '指令，平台下发',
              {
                type: 'button',
                title: '清除定矩报送指令',
                params: {
                  type: '24-3-2'
                }
              }
            ]
          },
          {
            describe: ['临时位置跟踪控制功能 ，',
              {
                type: 'button',
                title: '启动临时位置跟踪',
                params: {
                  type: '24-4-1'
                }
              },
              '。查看终端是否按照设定上报临时位置信息。'
            ]
          },
          {
            describe: ['平台下发 ，',
              {
                type: 'button',
                title: '位置信息查询',
                params: {
                  type: '24-5-1'
                }
              },
              '，终端应立即上报位置信息查询应答。'
            ]
          }
        ]
      },
    }
  },
  '3': { // 盲区补传
    function: 23,
    title: '盲区补传',
    routerName: 'FunctionStandard',
    info: {
      goal: '功能必选。自动关闭通信功能必选。测试终端是否支持盲区补报及自动关闭通信功能。',
      device: '导航卫星信号模拟器',
      criterion: '如果补报数据大于等于' + count_10000 + '条，且数据正确，则通过，否则不通过。此功能开始检测至过程结束，终端厂商不得以任何方式或形式接触被检终端，检测过程中被检终端必须自动关闭通信、自动上线、自动完成补传。对于违规接触被检终端的检测机构直接判定为该功能不通过'
    },
    flows: [{
      describe: '准备（终端上线）'
    }, {
      describe: ['终端上线定位后，平台下发关闭定位模块的矩形电子围栏',
        {
          type: 'button',
          title: '下发矩形区域设置指令',
          params: {
            type: '23-2-1'
          }
        },
        ' 。通过检测平台查看是否收到终端通用应答。'
      ]
    }, {
      describe: ['启动场景约10分钟后，平台下发',
        {
          type: 'button',
          title: '设置终端参数指令（0x0029=1S）',
          params: {
            type: '23-3-1'
          }
        },
        ' ,通过检测平台查看是否收到终端通用应答。'
      ]
    }, {
      describe: '信号发生器发送相应的经纬度信号，使终端进入指定区域，查看终端是否关闭通信。（进区域后终端不能上报任何消息）'
    }, {
      describe: '信号发生器发送相应的经纬度信号，使终端离开指定的区域。'
    }, {
      describe: ['待终端上线后，平台下发',
        {
          type: 'button',
          title: '设置终端参数指令（0x0029=30S）',
          params: {
            type: '23-6-1'
          }
        },
        ' ,下发', {
          type: 'button',
          title: '删除矩形区域指令',
          params: {
            type: '23-6-2'
          }
        }
      ]
    }, {
      beforeLeave: handlerCountStep,
      count: count_10000,
      describe: ['等待盲区定位数据补传完毕，在测试平台查看补报的定位数据，查看是否有' + count_10000 + '条， 补报定位数共计',
        {
          componentName: 'dispalyCount',
          title: '0',
          count: count_10000
        }, '条 ，计数完成或不再计数请点击', {
          componentName: 'externButton',
          type: '23-7-1',
          title: '补报完成'
        },
        {
          componentName: 'exportBtn',
          type: '23-7-2'
        }
      ]
    }]
  },
}
