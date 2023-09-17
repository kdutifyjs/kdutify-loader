let kduLoaderPath
try {
  kduLoaderPath = require.resolve('kdu-loader')
} catch (err) {}

function isKduLoader (use) {
  return use.ident === 'kdu-loader-options' ||
    use.loader === 'kdu-loader' ||
    (kduLoaderPath && use.loader === kduLoaderPath)
}

module.exports = {
  isKduLoader,
  getKduRules (compiler) {
    const rules = compiler.options.module.rules

    // Naive approach without RuleSet or RuleSetCompiler
    return rules.map((rule, index) => (
      rule.use && rule.use.find && rule.use.find(isKduLoader)
        ? { rule: { ...rule }, index }
        : null
    )).filter(v => v != null)
  }
}
