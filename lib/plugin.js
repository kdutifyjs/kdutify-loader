const url = require('url')
const path = require('path')
const progressiveLoaderModule = require('../progressive-loader/module')
const { isKduLoader, getKduRules } = require('./getKduRules')

class KdutifyLoaderPlugin {
  constructor (options) {
    this.options = options || {}
  }

  apply (compiler) {
    const kduRules = getKduRules(compiler)

    if (!kduRules.length) {
      throw new Error(
        `[KdutifyLoaderPlugin Error] No matching rule for kdu-loader found.\n` +
        `Make sure there is at least one root-level rule that uses kdu-loader and KdutifyLoaderPlugin is applied after KduLoaderPlugin.`
      )
    }

    kduRules.forEach(this.updateKduRule.bind(this))

    const rules = [...compiler.options.module.rules]
    kduRules.forEach(({ rule, index }) => {
      rules[index] = rule
    })
    compiler.options.module.rules = rules

    if (this.options.progressiveImages) {
      const options = typeof this.options.progressiveImages === 'boolean'
        ? undefined
        : this.options.progressiveImages
      const resourceQuery = options && options.resourceQuery || 'kdutify-preload'

      compiler.hooks.compilation.tap('KdutifyLoaderPlugin', compilation => {
        compilation.hooks.buildModule.tap('KdutifyLoaderPlugin', module => {
          if (!module.resource) return
          const resource = url.parse(module.resource)
          if (
            resource.query === resourceQuery &&
            ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(path.extname(resource.pathname))
          ) {
            if (/^asset\/?/.test(module.type)) {
              compilation.errors.push(new Error(
                'kdutify-loader: progressiveImages does not work with asset modules, use file-loader or url-loader\n' +
                `"${module.rawRequest}" will be loaded normally\n` +
                'See https://webpack.js.org/guides/asset-modules/'
              ))
            } else {
              module.loaders.unshift({
                loader: require.resolve('kdutify-loader/progressive-loader'),
                options
              })
            }
          }
        })
      })
    }
  }

  updateKduRule ({ rule }) {
    if (this.options.progressiveImages) {
      const kduLoaderOptions = rule.use.find(isKduLoader).options
      kduLoaderOptions.compilerOptions = kduLoaderOptions.compilerOptions || {}
      kduLoaderOptions.compilerOptions.modules = kduLoaderOptions.compilerOptions.modules || []
      kduLoaderOptions.compilerOptions.modules.push(progressiveLoaderModule)
    }

    rule.oneOf = [
      {
        resourceQuery: '?',
        use: rule.use
      },
      {
        use: [
          {
            loader: require.resolve('./loader'),
            options: {
              match: this.options.match || [],
              attrsMatch: this.options.attrsMatch || [],
              registerStylesSSR: this.options.registerStylesSSR || false
            }
          },
          ...rule.use
        ]
      },
    ]
    delete rule.use
  }
}

module.exports = KdutifyLoaderPlugin
