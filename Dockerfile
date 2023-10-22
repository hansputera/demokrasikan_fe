FROM node:20-alpine3.18

RUN mkdir -p /app
COPY . /app
WORKDIR /app

RUN npm i -g pnpm
RUN pnpm i
RUN pnpm run build

EXPOSE 5173

CMD ["pnpm", "run", "preview", "--port", "5173", "--host"]