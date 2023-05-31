import crypto from 'node:crypto'
import * as fs from 'node:fs'

export function calculateFileMD5(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5')
    const stream = fs.createReadStream(filePath)
    stream.on('data', data => hash.update(data))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', error => reject(error))
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function arrayBufferToBase64(buffer: any): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary)
}

export function generateUniqueId(): string {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8)
}

export function waitAWhile(time: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export function appendToFile(filePath: string, data: Uint8Array): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.appendFile(filePath, data, error => {
      if (error) {
        console.log('retrying to save')
        appendToFile(filePath, data)
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function base64ToUint8Array(base64: any): Uint8Array {
  const binaryString = atob(base64.b[1])
  const length = binaryString.length
  const uint8Array = new Uint8Array(length)

  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i)
  }

  return uint8Array
}
