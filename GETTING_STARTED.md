# 🏗️ Aureum Platform - Getting Started

Welcome to Aureum, your Open Banking-powered personal finance and investment advisor platform! This guide will help you set up and run the entire microservices platform.

## 🎯 What You've Built

Aureum is a comprehensive financial platform featuring:

- **🔐 User Management**: Secure JWT-based authentication
- **🏦 Open Banking Integration**: Connect to bank accounts via Plaid
- **🤖 AI-Powered Insights**: Machine learning for transaction categorization
- **📊 Investment Advisory**: Personalized portfolio recommendations
- **🔔 Smart Notifications**: Email/SMS alerts and insights
- **⚡ Microservices Architecture**: Scalable, containerized services

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- ☕ Java JDK 17
- 🐍 Python 3.8+
- 🐳 Docker & Docker Compose
- 🔧 Maven
- 🎯 VS Code (recommended)

### 1. Set Up Your Environment

```bash
# Navigate to your project
cd /Users/noahnghg/Aureum

# Set up development environment
./scripts/setup-dev.sh

# Configure your environment
cp .env.example .env
# Edit .env with your API keys and settings
```

### 2. Start the Platform

**Option A: Using VS Code Tasks**
1. Open Command Palette (`Cmd+Shift+P`)
2. Run: `Tasks: Run Task`
3. Select: `Setup Development Environment`
4. Then select: `Start All Services`

**Option B: Using Terminal**
```bash
# Start infrastructure services
docker-compose up -d postgres mongodb rabbitmq redis

# Build and start all services
docker-compose up --build
```

### 3. Verify Installation

Once all services are running, verify they're working:

```bash
# Check API Gateway
curl http://localhost:8080/actuator/health

# Check User Service
curl http://localhost:8081/api/users/health

# Check AI Service
curl http://localhost:5000/health
```

## 🎮 Using the Platform

### 1. Register a New User

```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login and Get JWT Token

```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Access Protected Endpoints

```bash
# Use the JWT token from login response
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛠️ Development Workflow

### Running Individual Services

**Frontend:**
```bash
cd frontend
npm start  # Development server with hot reload
npm run build  # Production build
```

**User Service:**
```bash
cd backend/user-service
mvn spring-boot:run
```

**AI Service:**
```bash
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Running Tests

```bash
# Test User Service
cd backend/user-service
mvn test

# Test AI Service
cd ai-service
python -m pytest tests/  # (add tests as needed)
```

### Using VS Code

The project includes configured:
- **Tasks**: Build, run, and test services
- **Launch Configurations**: Debug Java and Python services
- **Extensions**: Recommended extensions for optimal development

Press `F5` to start debugging the User Service or AI Service.

## 🔧 Service Architecture

### Port Mapping
- **Frontend**: 3000 (React development server)
- **API Gateway**: 8080 (main entry point)
- **User Service**: 8081
- **Open Banking Service**: 8082
- **Data Processing Service**: 8083
- **AI Insights Service**: 8084
- **Investment Advisory Service**: 8085
- **Notification Service**: 8086
- **AI Model Service**: 5000

### Database Connections
- **PostgreSQL**: localhost:5432 (structured data)
- **MongoDB**: localhost:27017 (transaction data)
- **RabbitMQ**: localhost:5672 (messaging)
- **Redis**: localhost:6379 (caching)

## 📊 Monitoring & Management

### Service Health
- **API Gateway**: http://localhost:8080/actuator/health
- **Individual Services**: http://localhost:808X/actuator/health

### RabbitMQ Management
- **URL**: http://localhost:15672
- **Username**: guest
- **Password**: guest

### Database Access
```bash
# PostgreSQL
docker-compose exec postgres psql -U aureum_user -d aureum_db

# MongoDB
docker-compose exec mongodb mongosh aureum_transactions
```

## 🎯 Next Steps

### 1. Complete the Implementation
- Finish Open Banking Service (Plaid integration)
- Implement Data Processing Service
- Build Investment Advisory Service
- Create Notification Service

### 2. Add Frontend (Optional)
```bash
# Create React frontend
npx create-react-app frontend
cd frontend
npm install axios  # for API calls
```

### 3. Access the Frontend

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080/actuator/health
- **User Service**: http://localhost:8081/api/users/health
- **AI Service**: http://localhost:5000/health

The frontend provides a complete user interface with:
- 🔐 User registration and login
- 📊 Financial dashboard with charts and insights
- 💳 Account management and overview
- 📋 Transaction history and filtering
- 🤖 AI-powered financial insights

### 4. Add Frontend (Optional)
```bash
# Create React frontend
npx create-react-app frontend
cd frontend
npm install axios  # for API calls
```

### 4. Production Deployment
- Set up Kubernetes configurations
- Configure CI/CD pipeline
- Add monitoring and alerting
- Implement security enhancements

### 4. API Integration
- Get Plaid API keys: https://plaid.com/docs/
- Set up Twilio for notifications: https://twilio.com
- Configure email service (SendGrid, etc.)

## 🐛 Troubleshooting

### Common Issues

**Services not starting:**
```bash
# Check Docker status
docker ps
docker-compose logs SERVICE_NAME

# Restart services
docker-compose restart
```

**Database connection errors:**
```bash
# Check database logs
docker-compose logs postgres
docker-compose logs mongodb

# Reset databases
docker-compose down -v
docker-compose up -d postgres mongodb
```

**Port conflicts:**
```bash
# Check what's using ports
lsof -i :8080
lsof -i :5432

# Stop conflicting services
sudo kill -9 PID
```

### Development Tips

1. **Hot Reload**: Use `mvn spring-boot:run` for Java services hot reload
2. **Logs**: Use `docker-compose logs -f SERVICE_NAME` to follow logs
3. **Database Reset**: Run `docker-compose down -v` to reset all data
4. **Clean Build**: Use `./scripts/build.sh` for fresh builds

## 📚 Resources

- **Spring Boot Documentation**: https://spring.io/projects/spring-boot
- **Flask Documentation**: https://flask.palletsprojects.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Plaid API**: https://plaid.com/docs/
- **JWT.io**: https://jwt.io/

## 🤝 Contributing

Ready to contribute? Here's how:
1. Check `docs/DEVELOPMENT.md` for detailed development guidelines
2. Follow the established coding standards
3. Add tests for new features
4. Update documentation as needed

---

**🎉 Congratulations!** You now have a fully functional microservices-based financial platform. Start by exploring the User Service and AI Model Service, then gradually implement the remaining services based on your specific requirements.

Happy coding! 🚀
