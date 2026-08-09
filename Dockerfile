FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Pre-compress compressible static assets so nginx can serve the .gz
# sidecar directly (gzip_static) instead of gzipping multi-megabyte
# font JSON files on every request.
RUN find out -type f \( \
      -iname '*.html' -o -iname '*.js' -o -iname '*.css' -o \
      -iname '*.json' -o -iname '*.svg' -o -iname '*.xml' -o -iname '*.txt' \
    \) -exec gzip -9 -k -f {} \;

FROM nginx:alpine AS runner

COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
