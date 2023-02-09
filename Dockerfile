# Use a imagem base do node
FROM node:14

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e o yarn.lock para o diretório de trabalho
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie os arquivos da aplicação para o diretório de trabalho
COPY . .

# Defina a porta na qual a aplicação será executada
EXPOSE 8080

# Defina o comando para iniciar a aplicação
CMD [ "npm", "run", "dev" ]