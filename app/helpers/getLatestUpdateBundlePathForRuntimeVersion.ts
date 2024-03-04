import * as fs from 'node:fs'
import path from 'node:path'

export const getLatestUpdateBundlePathForRuntimeVersion = async (runtimeVersion: string) => {
  const updatesDirectoryForRuntimeVersion = `./updates/${runtimeVersion}`

  if (!fs.existsSync(updatesDirectoryForRuntimeVersion)) {
    throw new Error('Unsupported runtime version')
  }

  const filesInUpdatesDirectory = await fs.promises.readdir(updatesDirectoryForRuntimeVersion)
  const directoriesInUpdatesDirectory = (
    await Promise.all(
      filesInUpdatesDirectory.map(async (file) => {
        const fileStat = await fs.promises.stat(path.join(updatesDirectoryForRuntimeVersion, file))
        return fileStat.isDirectory() ? file : null
      })
    )
  )
    // eslint-disable-next-line unicorn/no-await-expression-member
    .filter(truthy)
    .sort((a, b) => Number.parseInt(b, 10) - Number.parseInt(a, 10))

  return path.join(updatesDirectoryForRuntimeVersion, directoriesInUpdatesDirectory[0])
}

export function truthy<TValue>(value: TValue | null | undefined): value is TValue {
  return !!value
}
