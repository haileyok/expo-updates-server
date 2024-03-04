import * as fs from 'node:fs'
import path from 'node:path'
import * as tar from 'tar'

const UPDATES_PATH = './updates'
const BUNDLE_PATH = path.join(UPDATES_PATH, 'bundle.tar.gz')

export const extractBundle = async (runtimeVersion: string) => {
  if (!fs.existsSync(BUNDLE_PATH)) {
    throw new Error('bundle.tar.gz does not exist')
  }

  const directoryName = Math.round(Date.now() / 1000).toString()
  const directoryPath = path.join(UPDATES_PATH, runtimeVersion, directoryName)
  const newFilePath = path.join(directoryPath, 'bundle.tar.gz')
  fs.mkdirSync(directoryPath, { recursive: true })
  fs.renameSync(BUNDLE_PATH, newFilePath)

  await tar.x({
    file: newFilePath,
    cwd: directoryPath,
  })

  fs.rmSync(newFilePath)
}
