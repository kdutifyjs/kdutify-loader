import { extname } from 'path'
import { Plugin } from 'lahm'
import { generateImports } from '@kdutify/loader-shared'
import { parse as parseUrl, URLSearchParams } from 'url'

function parseId (id: string) {
  const { query, pathname } = parseUrl(id)

  return {
    query: query ? Object.fromEntries(new URLSearchParams(query)) : null,
    path: pathname ?? id
  }
}

export function importPlugin (): Plugin {
  return {
    name: 'kdutify:import',
    configResolved (config) {
      if (config.plugins.findIndex(plugin => plugin.name === 'kdutify:import') < config.plugins.findIndex(plugin => plugin.name === 'lahm:kdu')) {
        throw new Error('Kdutify plugin must be loaded after the kdu plugin')
      }
    },
    async transform (code, id) {
      const { query, path } = parseId(id)

      if (
        ((!query || !('kdu' in query)) && extname(path) === '.kdu' && !/^import { render as _sfc_render } from ".*"$/m.test(code)) ||
        (query && 'kdu' in query && (query.type === 'template' || (query.type === 'script' && query.setup === 'true')))
      ) {
        const { code: imports, source } = generateImports(code)
        return {
          code: source + imports,
          map: null,
        }
      }

      return null
    }
  }
}
