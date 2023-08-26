FROM node:20-bullseye-slim

ENV USER=root

COPY . /workspaces/code

WORKDIR /workspaces/code

RUN apt-get update

# setup project
RUN npm ci
RUN npm run setup:prisma
