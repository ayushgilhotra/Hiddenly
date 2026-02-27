# LEARNING NOTE:
# This Dockerfile defines how to package our Spring Boot app into a "Container".
# Containers run the same way on any machine (or server), solving the "it works on my machine" problem.

# Step 1: Build the application using Maven
# We use an official Maven image with JDK 17
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the JAR file (skipping tests for speed in this demo)
RUN mvn clean package -DskipTests

# Step 2: Run the application
# Use a lightweight JDK image for the final container
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port (Render/Heroku often use $PORT, but 8080 is default)
EXPOSE 8080

# Command to run the app
# Parameters can be overridden by environment variables
ENTRYPOINT ["java", "-jar", "app.jar"]
