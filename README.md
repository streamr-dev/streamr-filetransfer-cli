streamr-file-transfer-cli
=================

Streamr file transfer command line interface. Transfer files over Streamr network.


[![GitHub license](https://img.shields.io/github/license/streamr-dev/streamr-filetransfer-cli)](https://github.com/streamr-dev/streamr-filetransfer-cli/blob/main/LICENSE)

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
* [`streamr-filetransfer-cli help [COMMANDS]`](#streamr-filetransfer-cli-help-commands)
* [`streamr-filetransfer-cli receive [FILEPATH]`](#streamr-filetransfer-cli-receive-filepath)
* [`streamr-filetransfer-cli send FILEPATH`](#streamr-filetransfer-cli-send-filepath)

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

## `streamr-filetransfer-cli receive [FILEPATH]`

Streamr file transfer

```
USAGE
  $ streamr-filetransfer-cli receive [FILEPATH] -k <value> -s <value> -p <value> [-w <value>]

ARGUMENTS
  FILEPATH  Folder path

FLAGS
  -k, --privatekey=<value>  (required) Private key
  -p, --filepath=<value>    (required) Folder path
  -s, --stream=<value>      (required) Stream ID
  -w, --wait=<value>        Wait time between receiving chunks in milliseconds

DESCRIPTION
  Streamr file transfer

EXAMPLES
  $ streamr-filetransfer-cli receive -p<FOLDER> -k<0xPRIVATEKEY> -s<STREAM_ID>
```

_See code: [dist/commands/receive/index.ts](https://github.com/yaruno/streamr-filetransfer-cli/blob/v0.0.0/dist/commands/receive/index.ts)_

## `streamr-filetransfer-cli send FILEPATH`

Streamr file transfer

```
USAGE
  $ streamr-filetransfer-cli send FILEPATH -k <value> -s <value> [-b <value>] [-w <value>]

ARGUMENTS
  FILEPATH  Filepath

FLAGS
  -b, --bytesPerSlice=<value>  Chunk size in KB
  -k, --privatekey=<value>     (required) Private key
  -s, --stream=<value>         (required) Stream ID
  -w, --wait=<value>           Wait time between sending chunks in milliseconds

DESCRIPTION
  Streamr file transfer

EXAMPLES
  $ streamr-filetransfer-cli send <FILE_PATH> -k<0xPRIVATEKEY> -s<STREAM_ID>
```

_See code: [dist/commands/send/index.ts](https://github.com/yaruno/streamr-filetransfer-cli/blob/v0.0.0/dist/commands/send/index.ts)_
<!-- commandsstop -->
