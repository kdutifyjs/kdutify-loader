# kdutify-loader

## Automatic Imports
`kdutify-loader` will automatically import all Kdutify components as you use them

```js
// webpack.config.js

const { KdutifyLoaderPlugin } = require('kdutify-loader')

exports.plugins.push(
  new KdutifyLoaderPlugin()
)
```

You can also provide a custom match function to import your own project's components too:
```js
// webpack.config.js

const { KdutifyLoaderPlugin } = require('kdutify-loader')

exports.plugins.push(
  new KdutifyLoaderPlugin({
    /**
     * This function will be called for every tag used in each kdu component
     * It should return an array, the first element will be inserted into the
     * components array, the second should be a corresponding import
     *
     * originalTag - the tag as it was originally used in the template
     * kebabTag    - the tag normalised to kebab-case
     * camelTag    - the tag normalised to PascalCase
     * path        - a relative path to the current .kdu file
     * component   - a parsed representation of the current component
     */
    match (originalTag, { kebabTag, camelTag, path, component }) {
      if (kebabTag.startsWith('core-')) {
        return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.kdu'`]
      }
    }
  })
)
```

or if you're using Kdu CLI:
```js
// kdu.config.js

module.exports = {
  chainWebpack: config => {
    config.plugin('KdutifyLoaderPlugin').tap(args => [{
      match (originalTag, { kebabTag, camelTag, path, component }) {
        if (kebabTag.startsWith('core-')) {
          return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.kdu'`]
        }
      }
    }])
  }
}
```

```html
<template>
  <core-form>
    <k-card>
      ...
    </k-card>
  </core-form>
</template>

<script>
  export default {
    ...
  }
</script>
```

Will be compiled into:

```html
<template>
  <core-form>
    <k-card>
      ...
    </k-card>
  </core-form>
</template>

<script>
  import { KCard } from 'kdutify/lib'
  import CoreForm from '@/components/core/Form.kdu'

  export default {
    components: {
      KCard,
      CoreForm
    },
    ...
  }
</script>
```

## Progressive images

`kdutify-loader` can automatically generate low-res placeholders for the `k-img` component

**NOTE:** You ***must*** have [ImageMagick](https://www.imagemagick.org/script/index.php), [GraphicsMagick](http://www.graphicsmagick.org/), or [sharp](https://github.com/lovell/sharp) installed for this to work

Add `progressiveImages` to the plugin options:
```js
exports.plugins.push(
  new KdutifyLoaderPlugin({
    progressiveImages: true
  })
)

// kdu-cli
module.exports = {
  chainWebpack: config => {
    config.plugin('KdutifyLoaderPlugin').tap(args => [{
      progressiveImages: true
    }])
  }
}
```

And away you go!
```html
<k-img src="@/assets/some-image.jpg"></k-img>
```

**NOTE:** The src must follow [kdu-loader's transform rules](https://kdujs-loader.web.app/guide/asset-url.html#transform-rules)

### Loops and dynamic paths

`progressiveImages` only works on static paths, for use in a loop you have to `require` the image yourself:

```html
<k-img k-for="i in 10" :src="require(`@/images/image-${i}.jpg?kdutify-preload`)" :key="i">
```

### Configuration

`progressiveImages: true` can be replaced with an object for advanced configuration

```js
new KdutifyLoaderPlugin({
  progressiveImages: {
    size: 12, // Use higher-resolution previews
    sharp: true // Use sharp instead of ImageMagick
  }
})
```

#### Options

##### `size`

Type: `Number`
Default: `9`

The minimum dimensions of the generated preview images in pixels

##### `resourceQuery`

Type: `RegExp`
Default: `/kdutify-preload/`

Override the resource qury to match k-img URLs

If you only want some images to have placeholders, add `?lazy` to the end of the request:
```html
<k-img src="@/assets/some-image.jpg?lazy"></k-img>
```

And modify the regex to match:
```js
new KdutifyLoaderPlugin({
  progressiveImages: {
    resourceQuery: /lazy\?kdutify-preload/
  }
})
```

##### `sharp`

Type: `Boolean`
Default: `false`

Use sharp instead of GM for environments without ImageMagick. This will result in lower-quality images

##### `graphicsMagick`

Type: `Boolean`
Default: `false`

Use GraphicsMagic instead of ImageMagick

##### `registerStylesSSR`

Type: `Boolean`
Default: `false`

Register Kdutify styles in `kdu-style-loader`.

This fixes styles not being loaded when doing SSR (for example when using `@dtwojs/kdutify`).
As Kdutify imports styles with JS, without this option, they do not get picked up by SSR.

⚠️ This option requires having `manualInject` set to `true` in `kdu-style-loader` config.
