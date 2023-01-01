# kdutify-loader

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

```js
{
  size: number // The minimum dimensions of the preview images, defaults to 9px
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
        'kdutify-loader/src/progressive-loader',
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
