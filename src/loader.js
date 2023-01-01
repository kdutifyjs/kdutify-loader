const loaderUtils = require('loader-utils')
const kdutifySrc = require('path').join('kdutify', 'src')

module.exports = function loader (source) {
  const options = loaderUtils.getOptions(this)
  if (options.theme && this.resourcePath.endsWith('.styl')) {
    if (this.resourcePath.includes(kdutifySrc) || options.globalImport) {
      source = `@import '${options.theme}'\n${source}`
    }
  }

  return source
}
