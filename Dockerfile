FROM node:23 AS builder

WORKDIR /app

#Install Angular CLI
RUN npm i -g @angular/cli

# COPY vttp-miniproject-frontend/environments environments
COPY vttp-miniproject-frontend/src /app/src
COPY vttp-miniproject-frontend/*json /app/

# Install dependencies, clean install
# Build the Angular Application

RUN npm ci && ng build --configuration production

# stage 2
FROM eclipse-temurin:23-jdk AS builder2


LABEL maintainer="varsh1210"

WORKDIR /app

# Copy 
COPY vttp-miniproject-backend/pom.xml .
COPY vttp-miniproject-backend/mvnw .
COPY vttp-miniproject-backend/mvnw.cmd .
COPY vttp-miniproject-backend/src src
COPY vttp-miniproject-backend/.mvn .mvn

COPY --from=builder /app/dist/vttp-miniproject-frontend/browser src/main/resources/static/

RUN chmod a+x ./mvnw && ./mvnw clean package -Dmaven.test.skip=true
 
#stage 3
FROM eclipse-temurin:23-jdk

WORKDIR /app

COPY --from=builder2 /app/target/miniproject-backend-0.0.1-SNAPSHOT.jar vttp-miniproject.jar


ENV PORT=8080

EXPOSE ${PORT}

ENTRYPOINT ["java","-jar","vttp-miniproject.jar"]