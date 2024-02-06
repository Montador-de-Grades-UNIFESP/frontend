# Etapa de construção para a aplicação Vue
FROM node:16 as build-stage

WORKDIR /app

# Copiar os arquivos da aplicação Vue e instalar as dependências
COPY frontend-montador/package*.json ./
RUN npm install

COPY frontend-montador/ .
RUN npm run build

# Etapa final para a aplicação Express
FROM node:16

WORKDIR /app

# Copiar os arquivos da aplicação Express e instalar as dependências
COPY backend-montador/package*.json ./
RUN npm install

COPY backend-montador/ .

# Copiar os arquivos construídos da aplicação Vue para a pasta pública do Express
COPY --from=build-stage /app/dist /app/dist

# Expor a porta que o Express está ouvindo
EXPOSE 3000

CMD ["npm", "start"] 
