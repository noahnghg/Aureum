<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Aureum Project Instructions

This is a microservices-based personal finance and investment advisory platform. Please follow these guidelines when working on the codebase:

## Architecture Guidelines

- Follow microservices patterns with clear service boundaries
- Use Spring Boot 3.x best practices for Java services
- Implement proper error handling and logging
- Use async messaging with RabbitMQ for inter-service communication
- Follow RESTful API design principles

## Code Style

- Use Java 17 features and modern Spring Boot patterns
- Follow Spring Security 6.x guidelines for authentication
- Use proper dependency injection and configuration
- Implement proper exception handling
- Write comprehensive unit and integration tests

## Database Guidelines

- Use JPA entities for PostgreSQL with proper relationships
- Use MongoDB documents for transaction data with efficient indexing
- Implement proper data validation and constraints
- Use connection pooling and optimization techniques

## Security Best Practices

- Implement JWT authentication consistently across services
- Use HTTPS for all external communications
- Encrypt sensitive data
- Follow OWASP security guidelines
- Implement proper input validation

## API Integration

- Use Plaid sandbox for Open Banking integration
- Implement proper retry logic and circuit breakers
- Handle API rate limits appropriately
- Use proper error handling for external API calls

## Docker and Deployment

- Create efficient Dockerfile configurations
- Use multi-stage builds for optimization
- Implement proper health checks
- Use Kubernetes best practices for deployment

## Testing

- Write unit tests with JUnit 5
- Implement integration tests with TestContainers
- Use MockMVC for web layer testing
- Test async messaging with embedded RabbitMQ
