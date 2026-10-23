# lahm-plugin-kdutify

## Automatic imports
```js
// lahm.config.js
plugins: [
  kdu(),
  kdutify({ autoImport: true }), // Enabled by default
]
```
```js
// plugins/kdutify.js
import 'kdutify/styles'
import { createKdutify } from 'kdutify'

export default createKdutify()
```

## Style loading
### Customising variables
```js
// lahm.config.js
plugins: [
  kdu(),
  kdutify({ styles: { configFile: 'src/settings.scss' } }),
]
```
```js
// plugins/kdutify.js
import 'kdutify/styles'
import { createKdutify } from 'kdutify'

export default createKdutify()
```
```scss
// settings.scss
@use 'kdutify/settings' with (
  $color-pack: false,
  $utilities: false,
);
```

`settings.scss` can be used in your own components to access kdutify's variables.

### Customising variables (old method)
```js
// lahm.config.js
plugins: [
  kdu(),
  kdutify({ styles: 'expose' }),
]
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
// lahm.config.js
plugins: [
  kdu(),
  kdutify({ styles: 'none' }),
]
```
```js
// plugins/kdutify.js
import { createKdutify } from 'kdutify'

export default createKdutify()
```

### Import sass from source
Kdutify 3 uses precompiled css by default, these imports can optionally be modified to point to sass files instead:

```js
// lahm.config.js
plugins: [
  kdu(),
  kdutify({ styles: 'sass' }),
]
```

## Image loading

```js
// lahm.config.js
import kdutify, { transformAssetUrls } from 'lahm-plugin-kdutify'

export default {
  plugins: [
    kdu({ 
      template: { transformAssetUrls }
    }),
    kdutify(),
  ],
}
```
