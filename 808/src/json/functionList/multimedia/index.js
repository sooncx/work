const config = {
  title: '多媒体',
  children: {
    '27': {
      function: 1,
      title: '存储多媒体数据检索',
      routerName: 'FunctionStandard',
      info: {
        goal: '危险货物运输车辆终端必选功能。其他可选。 测试终端是否具有摄像头检索功能。',
        device: '无',
        criterion: '无'
      },
      flows: [{
          describe: '准备（设备上线，设备连接摄像头）'
        },
        {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '摄像头立即拍摄指令',
                params: {
                  type: '1-2-1'
                }
              },
              '，收到终端“摄像头立即拍摄命令应答”后即可通过。'
            ]
          ]
        },
        {
          describe: [
            [
              '拍摄完毕后，平台下发',
              {
                type: 'button',
                title: '存储多媒体数据检索指令',
                params: {
                  type: '1-3-1'
                }
              }, '，收到终端“存储多媒体数据检索应答”后即可通过。'
            ]
          ]
        },
        {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '单条存储多媒体数据检索上传指令',
                params: {
                  type: '1-4-1'
                }
              },
              '后，开始上传多媒体数据，上传完成后点击',
              {

                title: '查看多媒体文件',
                componentName: 'lookPhoto',
                data: {
                  lensId: '1-4-2'
                }
              },
              '，由检测人员确认是否符合测试准则。'
            ]
          ]
        }
      ]
    },
    '28': {
      function: 2,
      title: '终端录像',
      routerName: 'FunctionStandard',
      info: {
        goal: '危险货物运输车辆终端必选功能。其他可选。 测试终端是否具有摄像头录像功能。',
        device: '无',
        criterion: '无'
      },
      flows: [{
          describe: '准备（设备上线，设备连接摄像头）'
        },
        {
          describe: ['终端应至少支持2路摄像头，平台下发摄像头通道1',
            {
              type: 'button',
              title: '立即拍摄指令',
              params: {
                type: '2-2-1'
              }
            },
            '（720P）。'
          ]
        },
        {
          describe: '拍摄完成后，终端应上报“多媒体事件信息上传指令”，平台接收到多媒体数据上传。'
        },
        {
          describe: [
            '待视频上传完成后，点击',
            {

              title: '查看通道1多媒体文件',
              componentName: 'lookVideo',
              data: {
                lensId: '2-4-1'
              }
            },
            '由检测人员确认是否符合测试准则。'
          ]
        }, {
          describe: [
            '平台下发摄像头通道2',
            {
              type: 'button',
              title: '立即拍摄指令',
              params: {
                type: '2-5-1'
              }
            }
          ]
        }, {
          describe: [
            '待视频上传完成后，点击',
            {

              title: '查看通道2多媒体文件',
              componentName: 'lookVideo',
              data: {
                lensId: '2-6-1'
              }
            },
            ',由检测人员确认是否符合测试准则。'
          ]
        }
      ]
    },
    '29': {
      function: 3,
      title: '终端拍照',
      routerName: 'FunctionStandard',
      info: {
        goal: '危险货物运输车辆终端必选功能。其他可选。 测试终端是否具有摄像头拍摄功能。。',
        device: '无',
        criterion: '无'
      },
      flows: [{
          describe: '准备（设备上线，设备连接摄像头）'
        },
        {
          describe: [
            [
              '平台下发',
              {
                type: 'button',
                title: '摄像头立即拍摄指令',
                params: {
                  type: '3-2-1'
                }
              },
              '，收到终端“摄像头立即拍摄命令应答”后即可通过。'
            ]
          ]
        },
        {
          describe: [
            [
              '拍摄完毕后，可在平台点击',
              {

                title: '查看多媒体文件',
                componentName: 'lookPhoto',
                data: {
                  lensId: '3-3-1'
                }
              },
              '，由检测人员确认是否符合测试准则。'
            ]
          ]
        }
      ]
    }
  }
}
config.childrenNum = Object.keys(config.children).length
export default config
