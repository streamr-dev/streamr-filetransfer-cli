streamr-file-transfer-cli
=================

Streamr file transfer command line interface. Transfer files over Streamr network.


[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g streamr-filetransfer-cli
$ streamr-filetransfer-cli COMMAND
running command...
$ streamr-filetransfer-cli (--version)
streamr-filetransfer-cli/0.0.0 win32-x64 node-v16.20.0
$ streamr-filetransfer-cli --help [COMMAND]
USAGE
  $ streamr-filetransfer-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`streamr-filetransfer-cli send FILE`](#streamr-filetransfer-cli-send-file)
* [`streamr-filetransfer-cli receive`](#streamr-filetransfer-cli-receive)
* [`streamr-filetransfer-cli help [COMMANDS]`](#streamr-filetransfer-cli-help-commands)

## `streamr-filetransfer-cli send FILE`

Send a file over Streamr network stream.

```
USAGE
  $ streamr-filetransfer-cli send FILEPATH -k<0xPRIVATEKEY> -s<STREAM_ID>

ARGUMENTS
  FILEPATH  File to be sent

FLAGS
  -k<value>  (required) Private key that has access to given Stream
  -s<value>  (required) Streamr stream where the file chunks are to be sent

DESCRIPTION
  Sends a file as chunks to Streamr stream.

EXAMPLES
  $ streamr-filetransfer-cli send ./crab_rave.mp4 -k0x1234... -s0x14Ee183938ef7b3b071072CfCAb16D2a0D37B39D/crab_party
  filepath: .\crab_rave.mp4 privatekey: 0x1234... stream: 0x14Ee183938ef7b3b071072CfCAb16D2a0D37B39D/crab_party

  md5 hash: bf8ae390020b3a02a19deac005ada113

  # of slices 224
  Upload | ████████████████████████████████████████ | 100% || 224/224 || 672 KB/s || 15.009 s
  file read
  upload_complete
```

_See code: [dist/commands/send/index.ts](https://github.com/yaruno/streamr-filetransfer-cli/blob/v0.0.0/dist/commands/send/index.ts)_

## `streamr-filetransfer-cli receive`

Receive a file from Streamr network stream.

```
USAGE
  $ streamr-filetransfer-cli receive -p<FOLDER> -k<0xPRIVATEKEY> -s<STREAM_ID>

FLAGS
  -p<value>  (required) Folder where file is to be saved
  -k<value>  (required) Private key that has access to given Stream
  -s<value>  (required) Streamr stream where the file chunks are to be sent

DESCRIPTION
  Receive file chunks from a Streamr stream and append them into a file.

EXAMPLES
  $ streamr-filetransfer-cli receive -pfiles -k0x1234... -s0x14Ee183938ef7b3b071072CfCAb16D2a0D37B39D/crab_party
  Download | ████████████████████████████████████████ | 100% || 224/224 || 776 KB/s || 12.991 s
  probably got all chunks
  assuming chunks are in order
  file saved at files/crab_rave.mp4
  md5 hash: bf8ae390020b3a02a19deac005ada113

  md5 hash match! File is OK
```

## `streamr-filetransfer-cli help [COMMANDS]`

Display help for streamr-filetransfer-cli.

```
USAGE
  $ streamr-filetransfer-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for streamr-filetransfer-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_


<!-- commandsstop -->
