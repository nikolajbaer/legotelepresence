FROM node

WORKDIR /code/
COPY package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /code/node_modules/.bin:$PATH

WORKDIR /code/app
COPY . .
