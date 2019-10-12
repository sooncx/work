import defaultSettings from '@/settings'

const title = defaultSettings.title || '道路运输车辆卫星定位系统车载终端测试辅助软件'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
