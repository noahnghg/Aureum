#!/bin/bash

# Aureum Build Script
# This script builds all services for the Aureum platform

set -e

echo "🏗️  Building Aureum Platform..."

# Function to build a service
build_service() {
    local service_name=$1
    local service_path=$2
    
    echo "📦 Building $service_name..."
    cd "$service_path"
    
    if [ -f "pom.xml" ]; then
        # Java service
        echo "  ☕ Building Java service..."
        mvn clean package -DskipTests
    elif [ -f "requirements.txt" ]; then
        # Python service
        echo "  🐍 Building Python service..."
        pip install -r requirements.txt
    elif [ -f "package.json" ]; then
        # Node.js service
        echo "  📱 Building Node.js service..."
        npm install
        npm run build
    fi
    
    # Build Docker image
    if [ -f "Dockerfile" ]; then
        echo "  🐳 Building Docker image for $service_name..."
        docker build -t "aureum/$service_name:latest" .
    fi
    
    cd - > /dev/null
    echo "  ✅ $service_name built successfully"
}

# Build backend services
echo "🏛️  Building Backend Services..."
build_service "user-service" "./backend/user-service"

# Build AI service
echo "🤖 Building AI Service..."
build_service "ai-model-service" "./ai-service"

# Build infrastructure
echo "🏗️  Setting up Infrastructure..."
echo "  📊 Starting databases and message queue..."
docker-compose up -d postgres mongodb rabbitmq redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

echo "🎉 Aureum platform build completed successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'docker-compose up' to start all services"
echo "2. Access the API Gateway at http://localhost:8080"
echo "3. View RabbitMQ management at http://localhost:15672"
echo "4. Check service health endpoints"
