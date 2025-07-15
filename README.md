# Aureum - Personal Finance & Investment Advisor

Aureum is a personal finance and investment advisory platform that leverages Open Banking to aggregate users' financial data and provide AI-driven insights and personalized investment recommendations.

## 🎯 Features

- **🔐 Secure Account Aggregation**: Connect to bank accounts via Open Banking APIs
- **📊 Holistic Financial Dashboard**: Unified view of account balances, transactions, and net worth
- **🤖 AI-Powered Categorization & Insights**: Smart transaction categorization and spending insights
- **💰 Goal-Based Investment Recommendations**: Personalized portfolio suggestions based on user goals and risk tolerance
- **📈 Portfolio Tracking**: Monitor simulated investment portfolio performance
- **🔔 Smart Notifications**: Automated email/SMS alerts and insights

## 🏗️ Architecture

The application follows a microservices architecture with the following components:

### Backend Services (Java Spring Boot)
- **API Gateway**: Entry point for all client requests (Port 8080)
- **User Service**: User management, authentication, and profiles (Port 8081)
- **Open Banking Service**: Integration with bank APIs via Plaid (Port 8082)
- **Data Processing Service**: Transaction categorization and data cleaning (Port 8083)
- **AI Insights Service**: ML-powered financial insights coordination (Port 8084)
- **Investment Advisory Service**: Portfolio recommendations and goal tracking (Port 8085)
- **Notification Service**: Email/SMS notifications (Port 8086)

### AI Service (Python Flask)
- **AI Model Service**: Machine learning models for transaction categorization and insights (Port 5000)

### Databases
- **PostgreSQL**: User data, insights, portfolio information
- **MongoDB**: Transaction data and financial records

### Infrastructure
- **RabbitMQ**: Asynchronous messaging between services
- **Redis**: Caching layer
- **Docker**: Containerization
- **Kubernetes**: Orchestration and deployment (ready)

## 🚀 Quick Start

### Prerequisites

- Java JDK 17
- Python 3.8+
- Docker & Docker Compose
- Maven
- VS Code (recommended)

### Setup & Run

1. **Clone and setup:**
   ```bash
   cd /Users/noahnghg/Aureum
   ./scripts/setup-dev.sh
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Start the platform:**
   ```bash
   # Using VS Code: Cmd+Shift+P → "Tasks: Run Task" → "Start All Services"
   # Or using terminal:
   docker-compose up --build
   ```

3. **Verify installation:**
   ```bash
   curl http://localhost:8080/actuator/health  # API Gateway
   curl http://localhost:8081/api/users/health # User Service
   curl http://localhost:5000/health           # AI Service
   ```

### Try the API

1. **Register a user:**
   ```bash
   curl -X POST http://localhost:8080/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:8080/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password123"}'
   ```

3. **Access profile (use JWT token from login):**
   ```bash
   curl -X GET http://localhost:8080/api/users/profile \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## 🛠️ Development

### Project Structure
```
aureum/
├── backend/                  # Java Spring Boot microservices
│   ├── api-gateway/         # Spring Cloud Gateway
│   ├── user-service/        # User management & auth
│   └── ...                  # Other microservices
├── ai-service/              # Python Flask ML service
├── infrastructure/          # Database configs & Kubernetes
├── scripts/                 # Build and setup scripts
├── docs/                    # Documentation
└── docker-compose.yml       # Container orchestration
```

### VS Code Integration

The project includes:
- **🎯 Tasks**: Build, run, test services (Cmd+Shift+P → "Tasks: Run Task")
- **🐛 Debug Configurations**: Debug Java and Python services (F5)
- **📋 Recommended Extensions**: Automatically suggested for optimal development

### Development Commands

**Java Services:**
```bash
cd backend/user-service
mvn spring-boot:run  # Run service
mvn test            # Run tests
mvn clean package   # Build
```

**Python AI Service:**
```bash
cd ai-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py       # Run service
```

**Docker Operations:**
```bash
docker-compose up -d postgres mongodb rabbitmq  # Start infrastructure
docker-compose logs -f user-service              # View logs
docker-compose down -v                           # Reset everything
```

## 🔧 Tech Stack

- **Backend**: Java 17, Spring Boot 3.x, Spring Security 6.x
- **AI**: Python 3.8, Flask, Scikit-learn
- **Databases**: PostgreSQL 14.x, MongoDB 5.x
- **Messaging**: RabbitMQ 3.x
- **Containerization**: Docker 20.x
- **Orchestration**: Kubernetes 1.25+
- **Cloud**: AWS (ready)
- **Frontend**: React 18.x (optional, to be implemented)

## 🔒 Security

- JWT-based authentication across all services
- Secure password hashing with BCrypt
- CORS configuration for frontend integration
- Input validation on all endpoints
- HTTPS enforcement ready for production

## 📊 Monitoring

- **Health Checks**: All services expose `/actuator/health`
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Database Access**: Pre-configured Docker containers
- **Logging**: Structured logging with configurable levels

## 🎯 Implementation Status

### ✅ Completed
- [x] User Service (Registration, Login, Profile management)
- [x] AI Model Service (Transaction categorization, Insights generation)
- [x] API Gateway (Request routing, JWT validation)
- [x] Database schemas (PostgreSQL + MongoDB)
- [x] Docker containerization
- [x] Development environment setup

### 🚧 In Progress / Next Steps
- [ ] Open Banking Service (Plaid integration)
- [ ] Data Processing Service (Transaction processing)
- [ ] AI Insights Service (ML coordination)
- [ ] Investment Advisory Service (Portfolio recommendations)
- [ ] Notification Service (Email/SMS alerts)
- [ ] Frontend application (React)

## 📚 Documentation

- **[Getting Started Guide](GETTING_STARTED.md)**: Complete setup and usage guide
- **[Development Guide](docs/DEVELOPMENT.md)**: Detailed development documentation
- **[API Documentation](docs/API.md)**: REST API reference (to be created)
- **[Deployment Guide](docs/DEPLOYMENT.md)**: Production deployment instructions (to be created)

## 🤝 Contributing

1. Follow the development guidelines in `docs/DEVELOPMENT.md`
2. Use the provided VS Code tasks and configurations
3. Add tests for new features
4. Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details

---

**Ready to transform personal finance with AI? Start with `./scripts/setup-dev.sh` and explore the User Service!** 🚀
