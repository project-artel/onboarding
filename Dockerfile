FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# 같은 이미지를 환경마다 쓸 수 있도록 시작 시 실제 주소로 치환한다.
ENV VITE_ORCHESTRATION_URL=__ARTEL_ORCHESTRATION_URL__
ENV VITE_CONSOLE_URL=__ARTEL_CONSOLE_URL__
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker-entrypoint.sh /usr/local/bin/artel-entrypoint.sh
RUN chmod +x /usr/local/bin/artel-entrypoint.sh
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/artel-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
