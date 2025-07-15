# Aureum Development Guide

## Project Structure

```
aureum/
├── .github/
│   └── copilot-instructions.md
├── backend/
│   ├── api-gateway/              # Spring Cloud Gateway
│   ├── user-service/             # User management & auth
│   ├── open-banking-service/     # Plaid integration
│   ├── data-processing-service/  # Transaction processing
│   ├── ai-insights-service/      # AI insights coordination
│   ├── investment-advisory-service/ # Portfolio recommendations
│   └── notification-service/     # Email/SMS notifications
├── ai-service/                   # Python Flask ML service
├── frontend/                     # React frontend (optional)
├── infrastructure/
│   ├── database/
│   │   ├── postgres/
│   │   └── mongodb/
│   ├── kubernetes/
│   └── terraform/
├── scripts/
│   ├── build.sh
│   └── setup-dev.sh
├── docker-compose.yml
├── .env.example
└── README.md
```

## Development Workflow

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd aureum

# Set up development environment
./scripts/setup-dev.sh

# Create and configure environment file
cp .env.example .env
# Edit .env with your configurations
```

### 2. Development Process

Each microservice can be developed and tested independently:

#### Backend Services (Java Spring Boot)

```bash
# Navigate to service directory
cd backend/user-service

# Install dependencies and build
mvn clean install

# Run locally
mvn spring-boot:run

# Run tests
mvn test
```

#### AI Service (Python Flask)

```bash
# Navigate to AI service
cd ai-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run service
python app.py
```

### 3. Integration Testing

```bash
# Build all services
./scripts/build.sh

# Start all services
docker-compose up

# Run integration tests
docker-compose exec api-gateway curl http://localhost:8080/actuator/health
```

## Service Endpoints

### API Gateway (Port 8080)
- **Health Check**: `GET /actuator/health`
- **All service routes**: Routes requests to appropriate microservices

### User Service (Port 8081)
- **Register**: `POST /api/users/register`
- **Login**: `POST /api/users/login`
- **Profile**: `GET /api/users/profile` (JWT required)
- **Update Profile**: `PUT /api/users/profile` (JWT required)

### Open Banking Service (Port 8082)
- **Link Account**: `POST /api/open-banking/link`
- **Get Transactions**: `GET /api/open-banking/transactions`

### AI Model Service (Port 5000)
- **Health Check**: `GET /health`
- **Analyze Transactions**: `POST /analyze`
- **Generate Insights**: `POST /insights`

## Database Schema

### PostgreSQL (Structured Data)
- **users**: User accounts and profiles
- **financial_goals**: User financial objectives
- **bank_accounts**: Linked bank account information
- **insights**: AI-generated insights
- **portfolios**: Investment portfolio recommendations
- **notifications**: System notifications

### MongoDB (Transaction Data)
- **transactions**: Financial transaction records
- **spending_patterns**: Analyzed spending behaviors
- **transaction_categories**: Categorization data

## Security

### JWT Authentication
- All services except login/register require JWT tokens
- Tokens contain user ID and basic profile information
- 24-hour expiration (configurable)

### API Security
- HTTPS enforcement in production
- CORS configuration for frontend integration
- Input validation on all endpoints
- Rate limiting (to be implemented)

## Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up --build

# Scale services
docker-compose up --scale user-service=3
```

### Kubernetes Deployment
```bash
# Apply Kubernetes configurations
kubectl apply -f infrastructure/kubernetes/

# Check deployment status
kubectl get pods
```

## Monitoring and Observability

### Health Checks
- Each service exposes `/actuator/health` endpoint
- Docker health checks configured
- Kubernetes readiness/liveness probes

### Logging
- Structured logging in JSON format
- Centralized log aggregation (ELK stack)
- Request tracing across services

### Metrics
- Spring Boot Actuator metrics
- Custom business metrics
- Prometheus integration ready

## Testing Strategy

### Unit Tests
- JUnit 5 for Java services
- pytest for Python services
- Minimum 80% code coverage

### Integration Tests
- TestContainers for database testing
- MockMVC for web layer testing
- Contract testing between services

### End-to-End Tests
- Full user journey testing
- API integration testing
- Performance testing

## Development Tips

### Adding New Services
1. Create service directory under `backend/`
2. Follow existing service structure
3. Add to `docker-compose.yml`
4. Update API Gateway routes
5. Add health checks and monitoring

### Database Migrations
- Use Flyway for PostgreSQL migrations
- MongoDB schema evolution through application code
- Version control all schema changes

### API Design
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement consistent error responses
- Document APIs with OpenAPI/Swagger

## Troubleshooting

### Common Issues

1. **Service Discovery Issues**
   - Check Docker network connectivity
   - Verify service names in docker-compose.yml

2. **Database Connection Problems**
   - Ensure databases are running
   - Check connection strings in .env
   - Verify network connectivity

3. **JWT Token Issues**
   - Check token expiration
   - Verify JWT secret configuration
   - Ensure proper header format

### Debug Commands

```bash
# Check service logs
docker-compose logs user-service

# Access service shell
docker-compose exec user-service bash

# Database access
docker-compose exec postgres psql -U aureum_user -d aureum_db
docker-compose exec mongodb mongosh aureum_transactions

# Network debugging
docker network ls
docker network inspect aureum_default
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Add tests for new features
5. Update documentation
6. Submit pull request

## Next Steps

1. **Complete Service Implementation**
   - Finish all microservices
   - Implement missing endpoints
   - Add comprehensive error handling

2. **Security Enhancements**
   - OAuth2 integration
   - Rate limiting
   - API versioning

3. **Production Readiness**
   - Kubernetes deployment
   - CI/CD pipeline
   - Monitoring and alerting

4. **Feature Enhancements**
   - Real-time notifications
   - Advanced AI insights
   - Mobile application

For detailed API documentation, see individual service README files.
