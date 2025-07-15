#!/bin/bash

echo "🚀 Starting Aureum Platform Services Manually..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Please run this script from the Aureum root directory"
    exit 1
fi

echo "📋 This script will help you start services manually without Docker"
echo "Note: You'll need to install databases locally or use Docker for infrastructure only"
echo ""

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "✅ Port $port is in use"
        return 0
    else
        echo "❌ Port $port is not in use"
        return 1
    fi
}

# Check current service status
echo "🔍 Checking current service status..."
echo "Frontend (3000):" && check_port 3000
echo "API Gateway (8080):" && check_port 8080
echo "User Service (8081):" && check_port 8081
echo "AI Service (5000):" && check_port 5000
echo "PostgreSQL (5432):" && check_port 5432
echo "MongoDB (27017):" && check_port 27017
echo "RabbitMQ (5672):" && check_port 5672
echo "Redis (6379):" && check_port 6379
echo ""

echo "📖 Manual Setup Instructions:"
echo "=========================================="
echo ""
echo "1. 🗄️  DATABASES (Choose one option):"
echo "   Option A - Use Docker for databases only:"
echo "   docker run -d --name postgres -p 5432:5432 -e POSTGRES_DB=aureum_db -e POSTGRES_USER=aureum_user -e POSTGRES_PASSWORD=aureum_password postgres:14"
echo "   docker run -d --name mongodb -p 27017:27017 mongo:5.0"
echo "   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management"
echo "   docker run -d --name redis -p 6379:6379 redis:7-alpine"
echo ""
echo "   Option B - Install locally:"
echo "   brew install postgresql mongodb-community rabbitmq redis"
echo ""

echo "2. 🖥️  BACKEND SERVICES:"
echo "   Terminal 1 - API Gateway:"
echo "   cd backend/api-gateway && mvn spring-boot:run"
echo ""
echo "   Terminal 2 - User Service:"
echo "   cd backend/user-service && mvn spring-boot:run"
echo ""
echo "   Terminal 3 - AI Service:"
echo "   cd ai-service && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python app.py"
echo ""

echo "3. 🌐 FRONTEND:"
echo "   Terminal 4 - Frontend (already running):"
echo "   cd frontend && npm start"
echo ""

echo "4. 🔗 ACCESS URLs:"
echo "   Frontend:     http://localhost:3000"
echo "   API Gateway:  http://localhost:8080"
echo "   User Service: http://localhost:8081"
echo "   AI Service:   http://localhost:5000"
echo "   RabbitMQ UI:  http://localhost:15672 (guest/guest)"
echo ""

echo "🎯 QUICK START WITH DOCKER (Infrastructure Only):"
echo "If Docker is available, run this to start just the databases:"
read -p "Start databases with Docker? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting infrastructure services with Docker..."
    docker run -d --name aureum-postgres -p 5432:5432 \
        -e POSTGRES_DB=aureum_db \
        -e POSTGRES_USER=aureum_user \
        -e POSTGRES_PASSWORD=aureum_password \
        postgres:14
    
    docker run -d --name aureum-mongodb -p 27017:27017 mongo:5.0
    
    docker run -d --name aureum-rabbitmq -p 5672:5672 -p 15672:15672 \
        -e RABBITMQ_DEFAULT_USER=guest \
        -e RABBITMQ_DEFAULT_PASS=guest \
        rabbitmq:3-management
    
    docker run -d --name aureum-redis -p 6379:6379 redis:7-alpine
    
    echo "✅ Infrastructure services started!"
    echo "🔍 Checking status in 10 seconds..."
    sleep 10
    
    echo "📊 Service Status:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
fi

echo ""
echo "🎉 Setup complete! Now you can start the backend services manually."
echo "💡 Tip: Use VS Code tasks (Cmd+Shift+P -> Tasks: Run Task) for easier service management."
