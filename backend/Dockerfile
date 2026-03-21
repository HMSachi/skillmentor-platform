# Build stage: Use Maven to build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application, skipping tests for speed
RUN mvn clean package -DskipTests

# Run stage: Use a lightweight JRE to run the app
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/skillmentor-0.0.1-SNAPSHOT.jar app.jar

# Expose the port Render uses
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
