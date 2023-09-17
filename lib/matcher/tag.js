const { components, styles } = require('./generator')

module.exports = function match (_, { kebabTag, camelTag: tag }) {
  if (!kebabTag.startsWith('k-')) return

  if (components.has(tag)) {
    return [tag, `import { ${tag} } from 'kdutify/lib/components/${components.get(tag)}';`, styles.get(tag)]
  }
}
