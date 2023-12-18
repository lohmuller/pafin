# Use the official Node.js image as the base image
FROM node:18
#-alpine

# Criar e configurar o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de configuração e dependências
COPY package*.json tsconfig.json ./

# Instalar dependências
RUN npm install --no-fund

# Copiar o código-fonte do aplicativo
COPY src ./src

# Compilar o TypeScript para JavaScript
RUN npm run build

# Expor a porta necessária para o aplicativo
EXPOSE 3000

# Comando para iniciar o aplicativo
CMD ["npm", "run", "start"]
