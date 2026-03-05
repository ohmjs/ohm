FROM node:24 AS build

# RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -

RUN npm install -g pnpm@latest-10

WORKDIR /ohm
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/pnpm/store \
  pnpm fetch \
    --frozen-lockfile

COPY . /ohm

RUN pwd
# filtering out lang-python as it is not building
RUN \
  # --mount=type=cache,target=/workspace/node_modules \
  pnpm install \
    --frozen-lockfile \
    --offline \
  && \
  pnpm --filter='!lang-python' build

ENTRYPOINT [ "/ohm/packages/docker/entrypoint.sh" ]

CMD ["help"]

FROM node:24-slim AS dist

RUN npm install -g pnpm@latest-10

WORKDIR /ohm

COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.build.yaml ./pnpm-workspace.yaml
RUN --mount=type=cache,target=/pnpm/store \
  pnpm fetch \
    --frozen-lockfile

COPY --from=build /ohm/packages/compiler/ /ohm/packages/compiler
COPY --from=build /ohm/packages/runtime/ /ohm/packages/runtime
COPY --from=build /ohm/packages/to-ast-compat/ /ohm/packages/to-ast-compat
COPY --from=build /ohm/packages/cli /ohm/packages/cli
COPY --from=build /ohm/packages/ohm-js /ohm/packages/ohm-js

RUN find /ohm -name node_modules | xargs rm -rf

RUN pwd

RUN pnpm install \
  --prod \
  --frozen-lockfile \
  --offline

RUN cd /ohm/packages/cli && pnpm install \
  -prod \
  --force \
  --frozen-lockfile \
  --offline

# RUN pnpm \
#   --filter=compiler \
#   --legacy \
#   --prod \
#   deploy /packages/compiler


# to track down file which can be deleted
#
# apt-get update
# apt-get install -y ncdu
# ncdu /
#
# or
# alias dive="docker run -ti --rm  -v /var/run/docker.sock:/var/run/docker.sock docker.io/wagoodman/dive"
# dive ohm:latest

#
# RUN rm -rf /root/.local/share/pnpm/store

COPY ./packages/docker/entrypoint.sh entrypoint.sh
ENTRYPOINT [ "/ohm/entrypoint.sh" ]

CMD ["help"]