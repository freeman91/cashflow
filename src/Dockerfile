FROM node:18
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
RUN yarn global add serve
EXPOSE 4242

# Serve the frontend build on port 4242
CMD ["serve", "-s", "build", "-l", "4242"]
