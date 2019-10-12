// 递归转换树结构
// 源数据, 最上级ID,名称,父ID名称,创建子级名称

export function handleTree(data, root, idTxt, pidTxt, pushTxt) {
  var idTxt = idTxt || "id";
  var pidTxt = pidTxt || "pid";
  var pushTxt = pushTxt || "children";
  // 递归方法

  function getNode(id) {
    var node = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i][pidTxt] == id) {
        data[i][pushTxt] = getNode(data[i][idTxt]);
        node.push(data[i]);
      }
    }
    if (node.length == 0) {
      return;
    } else {
      return node;
    }
  }
  // 使用根节点
  return getNode(root);
}

// 转换年月日  不可复用
export function toTreeData(data) {
  let result = [];
  let resultKeys = {};
  data.map(item => {
    let yearKey = item.groupName.substring(0, 4);
    let monthKey = item.groupName.substring(4, 6);
    let daykey = item.groupName.substring(6, 8);

    if (!resultKeys[yearKey + monthKey]) {
      result.push({
        id: monthKey,
        pid: -1,
        name: yearKey + "-" + monthKey
      });
      resultKeys[yearKey + monthKey] = true;
      result.push({
        id: daykey+1,
        groupId: item.groupName,
        pid: monthKey,
        outnum: item.outNum,
        innum: item.totalNum,
        kucun: item.totalNum - item.outNum,
        params: `${yearKey}-${monthKey}-${daykey}`,
        name:
          monthKey +
          "-" +
          daykey +
          ` (${item.totalNum - item.outNum}/${item.totalNum})`
      });
    } else {
      result.push({
        id: daykey+1,
        groupId: item.groupName,
        pid: monthKey,
        outnum: item.outNum,
        innum: item.totalNum,
        kucun: item.totalNum - item.outNum,
        params: `${yearKey}-${monthKey}-${daykey}`,
        name:
          monthKey +
          "-" +
          daykey +
          ` (${item.totalNum - item.outNum}/${item.totalNum})`
      });
    }

  });

  return handleTree(result,-1);
}
