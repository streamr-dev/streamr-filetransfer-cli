/* eslint-disable unicorn/numeric-separators-style */
import {Args, Command, Flags, ux} from '@oclif/core'
import {StreamrClient} from 'streamr-client'
import * as fs from 'node:fs'
import path from 'node:path'
import {calculateFileMD5, arrayBufferToBase64, generateUniqueId, waitAWhile} from '../../utils/utils'
import createContinuousReadStream from '../../utils/create-continuous-read-stream.cjs'

const WAIT_TIME_BETWEEN_CHUNKS = 40
const KILOBYTES_PER_SLICE = 300 // 560
const WEBRTC_MAX_MESSAGE_SIZE = 1048576 // 1 Megabyte

export default class Send extends Command {
    static description = 'Streamr file transfer send command.'

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async sendToStream(streamrCli: any, stream: string, msg: any): Promise<void> {
      await streamrCli.publish(stream, msg)
    }

    static examples = [
      '$ streamr-filetransfer-cli send <FILE_PATH> -k<0xPRIVATEKEY> -s<STREAM_ID>',
    ]

    static flags = {
      privatekey: Flags.string({char: 'k', description: 'Private key', required: true}),
      stream: Flags.string({char: 's', description: 'Stream ID', required: true}),
      bytesPerSlice: Flags.integer({char: 'b', description: 'Chunk size in KB', required: false}),
      wait: Flags.integer({char: 'w', description: 'Wait time between sending chunks in milliseconds', required: false}),
      continuous: Flags.boolean({char: 'c', description: 'Continuous reading of the file', required: false, default: false}),
    }

    static args = {
      filepath: Args.string({description: 'Filepath', required: true}),
    }

    async run(): Promise<void> {
      const deviceId = generateUniqueId()
      const messageId = generateUniqueId()
      const {args, flags} = await this.parse(Send)
      this.log(`filepath: ${args.filepath} privatekey: ${flags.privatekey} stream: ${flags.stream} wait: ${flags.wait} continuous ${flags.continuous}`)

      const streamrCli = new StreamrClient({
        auth: {
          privateKey: flags.privatekey,
        },
        network: {
          webrtcMaxMessageSize: WEBRTC_MAX_MESSAGE_SIZE,
          webrtcSendBufferMaxMessageCount: 1000,
        },
      })

      const simpleBar = ux.progress({
        format: 'Upload | {bar} | {percentage}% || {value}/{total} || {speed} || {time}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      })
      interface FileStats {
        started: number
      }
      const bytesPerSlice = flags.bytesPerSlice ? 1024 * flags.bytesPerSlice : 1024 * KILOBYTES_PER_SLICE
      let waitTimeBetweenChunks = WAIT_TIME_BETWEEN_CHUNKS
      const fileStats: FileStats = {
        started: 0,
      }

      const fileName = path.basename(args.filepath)
      const md5 = await calculateFileMD5(args.filepath)
      console.log('\nmd5 hash: ' + md5 + '\n')
      const readStream = flags.continuous ? createContinuousReadStream.createReadStream(args.filepath, {tail: true}) : fs.createReadStream(args.filepath, {highWaterMark: bytesPerSlice})
      const fileSizeStats = await fs.promises.stat(args.filepath)
      let chunkCounter = -1 // used as 'array' index
      const totalSlices = Math.ceil(fileSizeStats.size / (bytesPerSlice))
      console.log('# of slices ' + totalSlices)
      readStream.on('data', async chunk => {
        chunkCounter += 1
        const base64Slice = arrayBufferToBase64(chunk)
        const payload = JSON.parse(JSON.stringify(base64Slice))
        const msg = {
          b: [
            deviceId, payload, messageId, chunkCounter, totalSlices - 1, fileSizeStats.size, messageId + '_' + fileName, md5,
          ],
        }
        try {
          readStream.pause()
          if (chunkCounter === 0) {
            const totSlices = flags.continuous ? -1 : totalSlices
            simpleBar.start(totSlices, 0, {
              speed: 'N/A',
              time: '0',
            })
            fileStats.started = Date.now()
          } else {
            const timeLapsed = (Date.now() - fileStats.started) / 1000
            const avgSpeed = Math.ceil(((chunkCounter + 1) * KILOBYTES_PER_SLICE / ((Date.now() - fileStats.started) / 1000)))
            simpleBar.update(chunkCounter + 1, {
              speed: avgSpeed + ' KB/s',
              time: timeLapsed + ' s',
            })
          }

          waitTimeBetweenChunks = flags.wait ? flags.wait : WAIT_TIME_BETWEEN_CHUNKS

          await streamrCli.publish(flags.stream, msg)
          await waitAWhile(waitTimeBetweenChunks)
          // if everything is send we can exit
          if (flags.continuous === false && chunkCounter === (totalSlices - 1)) {
            await waitAWhile(600)
            // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
            process.exit()
          }
        } catch (error) {
          console.log(error)
          this.exit(1)
        } finally {
          readStream.resume()
        }
      })
      readStream.on('change', () => {
        console.log('filesize has changed')
      })

      readStream.on('error', error => {
        console.error('Something went wrong', error)
      })
      readStream.on('end', () => {
        simpleBar.stop()
        console.log('file read')
        console.log('upload_complete')
      })
    }
}
