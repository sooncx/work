import { Message } from "element-ui";

// 信息提示
// flag 0:成功  -1:失败提示
export function message(flag, msg) {
  if (flag === 0) {
    Message({
      message: msg,
      type: "success"
    });
  } else if (flag === -1) {
    Message({
      message: msg,
      type: "warning"
    });
  }
}
