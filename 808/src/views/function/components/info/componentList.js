// import store from '@/store'
const componentFiles = require.context('./components/', true, /.vue$/)
const component = componentFiles.keys().reduce((component, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = componentFiles(modulePath)
  component[moduleName] = value.default
  return component
}, {})
export default component
