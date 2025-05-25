#!/bin/bash

echo "🚀 Setting up PDF Translator Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install main dependencies
echo "📦 Installing main dependencies..."
npm install

# Install additional UI dependencies
echo "🎨 Installing UI components and plugins..."
npm install @radix-ui/react-collapsible @tailwindcss/typography tailwindcss-animate

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "📝 Creating .env file from .env.example..."
        cp .env.example .env
        echo "⚠️  Please edit .env file with your API configuration"
    else
        echo "📝 Creating default .env file..."
        echo "VITE_API_BASE_URL=http://localhost:8000" > .env
    fi
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "🌐 The app will be available at http://localhost:3000"
echo ""
echo "📝 Don't forget to configure your .env file with the correct API URL!" 