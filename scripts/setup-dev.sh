#!/bin/bash

# Aureum Development Environment Setup
# This script sets up the development environment for Aureum

set -e

echo "🚀 Setting up Aureum Development Environment..."

# Check prerequisites
check_prerequisite() {
    local cmd=$1
    local name=$2
    
    if ! command -v $cmd &> /dev/null; then
        echo "❌ $name is not installed. Please install it first."
        exit 1
    else
        echo "✅ $name is installed"
    fi
}

echo "🔍 Checking prerequisites..."
check_prerequisite "java" "Java JDK 17"
check_prerequisite "mvn" "Maven"
check_prerequisite "python3" "Python 3.8+"
check_prerequisite "docker" "Docker"
check_prerequisite "docker-compose" "Docker Compose"

# Create environment file
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/mongodb
mkdir -p data/rabbitmq

# Start infrastructure services
echo "🏗️  Starting infrastructure services..."
docker-compose up -d postgres mongodb rabbitmq redis

# Wait for databases to be ready
echo "⏳ Waiting for databases to initialize..."
sleep 45

# Run database migrations (placeholder)
echo "📊 Setting up databases..."
echo "  PostgreSQL and MongoDB should be initialized with the provided scripts"

echo "🎉 Development environment setup completed!"
echo ""
echo "Infrastructure services running:"
echo "  • PostgreSQL: localhost:5432"
echo "  • MongoDB: localhost:27017"
echo "  • RabbitMQ: localhost:5672 (Management: http://localhost:15672)"
echo "  • Redis: localhost:6379"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Run './scripts/build.sh' to build services"
echo "3. Start individual services for development"
