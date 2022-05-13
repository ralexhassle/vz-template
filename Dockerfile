FROM node:14 as build-stage
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ARG GENERATE_SOURCEMAP=false
ENV GENERATE_SOURCEMAP=$GENERATE_SOURCEMAP
ARG VITE_API_URL=https://api.vazeetap.com/v3/
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_MENU_URL=https://menu.vazeepro.com/menu
ENV VITE_MENU_URL=$VITE_MENU_URL
ARG VITE_GA_MEASUREMENT_ID=G-WYGG9N1TMG
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
RUN apk --no-cache upgrade
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
