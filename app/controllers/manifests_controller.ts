// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import { getLatestUpdateBundlePathForRuntimeVersion } from '../helpers/getLatestUpdateBundlePathForRuntimeVersion.js'

export default class ManifestsController {
  async index(ctx: HttpContext) {
    const protocolVersion = ctx.request.header('expo-protocol-version')
    const platform = ctx.request.header('expo-platform')
    const runtimeVersion = ctx.request.header('expo-runtime-version')
    const expectSignature = ctx.request.header('expo-expect-signature')

    if (protocolVersion !== '1') {
      return ctx.response.internalServerError({
        message: 'Invalid expo-protocol-version',
      })
    }

    if (platform !== 'ios' && platform !== 'android') {
      return ctx.response.internalServerError({
        message: 'Invalid expo-platform',
      })
    }

    if (!runtimeVersion) {
      // TODO check the runtime version against the available versions
      return ctx.response.internalServerError({
        message: 'No runtime version',
      })
    }

    if (!expectSignature) {
      return ctx.response.internalServerError({
        message: 'No expect signature',
      })
    }

    let updateBundlePath: string
    try {
      updateBundlePath = await getLatestUpdateBundlePathForRuntimeVersion(runtimeVersion)
    } catch (e) {
      return ctx.response.notFound({
        message: 'No update found',
      })
    }

    console.log(updateBundlePath)

    ctx.response.header('expo-protocol-version', '1')
    ctx.response.header('expo-sfv-version', '0')

    return ctx.response.ok({
      id: '100',
      createdAt: new Date().toISOString(),
      runtimeVersion: '1.71',
      launchAsset: '',
      assets: ['', '', ''],
    })
  }
}
