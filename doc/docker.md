# Using Ohm.js with Docker

The `ohm:latest` image provides the Ohm compiler CLI in a self-contained environment — no local Node.js or pnpm installation required.

## Commands overview

| Command           | Description |
|-------------------|-------------|
| `compile`         | Compile an `.ohm` grammar file to a `.wasm` module |
| `generateBundles` | Generate grammar bundles (currently not working) |
| `shell`           | Open a bash shell inside the container |
| `help`            | Print usage information |

Your current directory is mounted at `/local` inside the container, so relative paths to grammar files work as expected.

---

## 1. Running

Pull and run the image directly from Docker Hub:

```sh
docker run --rm -v $(pwd):/local ohmjs/ohm:latest compile my-grammar.ohm
```

### `compile` usage

```sh
docker run --rm -v $(pwd):/local ohmjs/ohm:latest compile [options] <grammar-file>
```

Options:

| Flag                          | Description |
|-------------------------------|-------------|
| `--debug` / `-d`              | Enable debug output |
| `--grammarName` / `-g <name>` | Override the grammar name |
| `--output` / `-o <file>`      | Write output to `<file>` instead of `<grammar-file>.wasm` |

**Example** — compile `arithmetic.ohm` and write the result to `arithmetic.wasm`:

```sh
docker run --rm -v $(pwd):/local ohmjs/ohm:latest compile -o arithmetic.wasm arithmetic.ohm
```

### Getting help

```sh
docker run --rm ohmjs/ohm:latest help
```

---

## 2. Development

### Minimal Docker setup for macOS

```sh
brew install colima docker docker-compose docker-credential-helper
colima start
```

Add to `~/.docker/config.json`:

```json
{
  "cliPluginsExtraDirs": [
    "/opt/homebrew/lib/docker/cli-plugins"
  ]
}
```

> **Note:** If you see `docker-credential-desktop` errors, remove `"credsStore": "desktop"` from `~/.docker/config.json` — it references Docker Desktop, which isn't needed with Colima.

### Building the image locally

Clone the repository and build the production image with Docker Compose:

```sh
git clone https://github.com/ohmjs/ohm.git
cd ohm
docker compose -f docker/docker-compose.yml build
```

This builds the `ohm:latest` image using the `dist` stage of the multi-stage `Dockerfile`, which produces a slim image containing only the compiled packages and their production dependencies.

The `ohm:latest` image is 664 MB and is 99% space efficient (per `wagoodman/dive`).

### Building a development image

The development image uses the `build` stage of the `Dockerfile`, which includes the full source tree, all dev dependencies, and the complete build output. This is useful for iterating on the compiler or debugging build issues.

**Build:**

```sh
TARGET=build docker compose -f docker/docker-compose.yml build
```

This produces the `ohmjs/ohm:development` image.

**Run:**

```sh
docker run -v $(pwd):/local -it --rm ohmjs/ohm:development shell
# or
docker run -v ${PWD}:/local -it --rm ohmjs/ohm:development shell
```

The `-v $(pwd):/local` mount makes your current directory available at `/local` inside the container. The `shell` command drops you into a bash session where you can inspect the built artifacts under `/ohm/` or run CLI commands directly.

The `ohm-dev:latest` images is 1.62 GB and is 97% efficient with only 64 MB potentially wasted space.

### Publishing to Docker Hub (from development machine)

**Note: it is perferable to have the gha docker-release.yml do this**
But there can be a chicken and egg situation where it is easier to do this from a development machine.

Build and push a versioned image to Docker Hub using the git tag as the version:

```sh
# if not set default to ohmjs (ie docker hub using the ohmjs org)
export DOCKER_REPO=<custom docker repo>

# # it might be necessary (particularly on osx) to create a new builder
# # the default builder might not support multi-platform builds
# docker buildx create --use --name ohmjs-builder
# # might be needed
# docker buildx inspect --bootstrap
# # or if already created
# docker buildx use ohmjs-builder

# generate a person access token at https://app.docker.com/accounts/<github username>/settings/personal-access-tokens
# assuming DHPAT contains your PAT
echo $DHPAT | docker login -u <personal username> --password-stdin
cd docker
# if not set defaults to 'development'
export VERSION=$(cat ../packages/compiler/package.json | jq -r '.version')
docker buildx use ohmjs-builder
docker buildx bake \
  --set="*.cache-from=type=local,src=.buildx-cache" \
  --set="*.cache-to=type=local,dest=.buildx-cache,mode=max" \
  --allow=fs.read=.. \
  --push
```

Builds use a local layer cache stored in `docker/.buildx-cache`.
On subsequent runs this avoids re-downloading base layers and reinstalling dependencies.
Note the `docker/.buildx-cache` directory is over 1GB, and needs to be cleaned up manually.

The defaults in `docker-compose.yml` are `DOCKER_REPO=ohmjs` and `VERSION=development`. See [docker-compose.yml](../docker/docker-compose.yml) for details.

## Tips and Tricks

### Image size

To track down file which can be deleted.

**From inside the container**
```sh
apt-get update
apt-get install -y ncdu
ncdu /
```

**Analysing the images**
```sh
alias dive="docker run -ti --rm  -v /var/run/docker.sock:/var/run/docker.sock docker.io/wagoodman/dive"
dive ohmjs/ohm:latest
```
