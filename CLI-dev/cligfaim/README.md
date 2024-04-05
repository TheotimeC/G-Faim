oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cligfaim
$ cligfaim COMMAND
running command...
$ cligfaim (--version)
cligfaim/0.0.0 win32-x64 node-v20.11.1
$ cligfaim --help [COMMAND]
USAGE
  $ cligfaim COMMAND
...
```
<!-- usagestop -->
```sh-session
$ npm install -g oclif-hello-world
$ oex COMMAND
running command...
$ oex (--version)
oclif-hello-world/0.0.0 darwin-x64 node-v16.13.1
$ oex --help [COMMAND]
USAGE
  $ oex COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cligfaim hello PERSON`](#cligfaim-hello-person)
* [`cligfaim hello world`](#cligfaim-hello-world)
* [`cligfaim help [COMMAND]`](#cligfaim-help-command)
* [`cligfaim plugins`](#cligfaim-plugins)
* [`cligfaim plugins add PLUGIN`](#cligfaim-plugins-add-plugin)
* [`cligfaim plugins:inspect PLUGIN...`](#cligfaim-pluginsinspect-plugin)
* [`cligfaim plugins install PLUGIN`](#cligfaim-plugins-install-plugin)
* [`cligfaim plugins link PATH`](#cligfaim-plugins-link-path)
* [`cligfaim plugins remove [PLUGIN]`](#cligfaim-plugins-remove-plugin)
* [`cligfaim plugins reset`](#cligfaim-plugins-reset)
* [`cligfaim plugins uninstall [PLUGIN]`](#cligfaim-plugins-uninstall-plugin)
* [`cligfaim plugins unlink [PLUGIN]`](#cligfaim-plugins-unlink-plugin)
* [`cligfaim plugins update`](#cligfaim-plugins-update)

## `cligfaim hello PERSON`

Say hello

```
USAGE
  $ cligfaim hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/CLI-dev/cligfaim/blob/v0.0.0/src/commands/hello/index.ts)_

## `cligfaim hello world`

Say hello world

```
USAGE
  $ cligfaim hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ cligfaim hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/CLI-dev/cligfaim/blob/v0.0.0/src/commands/hello/world.ts)_

## `cligfaim help [COMMAND]`

Display help for cligfaim.

```
USAGE
  $ cligfaim help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for cligfaim.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.20/src/commands/help.ts)_

## `cligfaim plugins`

List installed plugins.

```
USAGE
  $ cligfaim plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ cligfaim plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.5/src/commands/plugins/index.ts)_

## `cligfaim plugins add PLUGIN`

Installs a plugin into cligfaim.

```
USAGE
  $ cligfaim plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into cligfaim.

  Uses bundled npm executable to install plugins into C:\Users\Theo\AppData\Local\cligfaim

  Installation of a user-installed plugin will override a core plugin.

  Use the CLIGFAIM_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the CLIGFAIM_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ cligfaim plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ cligfaim plugins add myplugin

  Install a plugin from a github url.

    $ cligfaim plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ cligfaim plugins add someuser/someplugin
```

## `cligfaim plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ cligfaim plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ cligfaim plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.5/src/commands/plugins/inspect.ts)_

## `cligfaim plugins install PLUGIN`

Installs a plugin into cligfaim.

```
USAGE
  $ cligfaim plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into cligfaim.

  Uses bundled npm executable to install plugins into C:\Users\Theo\AppData\Local\cligfaim

  Installation of a user-installed plugin will override a core plugin.

  Use the CLIGFAIM_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the CLIGFAIM_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ cligfaim plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ cligfaim plugins install myplugin

  Install a plugin from a github url.

    $ cligfaim plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ cligfaim plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.5/src/commands/plugins/install.ts)_

## `cligfaim plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ cligfaim plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ cligfaim plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.5/src/commands/plugins/link.ts)_

## `cligfaim plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ cligfaim plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ cligfaim plugins unlink
  $ cligfaim plugins remove

EXAMPLES
  $ cligfaim plugins remove myplugin
```

## `cligfaim plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ cligfaim plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.5/src/commands/plugins/reset.ts)_

## `cligfaim plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ cligfaim plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ cligfaim plugins unlink
  $ cligfaim plugins remove

EXAMPLES
  $ cligfaim plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.5/src/commands/plugins/uninstall.ts)_

## `cligfaim plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ cligfaim plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ cligfaim plugins unlink
  $ cligfaim plugins remove

EXAMPLES
  $ cligfaim plugins unlink myplugin
```

## `cligfaim plugins update`

Update installed plugins.

```
USAGE
  $ cligfaim plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.5/src/commands/plugins/update.ts)_
<!-- commandsstop -->
* [`oex hello PERSON`](#oex-hello-person)
* [`oex hello world`](#oex-hello-world)
* [`oex help [COMMAND]`](#oex-help-command)
* [`oex plugins`](#oex-plugins)
* [`oex plugins:inspect PLUGIN...`](#oex-pluginsinspect-plugin)
* [`oex plugins:install PLUGIN...`](#oex-pluginsinstall-plugin)
* [`oex plugins:link PLUGIN`](#oex-pluginslink-plugin)
* [`oex plugins:uninstall PLUGIN...`](#oex-pluginsuninstall-plugin)
* [`oex plugins update`](#oex-plugins-update)

## `oex hello PERSON`

Say hello

```
USAGE
  $ oex hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/oclif/hello-world/blob/v0.0.0/dist/commands/hello/index.ts)_

## `oex hello world`

Say hello world

```
USAGE
  $ oex hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `oex help [COMMAND]`

Display help for oex.

```
USAGE
  $ oex help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for oex.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `oex plugins`

List installed plugins.

```
USAGE
  $ oex plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ oex plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `oex plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ oex plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ oex plugins:inspect myplugin
```

## `oex plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ oex plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ oex plugins add

EXAMPLES
  $ oex plugins:install myplugin 

  $ oex plugins:install https://github.com/someuser/someplugin

  $ oex plugins:install someuser/someplugin
```

## `oex plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ oex plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ oex plugins:link myplugin
```

## `oex plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ oex plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ oex plugins unlink
  $ oex plugins remove
```

## `oex plugins update`

Update installed plugins.

```
USAGE
  $ oex plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
