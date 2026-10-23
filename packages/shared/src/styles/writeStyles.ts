import { writeFile } from 'fs/promises'
import * as findCacheDir from 'find-cache-dir'
import { normalizePath } from '../index'

export const cacheDir = findCacheDir({
  name: 'kdutify',
  create: true,
  thunk: true
})!

export function writeStyles (files: Set<string>) {
  return writeFile(
    cacheDir('styles.scss'),
    [
      'kdutify/lib/styles/main.sass',
      'kdutify/dist/_component-variables.sass',
      ...[...files.values()].sort()
    ].map(v => `@forward '${normalizePath(v)}';`).join('\n'),
    'utf8'
  )
}
