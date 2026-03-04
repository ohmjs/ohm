FROM node:24

# RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -

RUN npm install -g pnpm@latest-10

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/pnpm/store \
  pnpm fetch --frozen-lockfile

COPY . /workspace
# # TODO only copy in minimal src
# COPY packages/compiler packages/compiler
# COPY packages/ohm-js/src/ohm-grammar.ohm packages/ohm-js/src/ohm-grammar.ohm

WORKDIR /workspace/packages/cli
RUN pnpm install --frozen-lockfile --offline

WORKDIR /workspace/packages/compiler

RUN pnpm install --frozen-lockfile --offline
RUN make all

ENTRYPOINT [ "/workspace/packages/docker/entrypoint.sh" ]

CMD ["help"]