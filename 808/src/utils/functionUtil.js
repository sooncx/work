// 功能检测界面和日志详情公用方法
const showRemarkLen = 700; // 不查看详情的情况下最多能显示的remark数量
export const stateCodes = {
  success: 1, // 测试通过
  process: 0, // 测试中
  error: 2, // 测试不通过
  undetected: 3 // 未测试
};
export function getStateTxt({ state }) {
  // 获取当前检测状态
  switch (Number(state)) {
    case stateCodes.process:
      return "检测中";
    case stateCodes.success:
      return "检测通过";
    case stateCodes.error:
      return "检测不通过 ";
    case stateCodes.undetected:
      return "未检测";
    default:
      return "未检测";
  }
}
export function ramarkRnToBr(str) {
  // 日志log /r/n转成换行符<br>
  if (typeof str !== "string") return str;
  return str.replace(/↵/g, "<br/>").replace(/\r\n/g, "<br/>");
}

export function handlerItemLogData(rowData) {
  // 处理日志单条数据 包括webSocket 日志详情列表
  
  rowData.remark = ramarkRnToBr(rowData.remark || "");
  if (rowData.remark.length > showRemarkLen) {
    // 优化接受remark太长单条数据5M以上的渲染dom卡顿问题
    rowData.allRemark = rowData.remark + "...";
    rowData.remark = rowData.remark.substring(0, showRemarkLen);
  }
  if (rowData.externData && typeof rowData.externData === "string") {
    rowData.externData = JSON.parse(rowData.externData);

    switch (Number(rowData.externData.code)) {
      case 0: // 图片
        rowData.hasPhoto = true;
        break;
      // case 1: 音频
      case 2: // 视频
        rowData.hasVideo = true;
        break;
      case 3: // 导出
        rowData.hanExcel = true;
        break;
    }
  }
  return rowData;
}
