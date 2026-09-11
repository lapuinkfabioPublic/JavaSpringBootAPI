# Mini Bank API

Microsservico bancario simples em Spring Boot.

## Stack
- Java 17+ / Spring Boot 3.x
- Spring Web, Data JPA, Validation, Actuator
- H2 (em memoria)
- RabbitMQ (opcional)
- Lombok, JUnit 5, Mockito, AssertJ

## Endpoints
- POST /api/v1/contas
- GET  /api/v1/contas
- GET  /api/v1/contas/{numero}
- POST /api/v1/contas/{numero}/deposito?valor=100

## Executar
    ./mvnw spring-boot:run

## Testes
    ./mvnw test

## H2 Console
http://localhost:8080/h2-console
JDBC: jdbc:h2:mem:minibank
