import { LoaderDefinitionFunction } from 'webpack'
import { generateImports } from '@kdutify/loader-shared'

export default (function KdutifyLoader (content, sourceMap) {
  if (this.data?.skip) {
    return content
  }

  this.async()
  this.cacheable()

  const { code: imports, source } = generateImports(content)

  this.callback(null, source + imports, sourceMap)
} as LoaderDefinitionFunction)

export const pitch = (function KdutifyLoaderPitch (remainingRequest, precedingRequest, data) {
  if (this.loaders.some(loader => loader.path.endsWith('kdu-loader/dist/pitcher.js'))) {
    data!.skip = true
  }
} as LoaderDefinitionFunction)
