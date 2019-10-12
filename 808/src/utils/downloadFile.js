export default function(url) { // 下载文件
  console.log(url, '下载文件')
  try {
    var elemIF = document.createElement('iframe')
    elemIF.src = url
    elemIF.style.display = 'none'
    document.body.appendChild(elemIF)
  } catch (e) {

  }
}
