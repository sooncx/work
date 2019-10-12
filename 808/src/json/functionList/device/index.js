const config = {
  title: '设备操作',
  children: {
    11: { // 人机交互
      function: 10,
      title: '人机交互',
      routerName: 'FunctionStandard',
      info: {
        goal: '终端应具有人机交互功能，与驾驶员进行信息交互。',
        device: '无',
        criterion: '终端应能通过语音报读设备与显示设备，可结合信号灯或蜂鸣器等设备向驾驶员提供信息，驾驶员能通过按键或触摸屏或遥控器等方式操作终端。'
      },
      flows: [{
          describe: '准备（终端上线）'
        },
        {
          describe: '确认终端处于正常工作状态。'
        },
        {
          describe: '终端应具有人机交互功能，终端应能通过语音报读设备与显示设备，可结合信号灯或蜂鸣器等设备向驾驶员提供信息，驾驶员能通过按键或触摸屏或遥控等方式操作终端。'
        }
      ]
    },
    // 12: { // 终端管理
    //   function: 12,
    //   title: '终端管理',
    //   routerName: 'FunctionStandard',
    //   info: {
    //     goal: '无',
    //     device: '',
    //     criterion: ''
    //   },
    //   flows: [
    //     {
    //       describe: '准备（终端上线）'
    //     },
    //     {
    //       describe: '固件更新和固件参数修改功能本地（SD卡、USB或者其他数字接口）方式实现。'
    //     },
    //     {
    //       describe: '终端支持通过USB口或串口对终端禁行设置和输出。'
    //     }
    //   ]
    // },
    12: { // 使用前锁定
      function: 11,
      title: '使用前锁定',
      routerName: 'FunctionStandard',
      info: {
        goal: '终端应能通过语音报读设备与显示设备，可结合信号灯或蜂鸣器等设备向驾驶员提供信息，驾驶员能通过按键或触摸屏或遥控器等方式操作终端。',
        device: '无',
        criterion: '在终端未录入终端ID、SIM卡号等车辆基本信息时，终端应处于锁定状态。用户初次使用时应输入车辆基本信息并向监控中心注册后方可正式启用终端。'
      },
      flows: [{
          describe: '准备（终端上线）'
        },
        {
          describe: '使用前锁定一：人工检查设备是否处于锁定状态, 且终端主监控中心的域名应设置为“xxxxxxx”,备份监控中心的域名应设置为 “xxxxxxx”。'
        },
        {
          describe: '使用前锁定二：货运车辆终端的显示设备应不小于5英寸，并支持触摸输入方式，可采用外接或内置的形式。通过显示屏完成终端的注册，检测人员收到终端注册成功的短信提醒。'
        }
      ]
    },
    13: { // 终端管理
      function: 12,
      title: '终端管理',
      routerName: 'FunctionStandard',
      info: {
        goal: '终端应支持无线网络远程方式实现监控中心对终端的操作。',
        device: '无',
        criterion: '可操作注册和注销功能、固件更新功能、固件参数的修改和查询功能、终端的复位或恢复出厂设置功能。'
      },
      flows: [{
          describe: '准备（终端上线）'
        },
        {
          describe: '终端初始支持本地直接修改接入参数，对终端接入地址远程配置时，由终端本地确认后生效。'
        },
        {
          describe: '终端支持加密或数字身份认证的无线网络远程方式实现终端在监控中心注册和注销功能、固件更新功能、固件参数的修改和查询功能、终端的复位或回复出厂设置功能。'
        },
        {
          describe: '固件更新、参数修改过程中遇到的掉电等意外情况时，支持自动恢复功能，保证更新失败时终端能够正常使用。'
        },
        {
          describe: '固件更新和固件参数修改功能本地（SD卡、USB或者其他数字接口）方式实现'
        },
        {
          describe: '终端支持通过USB口或串口对终端进行设置和输出。'
        }
      ]
    },
    14: { // 自检
      function: 13,
      title: '自检',
      routerName: 'FunctionStandard',
      info: {
        goal: '终端应具备自检功能。',
        device: '无',
        criterion: '通过信号灯或显示屏明确表示车载终端当前主要状态。若出现故障，则通过信号灯或显示屏显示方式指示故障类型等信息，存储并上传至监控中心。'
      },
      flows: [{
          describe: '准备（终端上线）'
        },
        {
          describe: '确认终端处于正常工作状态。'
        },
        {
          describe: '检测人员拔出卫星定位模块天线，设备上报“GNSS天线断开或被剪断报警”。'
        },
        {
          describe: '终端出现故障时，应通过信号灯或显示屏方式指示故障类型等信息。'
        }
      ]
    },

    15: { // 终端存储及安全
      function: 30,
      title: '终端存储及安全',
      routerName: 'FunctionStandard',
      info: {
        goal: '检测终端存储容量及存储安全性能。',
        device: '无',
        criterion: '以先进先出的方式至少存储2000张图像或48小时视频数据。被标记的图像或视频数据不会被覆盖。'
      },
      flows: [{
          describe: '准备（终端上线，通道1连接至少720P的摄像头）'
        },
        {
          describe: [
            '要求数据存储器容量不低于8GB，不限定数据存储器形式，可采用内置存储芯片、外接数据存储卡等形式。请输入存储器的大小：',
            {
              componentName: 'setMemorySize',
              data: {
                placeholder: '请输入数字',
                append: 'G'
              },
              type: '30-2-1'
            }
          ]
        },
        {
          describe: ['图像存储:a)平台下发', {
            type: 'button',
            title: '摄像头立即拍摄命令',
            params: {
              type: '30-3-1'
            }
          }, '，通道1拍10张照片，实时上传平台。b)平台', {
            componentName: 'externButton',
            type: '30-3-1',
            title: '计算'
          }, '出存储器可存储的照片张数。']
        },
        {
          describe: ['录像存储:a)平台下发', {
            type: 'button',
            title: '摄像头立即拍摄命令',
            params: {
              type: '30-4-1'
            }
          }, '，通道1拍摄视频，实时上传平台。 b)平台', {
            componentName: 'externButton',
            type: '30-4-1',
            title: '计算'
          }, '出存储器可存储视频数据大小。']
        },
        {
          describe: '操作人员清空终端的存储器容量。由检测人员通过外接的显示屏或终端主机屏，确认存储器已被清空。'
        },
        {
          describe: ['平台下发', {
            type: 'button',
            title: '终端参数设置',
            params: {
              type: '30-6-1'
            }
          }, '，终端存储图像数据应以先进先出方式，支持对图像标记，该类图像不应被覆盖。平台将以“紧急报警”图像作为标记图像数据。']
        },
        {
          describe: ['触发紧急报警2秒以上，终端上报“紧急报警”，并立即触发摄像头拍摄。平台下发', {
            type: 'button',
            title: '存储多媒体数据检索',
            params: {
              type: '30-7-1'
            }
          }, '指令，检索完成后，终端上报“存储多媒体数据检索应答”，平台下发', {
            type: 'button',
            params: {
              type: '30-7-2'
            },
            title: '单条存储多媒体数据检索上传命令'
          }, '，点击', {

            title: '查看图像',
            componentName: 'lookPhoto',
            data: {
              lensId: '30-7-1'
            }
          }, '并显示多媒体ID。']
        },
        {
          describe: ['终端开始录像，平台下发', {
            type: 'button',
            title: '摄像头立即拍摄命令',
            params: {
              type: '30-8-1'
            }
          }, '，将存储器容量录满后，由检测人员通过外接的显示器或终端主机屏，确认存储器容量已占满，点击', {
            type: 'button',
            params: {
              type: '30-8-2'
            },
            title: '停止录像'
          }]
        },
        {
          describe: [
            '在满存储容量情况下，再拍10张照片，平台下发', {
              type: 'button',
              title: '摄像头立即拍摄命令',
              params: {
                type: '30-9-1'
              }
            }, '被标记的图像数据不应被覆盖，平台下发', {
              type: 'button',
              title: '存储多媒体数据检索',
              params: {
                type: '30-9-2'
              }
            }, '指令，检索完成后，终端上报“存储多媒体数据检索应答”，平台下发', {
              type: 'button',
              title: '单条存储多媒体数据检索上传命令',
              params: {
                type: '30-9-3'
              }
            }, '，点击', {
              title: '查看图像',
              componentName: 'lookPhoto',
              data: {
                lensId: '30-9-1'
              }
            }, '并显示多媒体ID。'
          ]
        }
      ]
    },
    16: { // 多中心接入
      function: 20,
      title: '多中心接入',
      routerName: 'FunctionStandard',
      info: {
        goal: '要求设置多中心参数后，主、从服务器同时连接，之后由主监控中心主动断开连接，由车载终端重连3次不成功后，自动连接备份监控中心。',
        device: '无',
        criterion: '无'
      },
      flows: [{
          describe: '准备'
        },
        {
          describe: '检测人员操作终端进行：注销、注册、鉴权。通过检测平台查看终端是否操作成功。'
        },
        {
          describe: [
            [
              '终端应可以同时连接主、从服务器，并在主服务器断开时有接入备份服务的功能，平台下发',
              {
                type: 'button',
                title: '设置终端参数指令',
                params: {
                  type: '20-3-1'
                }
              }
            ]
          ]
        },
        {
          describe: '终端同时连接主服务器和从服务器，检测平台查看从服务器是否收到终端上报的注册、鉴权信息。'
        },
        {
          describe: ['由从服务器', {
            type: 'button',
            title: '文本信息下发',
            params: {
              type: '20-5-1'
            }
          }, '，设备获取文本信息后，终端TTS播读该信息。']
        },
        {
          describe: [
            [
              '平台下发',
              {
                componentName: 'externButton',
                title: '链路检测',
                type: '20-6-1'
              },
              '指令，由系统自动判断，是否同时连接主、从服务器。'
            ]
          ]
        },
        {
          describe: [
            [
              '清空从服务器地址，下发',
              {
                type: 'button',
                title: '设置终端参数指令',
                params: {
                  type: '20-7-1'
                }
              },
              '，查看是否断开从服务器连接，平台下发',
              {
                componentName: 'externButton',
                title: '链路检测',
                type: '20-7-2'
              },
              '指令，设备只保留主服务器地址，并确保正常交互消息。'
            ]
          ]
        },
        {
          describe: [
            [
              '检测平台断开终端连接',
              {
                componentName: 'externButton',
                title: '断开连接',
                type: '20-8-1'
              },
              '“一次鉴权” “二次鉴权”“三次鉴权” “鉴权通过“'
            ]
          ]
        },
        {
          describe: '查看终端是否接入备份服务器。'
        }
      ]
    },
    17: { // 电话回拨
      function: 22,
      title: '电话回拨',
      routerName: 'FunctionStandard',
      info: {
        goal: '可选功能。测试终端是否具有电话回拨及监听功能。',
        device: '无',
        criterion: '送检终端能够正确识别检测平台下发的电话回拨命令，成功回拨电话号码，并跟检测人员进行通话。'
      },
      flows: [{
          describe: '准备（终端上线）'
        },
        {
          describe: [
            '终端上线后，检测平台下发指令',
            {
              type: 'button',
              title: '电话回拨',
              params: {
                type: '22-2-1'
              }
            },
            '电话回拨属性（标志=普通通话）'
          ]
        },
        {
          describe: [
            [
              '终端上线后，检测平台下发指令',
              {
                type: 'button',
                title: '电话回拨',
                params: {
                  type: '22-3-1'
                }
              },
              '电话回拨属性（标志=监听）'
            ]
          ]
        },
        {
          describe: [
            [
              '电话本相关功能检测：',
              {
                type: 'button',
                title: '设置电话本_更新电话本',
                params: {
                  type: '22-4-1'
                }
              }, {
                type: 'button',
                title: '设置电话本_追加电话本',
                params: {
                  type: '22-4-2'
                }
              }, {
                type: 'button',
                title: '设置电话本_修改电话本',
                params: {
                  type: '22-4-3'
                }
              }, {
                type: 'button',
                title: '设置电话本_删除电话本',
                params: {
                  type: '22-4-4'
                }
              }
            ]
          ]
        }
      ]
    },
    18: { // 远程升级
      function: 25,
      title: '远程升级',
      routerName: 'FunctionStandard',
      info: {
        goal: '必选项，终端应具备远程升级功能。',
        device: '无',
        criterion: '测试前厂商提供可靠的升级包，由检测机构上传到检测服务器。测试过程中厂商人员不得接触终端，终端能自动完成升级。'
      },
      flows: [{
          describe: '准备（终端上线）'
        },
        {
          describe: ['上传升级包，',
            // {
            //   type: 'input',
            //   title: '设置定位模块参数指令',
            //   placeholder: '请输入升级包名字'
            // },
            {
              componentName: 'uploadPatchFile'
            }
          ]
        }, {
          describe: ['下发',
            {
              type: 'button',
              title: '查询终端属性指令',
              params: {
                type: '25-3-1'
              }
            },
            '查看终端上报固件版本与终端属性是否符合录入系统信息。'
          ]
        }, {
          describe: ['平台下发',
            {
              type: 'button',
              title: '下载固件',
              params: {
                type: '25-4-1'
              }
            },
            '指令，终端开始接收升级固件。'
          ]
        }, {
          describe: ['升级包下载完成后，终端重启重新上线后，自动汇报升级结果，若升级成功，则下发',
            {
              type: 'button',
              title: '查询终端属性指令',
              params: {
                type: '25-5-1'
              }
            },
            '判断固件版本是否升级成功。'
          ]
        }
      ]
    },

  }
}
config.childrenNum = Object.keys(config.children).length
export default config
