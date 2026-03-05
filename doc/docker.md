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
docker run --rm -v $(pwd):/local ohm:latest compile my-grammar.ohm
```

### `compile` usage

```sh
docker run --rm -v $(pwd):/local ohm:latest compile [options] <grammar-file>
```

Options:

| Flag                          | Description |
|-------------------------------|-------------|
| `--debug` / `-d`              | Enable debug output |
| `--grammarName` / `-g <name>` | Override the grammar name |
| `--output` / `-o <file>`      | Write output to `<file>` instead of `<grammar-file>.wasm` |

**Example** — compile `arithmetic.ohm` and write the result to `arithmetic.wasm`:

```sh
docker run --rm -v $(pwd):/local ohm:latest compile -o arithmetic.wasm arithmetic.ohm
```

### Getting help

```sh
docker run --rm ohm:latest help
```

---

## 2. Building the image locally

Clone the repository and build the production image with Docker Compose:

```sh
git clone https://github.com/ohmjs/ohm.git
cd ohm
docker compose build
```

This builds the `ohm:latest` image using the `dist` stage of the multi-stage `Dockerfile`, which produces a slim image containing only the compiled packages and their production dependencies.

The `ohm:latest` image is 664 MB and is 99% space efficient (per `wagoodman/dive`).

---

## 3. Building a development image

The development image uses the `build` stage of the `Dockerfile`, which includes the full source tree, all dev dependencies, and the complete build output. This is useful for iterating on the compiler or debugging build issues.

**Build:**

```sh
docker compose -f docker-compose.dev.yml build
```

This produces the `ohm-dev:latest` image.

**Run:**

```sh
docker run -v $(pwd):/local -it --rm ohm-dev:latest shell
# or
docker run -v ${PWD}:/local -it --rm ohm-dev:latest shell
```

The `-v $(pwd):/local` mount makes your current directory available at `/local` inside the container. The `shell` command drops you into a bash session where you can inspect the built artifacts under `/ohm/` or run CLI commands directly.

The `ohm-dev:latest` images is 1.62 GB and is 97% efficient with only 64 MB potentially wasted space.

---

## 4. Publishing to Docker Hub

Build and push a versioned image to Docker Hub using the git tag as the version:

```sh
export DOCKER_REPO=<custom docker repo>
export VERSION=$(git describe --tag --dirty)
# or export VERSION=$(cat packages/runtime/package.json | jq -r '.version')

docker compose build
docker login
docker push ${DOCKER_REPO}/ohm:${VERSION}
```

`git describe --tag --dirty` produces a version string based on the nearest git tag, appending commit info and a `-dirty` suffix if there are uncommitted changes.

The defaults in `docker-compose.yml` are `DOCKER_REPO=ohmjs` and `VERSION=development`. See [docker-compose.yml](../docker-compose.yml) for details.
