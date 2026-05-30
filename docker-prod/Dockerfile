FROM node:22-alpine
ENV NODE_ENV=production
# Let corepack fetch the pnpm version pinned in package.json non-interactively.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /usr/src/app

# Enable pnpm (ships with Node via corepack). The exact version is resolved from
# the "packageManager" field in the server's package.json.
RUN corepack enable pnpm

COPY ./docker-prod/server/* ./

COPY ./build ./build

RUN pnpm install --prod --frozen-lockfile

CMD ["node", "index.js"]

EXPOSE 1337
