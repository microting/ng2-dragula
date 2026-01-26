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

# Copy Nx workspace configuration files
COPY nx.json ./
COPY tsconfig.base.json ./

# Copy demo app source files and project configuration
COPY apps/demo ./apps/demo

# Remove implicit dependency on ng2-dragula from project.json
# since it's installed as an npm package, not a workspace project
RUN sed -i '/"implicitDependencies":/d' ./apps/demo/project.json

# Expose port for dev server
EXPOSE 4200

# Start the demo server
# Use verbose flag and print Nx version for debugging
CMD ["sh", "-c", "echo 'Starting Nx demo server...' && npx nx --version && npx nx serve demo --host 0.0.0.0 --port 4200 --verbose"]
