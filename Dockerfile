FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Cache dependencies separately from source code
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build the app
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

# Faster JVM startup flags
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-XX:TieredStopAtLevel=1", \
  "-jar", "app.jar"]

  