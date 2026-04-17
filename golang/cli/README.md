# OhmGo, Cli for Ohm, for Go runtime, in Go

### Generate Command for Command to Generate wasm from grammar.
<!--tmpl,code=bash:go run main.go generate command -h -->
``` bash 

  Usage: ohmgo generate command [options] <source-file>

  Generate a command, in the specified format (default is 'command') to compile a .ohm grammar file
  using the ohmjs/ohm docker image. Does not actually compile the file.

  Path to .ohm grammar file to compile.

  Options:
  --debug, -d
  --docker-tag, -t    The version tag of the ohmjs/ohm docker image to use in the generated command.
                      Defaults to the version of the goohm runtime included in this cli. (default
                      18.0.0-beta.14)
  --grammar-name, -g
  --output, -o
  --format, -f        Output format. One of: command, go_generate, script. (default command)
  --help, -h          display help

```
<!--/tmpl-->

**Example:**

Running `ohmgo generate command my-grammar.ohm` produces;
<!--tmpl,code=bash:go run main.go generate command my-grammar.ohm -->
``` bash 

# To generate a .wasm file for use with this version of the runtime, run:
docker run --rm -v "$PWD":/local ohmjs/ohm:18.0.0-beta.14 compile my-grammar.ohm
```
<!--/tmpl-->
