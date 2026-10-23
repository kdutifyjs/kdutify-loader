# webpack-plugin-kdutify

## Automatic Imports
`webpack-plugin-kdutify` will automatically import all Kdutify components as you use them

```js
// webpack.config.js
const { KdutifyPlugin } = require('webpack-plugin-kdutify')

module.exports = {
  plugins: [
    new KdutifyPlugin({ autoImport: true }), // Enabled by default
  ],
}
```
```js
// plugins/kdutify.js
import 'kdutify/styles'
import { createKdutify } from 'kdutify'

export default createKdutify()
```

```html
<template>
  <k-card>
    ...
  </k-card>
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
  <k-card>
    ...
  </k-card>
</template>

<script>
  import { KCard } from 'kdutify/components'

  export default {
    components: {
      KCard,
    },
    ...
  }
</script>
```

## Style loading
### Customising variables
```js
// webpack.config.js
const { KdutifyPlugin } = require('webpack-plugin-kdutify')

module.exports = {
  plugins: [
    new KdutifyPlugin({ styles: { configFile: 'src/settings.scss' } }),
  ],
}
```
```js
// plugins/kdutify.js
import 'kdutify/styles'
import { createKdutify } from 'kdutify'

export default createKdutify()
```
```scss
// settings.scss
@forward 'kdutify/settings' with (
  $color-pack: false,
  $utilities: false,
);
```

`settings.scss` can be used in your own components to access kdutify's variables. 

### Customising variables (old method)
```js
// webpack.config.js
const { KdutifyPlugin } = require('webpack-plugin-kdutify')

module.exports = {
  plugins: [
    new KdutifyPlugin({ styles: 'expose' }),
  ],
}
```
```js
// plugins/kdutify.js
import './main.scss'
import { createKdutify } from 'kdutify'

export default createKdutify()
```
```scss
// main.scss
@use 'kdutify' with (
  $color-pack: false,
  $utilities: false,
);
```

### Remove all style imports
```js
// webpack.config.js
const { KdutifyPlugin } = require('webpack-plugin-kdutify')

module.exports = {
  plugins: [
    new KdutifyPlugin({ styles: 'none' }),
  ],
}
```
```js
// plugins/kdutify.js
import { createKdutify } from 'kdutify'

export default createKdutify()
```

### Import sass from source
Kdutify 3 uses precompiled css by default, these imports can optionally be modified to point to sass files instead:

```js
// webpack.config.js
const { KdutifyPlugin } = require('webpack-plugin-kdutify')

module.exports = {
  plugins: [
    new KdutifyPlugin({ styles: 'sass' }),
  ],
}
```

## Progressive images
Coming soon...
