// import type { HttpContext } from '@adonisjs/core/http'

import { extractBundle } from '../helpers/extractBundle.js'

const SUPER_SECRET_PASSWORD = 'SUPER_SECRET_PASSWORD_YOU_WONT_GUESS_IT'

import { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class DeploysController {
  async index(ctx: HttpContext) {
    const deploySecret = ctx.request.header('deploy-secret')
    const runtimeVersion = ctx.request.header('runtime-version')

    if (deploySecret !== SUPER_SECRET_PASSWORD) {
      return ctx.response.forbidden({
        message: 'Invalid deploy secret',
      })
    }

    const bundlePackage = ctx.request.file('data')

    if (!bundlePackage) {
      return ctx.response.badRequest({
        message: 'No data',
      })
    }
    if (!runtimeVersion) {
      return ctx.response.badRequest({
        message: 'No runtime version',
      })
    }

    await bundlePackage.move(app.makePath('updates'))

    try {
      await extractBundle(runtimeVersion)
    } catch (e) {
      console.log(e)
      return ctx.response.internalServerError({
        message: 'Failed to extract bundle',
      })
    }

    console.log('success')
  }
}
