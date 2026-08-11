const components = require('./generator')

module.exports = function match (_, { kebabTag, camelTag: tag }) {
  if (!kebabTag.startsWith('k-')) return

  if (components.includes(tag)) return [tag, `import { ${tag} } from 'kdutify/lib'`]
}
