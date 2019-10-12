export default {
  TOKEN: null, // sid
  LOGINUSER: null, //登录用户
  simList: [], //流量套餐
  userList:[],    // 客户列表
  statusOptions: [
    {
      value: "",
      label: "全部状态"
    },
    {
      value: 0,
      label: "待处理"
    },
    {
      value: 1,
      label: "已出库"
    },
    {
      value: 2,
      label: "驳回"
    },
    {
      value: 3,
      label: "删除"
    },
    {
      value: 4,
      label: "处理中"
    }
  ],
  simStateOptions: [
    {
      value: 0,
      label: "全部状态"
    },
    {
      value: 1,
      label: "正常"
    },
    {
      value: 2,
      label: "过期"
    },
    {
      value: 3,
      label: "销卡"
    },
  ]
}