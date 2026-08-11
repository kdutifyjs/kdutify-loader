# kdutify-loader

## Automatic Imports
`kdutify-loader` will automatically import all Kdutify components as you use them

```js
// webpack.config.js

const KdutifyLoaderPlugin = require('kdutify-loader/lib/plugin')

exports.plugins.push(
  new KdutifyLoaderPlugin()
)
```

You can also provide a custom match function to import your own project's components too:
```js
// webpack.config.js

const KdutifyLoaderPlugin = require('kdutify-loader/lib/plugin')

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

**NOTE:** You ***must*** have [ImageMagick](https://www.imagemagick.org/script/index.php) installed for this to work

Just some small modifications to your webpack rules:
```js
const { KdutifyProgressiveModule } = require('kdutify-loader')


  {
    test: /\.kdu$/,
    loader: 'kdu-loader',
    options: {
      compilerOptions: {
        modules: [KdutifyProgressiveModule]
      }
    }
  },
  {
    test: /\.(png|jpe?g|gif)$/,
    resourceQuery: /kdutify-preload/,
    use: [
      'kdutify-loader/progressive-loader',
      {
        loader: 'url-loader',
        options: { limit: 8000 }
      }
    ]
  }
```

And away you go!
```html
<k-img src="@/assets/some-image.jpg"></k-img>
```

### Loops and dynamic paths

`KdutifyProgressiveModule` only works on static paths, for use in a loop you have to `require` the image yourself:

```html
<k-img k-for="i in 10" :src="require(`@/images/image-${i}.jpg?kdutify-preload`)" :key="i">
```

### Lazy-loading specific images

If you only want some images to have placeholders, add `?lazy` to the end of the request:
```html
<k-img src="@/assets/some-image.jpg?lazy"></k-img>
```

And modify the regex to match:
```js
resourceQuery: /lazy\?kdutify-preload/
```

### Configuration

```ts
{
  size: number // The minimum dimensions of the preview images, defaults to 9px
  sharp: boolean // Use sharp instead of GM for environments without ImageMagick. This will result in lower-quality images
  graphicsMagick: boolean // Use GraphicsMagic instead of ImageMagick
  // TODO
  // limit: number // Source images smaller than this value (in bytes) will not be transformed
}
```

### Combining with another url-loader rule

Use `Rule.oneOf` to prevent corrupt output when there are multiple overlapping rules:

```js
{
  test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)(\?.*)?$/,
  oneOf: [
    {
      test: /\.(png|jpe?g|gif)$/,
      resourceQuery: /kdutify-preload/,
      use: [
        'kdutify-loader/progressive-loader',
        {
          loader: 'url-loader',
          options: { limit: 8000 }
        }
      ]
    },
    {
      loader: 'url-loader',
      options: { limit: 8000 }
    }
  ]
}
```
