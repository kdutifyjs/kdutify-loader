import * as path from 'upath'

export interface Options {
  autoImport?: importPluginOptions,
  styles?: true | 'none' | 'expose' | 'sass' | {
    configFile: string,
  },
  /** @internal Only for testing */
  stylesTimeout?: number
}

export type importPluginOptions =
  | boolean
  // | ((source: string, importer: string, isKdutify: boolean) => boolean | null | replace)
// type replace = { symbol: string, from: string, as?: string }

export { generateImports } from './imports/generateImports'
export { cacheDir, writeStyles } from './styles/writeStyles'

export function resolveKdutifyBase () {
  return path.dirname(require.resolve('kdutify/package.json', { paths: [process.cwd()] }))
}

export function isObject (value: any): value is object {
  return value !== null && typeof value === 'object'
}

export function includes (arr: any[], val: any) {
  return arr.includes(val)
}

// Add leading slash to absolute paths on windows
export function normalizePath (p: string) {
  p = path.normalize(p)
  return /^[a-z]:\//i.test(p) ? '/' + p : p
}

export function toKebabCase (str = '') {
  return str
    .replace(/[^a-z]/gi, '-')
    .replace(/\B([A-Z])/g, '-$1')
    .toLowerCase()
}

const defaultTags = {
  video: ['src', 'poster'],
  source: ['src'],
  img: ['src'],
  image: ['xlink:href', 'href'],
  use: ['xlink:href', 'href'],
}
export const transformAssetUrls = {
  KAppBar: ['image'],
  KAvatar: ['image'],
  KBanner: ['avatar'],
  KCard: ['image'],
  KCardItem: ['prependAvatar', 'appendAvatar'],
  KChip: ['prependAvatar', 'appendAvatar'],
  KImg: ['src', 'lazySrc', 'srcset'],
  KListItem: ['prependAvatar', 'appendAvatar'],
  KNavigationDrawer: ['image'],
  KParallax: ['src', 'lazySrc', 'srcset'],
  KToolbar: ['image'],
} as Record<string, string[]>

for (const [tag, attrs] of Object.entries(transformAssetUrls)) {
  attrs.forEach(attr => {
    if (/[A-Z]/.test(attr)) {
      attrs.push(toKebabCase(attr))
    }
  })
  transformAssetUrls[toKebabCase(tag)] = attrs
}
Object.assign(transformAssetUrls, defaultTags)
