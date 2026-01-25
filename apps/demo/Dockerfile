# Dockerfile for ng2-dragula demo app
FROM node:18-alpine

# Install necessary packages
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy package files for demo app dependencies
COPY package.json package-lock.json ./

# Install dependencies (use legacy-peer-deps to bypass peer dependency conflicts)
RUN npm ci --legacy-peer-deps

# Copy the pre-built ng2-dragula package from artifact
# This will be mounted as a volume or copied in the workflow
COPY ng2-dragula.tgz /tmp/ng2-dragula.tgz

# Install the local package (use legacy-peer-deps to bypass peer dependency conflicts)
RUN npm install /tmp/ng2-dragula.tgz --legacy-peer-deps

# Copy demo app source files
COPY apps/demo ./apps/demo
COPY apps/demo-e2e ./apps/demo-e2e
COPY nx.json ./
COPY tsconfig.base.json ./

# Expose port for dev server
EXPOSE 4200

# Start the demo server
CMD ["npx", "nx", "serve", "demo", "--host", "0.0.0.0", "--port", "4200"]
