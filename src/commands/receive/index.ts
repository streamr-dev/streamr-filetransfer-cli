/* eslint-disable unicorn/numeric-separators-style */
import {Args, Command, Flags, ux} from '@oclif/core'
import {StreamrClient} from 'streamr-client'
import {calculateFileMD5, appendToFile, base64ToUint8Array, waitAWhile} from '../../utils/utils'

const WAIT_TIME_BETWEEN_CHUNKS = 0

export default class Receive extends Command {
    static description = 'Streamr file transfer receive command. To exit receive mode use CTRL+C (win/mac) or Command+C (osx).'

    static examples = [
      '$ streamr-filetransfer-cli receive -p<FOLDER> -k<0xPRIVATEKEY> -s<STREAM_ID>',
    ]

    static flags = {
      privatekey: Flags.string({char: 'k', description: 'Private key', required: true}),
      stream: Flags.string({char: 's', description: 'Stream ID', required: true}),
      filepath: Flags.string({char: 'p', description: 'Folder path', required: true}),
      wait: Flags.integer({char: 'w', description: 'Wait time between receiving chunks in milliseconds', required: false}),
    }

    static args = {
      filepath: Args.string({description: 'Folder path', required: false}),
    }

    async run(): Promise<void> {
      const {flags} = await this.parse(Receive)
      const fileChunks:any[] = []
      interface FileStats {
        started: number
      }

      const fileStats: FileStats = {
        started: 0,
      }
      const streamrCli = new StreamrClient({
        auth: {
          privateKey: flags.privatekey,
        },
        network: {
          webrtcMaxMessageSize: 1048576, // 1000000// 1048576
          webrtcSendBufferMaxMessageCount: 1000,
        },
      })
      const simpleBar = ux.progress({
        format: 'Download | {bar} | {percentage}% || {value}/{total} || {speed} || {time}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      })
      const waitTimeBetweenChunks = flags.wait ? flags.wait : WAIT_TIME_BETWEEN_CHUNKS
      await streamrCli.subscribe({
        id: flags.stream,
      }, async (msg:any) => {
        try {
          if (fileChunks[msg.b[2]] === undefined) {
            fileChunks[msg.b[2]] = []
            simpleBar.start(msg.b[4] + 1, 0, {
              speed: 'N/A',
              time: '0',
            })
            fileStats.started = Date.now()
          }

          fileChunks[msg.b[2]].push(msg.b[4])
          // uint8 to base64 conversion loss taken into account
          const payloadSize = (3 / 4) * Buffer.byteLength(msg.b[1], 'utf8') / 1024
          const timeLapsed = (Date.now() - fileStats.started) / 1000
          const avgSpeed = Math.ceil((fileChunks[msg.b[2]].length * payloadSize / ((Date.now() - fileStats.started) / 1000)))
          simpleBar.update(fileChunks[msg.b[2]].length, {
            speed: avgSpeed + ' KB/s',
            time: timeLapsed + ' s',
          })

          const filepath = flags.filepath + '/' + msg.b[6]
          const payloadAsUint8 = base64ToUint8Array(msg)
          const buffer = Buffer.from(payloadAsUint8)
          await appendToFile(filepath, buffer)
          if (waitTimeBetweenChunks !== 0) {
            await waitAWhile(waitTimeBetweenChunks)
          }

          if (fileChunks[msg.b[2]] !== undefined && fileChunks[msg.b[2]].length === msg.b[4] + 1) {
            simpleBar.update(msg.b[4] + 1, {
              speed: avgSpeed + ' KB/s',
              time: timeLapsed + ' s',
            })
            await waitAWhile(100)
            console.log('\nprobably got all chunks')
            console.log('\nassuming chunks are in order')
            console.log('\nfile saved at ' + filepath)
            const md5 = await calculateFileMD5(filepath)
            const receivedMd5Hash = msg.b[7]
            console.log('\nmd5 hash: ' + md5)
            if (md5 === receivedMd5Hash) {
              console.log('\nmd5 hash match! File is OK')
            } else {
              console.log('\nmd5 hashes do not match! File may be corrupted!')
            }
          }
        } catch (error) {
          console.log(error)
        }
      })
    }
}
