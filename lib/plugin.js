const RuleSet = require('webpack/lib/RuleSet')

class KdutifyLoaderPlugin {
  constructor (options) {
    this.options = options
  }

  apply (compiler) {
    // use webpack's RuleSet utility to normalize user rules
    const rawRules = compiler.options.module.rules
    const { rules } = new RuleSet(rawRules)

    // find the rule that applies to kdu files
    let kduRuleIndex = rules.findIndex(rule => rule.use && rule.use.find(u => u.loader === 'kdu-loader'))
    const kduRule = rules[kduRuleIndex]

    if (!kduRule) {
      throw new Error(
        `[KdutifyLoaderPlugin Error] No matching rule for kdu-loader found.\n` +
        `Make sure there is at least one root-level rule that uses kdu-loader.`
      )
    }

    kduRule.use.unshift({
      loader: require.resolve('./loader'),
      options: this.options
    })

    compiler.options.module.rules = rules
  }
}

module.exports = KdutifyLoaderPlugin
