
export default {
  TOKEN: null, // sid
  LOGINKOKEN: 'c2e607f7-523b-4a3c-953c-697c7cfb7c0d',
  CarData: null, // 监控中心点击车辆的数据
  vehData: null, // 搜索出来的车辆数据
  treeData: null,
  outPutFlag: 2, // 退出登录标记
  keepAliveConfig: ['home', 'MonitorCenter','dataRoport'],
  AlarmDetailData: {},
  GetCountOfNoread:null,
  GongDanList:null,

  name: "",
  carOwner: "",
  phone: "",
  installTime: "",
  createTime: "",
  status: "",
  carPicture: "",
  address: "",
  remark: "",
  deviceVos: "",
  newGongDanLoading: "",
  GD_data:null,
  onlineList:null,
  
  versionObj:{},  // 版本号信息
  Bubble:{},
  clickOne:true,
  UserCount:{},
  userConfig: {
    userId: 'bycl',
    name: 'bycl',
    isBack: true
  },
  isCreateBubble: true, //  Bubble 开关
  isShowBubble: false, // Bubble 显示隐藏
  OletTreeData: false, // 第一次进入获取树形
  isplay: true, //轨迹页面播放暂停
  appKeepAliveConfig: [
    'editUser',
    'playback',
    'inquire',
    'alarmOperating',
    'photo',
    'record',
    'vehDetail',
    'vehicleDetail',
    'dataDetail',
    // 'index',
    'homeDetail',
    'reportInfo',
    'login',
    'fence',
    'setting',
    'Gps',
    'wuxianhuichuan',
    'chaseCar',
    'msgPush',
    'agreement',
    'dataCard',
    'dataMap',
    'orderReport'
  ],
}
