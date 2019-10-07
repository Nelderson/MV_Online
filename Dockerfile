# Install node v10
FROM node:10

# Set the workdir /var/www/mv-online
WORKDIR /var/www/mv-online

# Copy the package.json to workdir
COPY package.json ./

# Run npm install - install the npm dependencies
RUN npm install

# Copy application source
COPY . .

# # Copy .env.docker to workdir/.env - use the docker env
# COPY .env.docker ./.env

# Expose application port
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start"]