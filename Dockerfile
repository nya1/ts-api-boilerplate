# Build
FROM node:16-alpine as builder

# can be needed to install dependencies required by node-gyp
# RUN apk add --no-cache python3 make g++

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

COPY package.json yarn.lock ./

# disable husky
CMD npm set-script prepare ""

# install all deps required for building
RUN HUSKY_SKIP_INSTALL=true yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Final image
FROM node:16-alpine AS release

USER node
WORKDIR /home/node

# copy
COPY --from=builder /usr/src/app/package.json /home/node/
COPY --from=builder /usr/src/app/yarn.lock /home/node/
COPY --from=builder /usr/src/app/.yarnclean /home/node/
COPY --from=builder /usr/src/app/dist/ /home/node/dist/

# install only production modules
# disable husky
CMD npm set-script prepare ""
# install all deps required for building
RUN HUSKY_SKIP_INSTALL=true yarn install --frozen-lockfile --production

# run autoclean to remove any non required files (node_modules)
RUN yarn autoclean --force

# expose port
EXPOSE 3000

CMD ["node", "dist/src/server.js"]
