# Use a prebuilt node image
FROM node:13

# Set the working directory to /tmp/app
WORKDIR /tmp/app

# Copy the package.json file that contains all the dependencies to the container
COPY . /tmp/app/

# Run npm install to retrieve all dependencies
RUN npm install

# Expose port so that it can be accessed when the container runs
EXPOSE 8080

# Start the server
CMD ["npm", "start"]