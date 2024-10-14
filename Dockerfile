# Build dos arquivos com Node.js
FROM node:18 AS build-stage

WORKDIR /app

COPY ./src/package.json ./

RUN npm install

COPY ./src .

RUN npm run build

# Servindo os arquivos com Nginx
FROM nginx:alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# can be used to overwrite the default nginx configuration
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
