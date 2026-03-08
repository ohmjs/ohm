FROM node:24 AS build

RUN npm install -g pnpm@latest-10

WORKDIR /ohm
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  CI=true pnpm fetch

COPY . /ohm

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  CI=true pnpm install --frozen-lockfile --offline

RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  (CI=true pnpm build)

ENTRYPOINT [ "/ohm/packages/docker/entrypoint.sh" ]

CMD ["help"]

FROM node:24-slim AS dist

RUN npm install -g pnpm@latest-10

WORKDIR /ohm

COPY package.json pnpm-lock.yaml ./
COPY packages/docker/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  CI=true pnpm fetch --prod

COPY --from=build /ohm/packages/ohm-js          /ohm/packages/ohm-js
COPY --from=build /ohm/packages/runtime         /ohm/packages/runtime
COPY --from=build /ohm/packages/to-ast-compat   /ohm/packages/to-ast-compat
COPY --from=build /ohm/packages/compiler        /ohm/packages/compiler
COPY --from=build /ohm/packages/semantics       /ohm/packages/semantics
COPY --from=build /ohm/packages/lang-python     /ohm/packages/lang-python
COPY --from=build /ohm/packages/cli             /ohm/packages/cli

COPY ./packages/docker/entrypoint.sh entrypoint.sh
ENTRYPOINT [ "/ohm/entrypoint.sh" ]

CMD ["help"]
