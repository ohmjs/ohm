#!/bin/bash

function usage() {
  cat <<'EOF'
Usage: docker run --rm -v `pwd`:/local ohmjs/ohm:latest <cmd>

  where <cmd> is one of: compile, generateBundles, shell, help

  compile [options] <grammar-file>
    Options:
      -d, --debug                  Enable debug output
      -g, --grammarName <name>     Override the grammar name
      -o, --output <file>          Write output to <file> (default: <grammar-file>.wasm)

    Output directory (-v <hostdir>:/dst):
      If /dst is mounted, output paths are resolved relative to /dst.
      eg: docker run --rm -v /srcdir:/local -v /dstdir:/dst ohmjs/ohm:latest compile grammar.ohm

    Stdin / stdout:
      If <grammar-file> is '-', the grammar is read from stdin.
      If -o is '-', or if reading from stdin without -o,
      the wasm bytes are written to stdout.
      eg: cat grammar.ohm | docker run --rm -i ohmjs/ohm:latest compile - > grammar.wasm

  generateBundles                  (currently not working)

  shell                            Drop into a bash shell in the container
                                   (useful for debugging the docker build)

  help                             Print this message

EOF
}

if [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  usage
  exit 0
fi

case "$1" in
  compile)
    shift
    mkdir -p /local
    cd /local

    # Parse args once so we can detect stdin/stdout ('-') modes before /dst remapping.
    has_output=0
    output_val=""
    input_file=""
    grammar_name=""
    debug_flag=0
    while [ $# -gt 0 ]; do
      case "$1" in
        -o|--output)
          has_output=1
          output_val="$2"
          shift 2
          ;;
        -g|--grammarName)
          grammar_name="$2"
          shift 2
          ;;
        -d|--debug)
          debug_flag=1
          shift
          ;;
        *)
          input_file="$1"
          shift
          ;;
      esac
    done

    # If the input is '-' the grammar is assumed to be piped in on stdin.
    stdin_mode=0
    if [ "$input_file" = "-" ]; then
      stdin_mode=1
    fi

    # If, in this case, an output name is not provided, or the output name is '-',
    # the wasm bytes are provided on stdout.
    stdout_mode=0
    if [ "$has_output" -eq 1 ] && [ "$output_val" = "-" ]; then
      stdout_mode=1
    elif [ "$stdin_mode" -eq 1 ] && [ "$has_output" -eq 0 ]; then
      stdout_mode=1
    fi

    tmp_in=""
    tmp_out=""
    if [ "$stdin_mode" -eq 1 ]; then
      tmp_in="$(mktemp /tmp/ohm-stdin.XXXXXX).ohm"
      cat > "$tmp_in"
      input_file="$tmp_in"
    fi
    if [ "$stdout_mode" -eq 1 ]; then
      tmp_out="$(mktemp /tmp/ohm-stdout.XXXXXX).wasm"
      output_val="$tmp_out"
      has_output=1
    fi

    # /dst remapping applies only when output goes to a file (not stdout).
    if [ "$stdout_mode" -eq 0 ] && [ -d /dst ]; then
      if [ "$has_output" -eq 1 ]; then
        case "$output_val" in
          /*) ;;
          *) output_val="/dst/$output_val" ;;
        esac
      elif [ -n "$input_file" ]; then
        base="$(basename "$input_file")"
        output_val="/dst/${base%.*}.wasm"
        has_output=1
      fi
    fi

    final_args=()
    [ "$debug_flag" -eq 1 ] && final_args+=("-d")
    [ -n "$grammar_name" ] && final_args+=("-g" "$grammar_name")
    [ "$has_output" -eq 1 ] && final_args+=("-o" "$output_val")
    [ -n "$input_file" ] && final_args+=("$input_file")

    rc=0
    if [ "$stdout_mode" -eq 1 ]; then
      # Redirect the CLI's "Wrote Wasm to ..." message to stderr to keep stdout clean.
      tmp_log="$(mktemp /tmp/ohm-log.XXXXXX)"
      node \
        --disable-warning=ExperimentalWarning \
        /ohm/packages/compiler/dist/src/cli.js "${final_args[@]}" >"$tmp_log" 2>&1
      rc=$?
      if [ "$rc" -eq 0 ]; then
        cat "$tmp_out"
      else
        cat "$tmp_log" >&2
      fi
      rm -f "$tmp_log"
    else
      node \
        --disable-warning=ExperimentalWarning \
        /ohm/packages/compiler/dist/src/cli.js "${final_args[@]}" >&2
      rc=$?
    fi

    [ -n "$tmp_in" ] && rm -f "$tmp_in"
    [ -n "$tmp_out" ] && rm -f "$tmp_out"
    exit "$rc"
    ;;
  generateBundles)
    set -x
    shift
    mkdir -p /local
    cd /local
    node /ohm/packages/cli/src/cli.js generateBundles "$@"
    ;;
  shell)
    /bin/bash
    ;;
  *)
    echo "Unknown command: $1"
    usage
    exit 1
    ;;
esac
