module.exports = {
  postTransformNode: transform
}

// Modified from @kdujs/component-compiler-utils
function transform(node) {
  const tags = ['k-img', 'k-card-media', 'k-carousel-item']

  if (tags.includes(kebabCase(node.tag)) && node.attrs) {
    const attr = node.attrs.find(a => a.name === 'src')
    if (!attr) return

    const value = attr.value
    // only transform static URLs
    if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
      attr.value = urlToRequire(value.slice(1, -1))
    }
  }

  return node
}

function urlToRequire(url) {
  const firstChar = url.charAt(0)
  if (firstChar === '.' || firstChar === '~' || firstChar === '@') {
    if (firstChar === '~') {
      const secondChar = url.charAt(1)
      url = url.slice(secondChar === '/' ? 2 : 1)
    }
    return `require("${url}?kdutify-preload")`
  } else {
    return `"${url}"`
  }
}

function kebabCase (str) {
  return (str || '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
