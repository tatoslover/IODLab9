#!/bin/bash

# Enhanced Calculator MVC - Startup Script
# This script provides easy commands to start, test, and manage the calculator application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PORT=3004
APP_NAME="Enhanced Calculator MVC"

# Functions
print_header() {
    echo -e "${BLUE}=============================================${NC}"
    echo -e "${BLUE}  $APP_NAME - Startup Script${NC}"
    echo -e "${BLUE}=============================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 14.0.0 or higher."
        exit 1
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2)
    print_success "Node.js version: $NODE_VERSION"
}

check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi

    NPM_VERSION=$(npm --version)
    print_success "npm version: $NPM_VERSION"
}

install_dependencies() {
    print_info "Installing dependencies..."
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

check_port() {
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port $PORT is already in use"
        print_info "Attempting to kill existing process..."

        PID=$(lsof -ti:$PORT)
        if kill -9 $PID 2>/dev/null; then
            print_success "Existing process killed"
            sleep 2
        else
            print_error "Could not kill existing process. Please manually stop the process using port $PORT"
            exit 1
        fi
    fi
}

start_server() {
    print_info "Starting $APP_NAME server on port $PORT..."

    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Make sure you're in the correct directory."
        exit 1
    fi

    # Start the server
    if [ "$1" = "dev" ]; then
        print_info "Starting in development mode with auto-restart..."
        npm run dev
    else
        print_info "Starting in production mode..."
        npm start
    fi
}

run_tests() {
    print_info "Running test suite..."
    if npm test; then
        print_success "All tests passed!"
    else
        print_error "Some tests failed"
        return 1
    fi
}

health_check() {
    print_info "Performing health check..."
    sleep 3  # Wait for server to start

    if curl -f http://localhost:$PORT/health > /dev/null 2>&1; then
        print_success "Server is healthy and responding"
        print_info "Calculator Interface: http://localhost:$PORT"
        print_info "API Documentation: http://localhost:$PORT/api"
        print_info "Health Check: http://localhost:$PORT/health"
    else
        print_warning "Health check failed - server may still be starting"
    fi
}

show_help() {
    echo -e "${BLUE}Usage: $0 [OPTION]${NC}"
    echo ""
    echo "Options:"
    echo "  start, -s         Start the server in production mode"
    echo "  dev, -d           Start the server in development mode with auto-restart"
    echo "  test, -t          Run the test suite"
    echo "  install, -i       Install dependencies only"
    echo "  health, -h        Check server health"
    echo "  setup             Full setup (install + start)"
    echo "  clean             Clean install (remove node_modules and reinstall)"
    echo "  help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start production server"
    echo "  $0 dev            # Start development server"
    echo "  $0 test           # Run tests"
    echo "  $0 setup          # Full setup and start"
}

clean_install() {
    print_info "Performing clean installation..."

    if [ -d "node_modules" ]; then
        print_info "Removing existing node_modules..."
        rm -rf node_modules
    fi

    if [ -f "package-lock.json" ]; then
        print_info "Removing package-lock.json..."
        rm -f package-lock.json
    fi

    install_dependencies
}

# Main script logic
print_header

case "${1:-start}" in
    "start" | "-s")
        check_node
        check_npm
        check_port
        if [ ! -d "node_modules" ]; then
            install_dependencies
        fi
        start_server
        ;;
    "dev" | "-d")
        check_node
        check_npm
        check_port
        if [ ! -d "node_modules" ]; then
            install_dependencies
        fi
        start_server "dev"
        ;;
    "test" | "-t")
        check_node
        check_npm
        if [ ! -d "node_modules" ]; then
            install_dependencies
        fi
        run_tests
        ;;
    "install" | "-i")
        check_node
        check_npm
        install_dependencies
        ;;
    "health" | "-h")
        health_check
        ;;
    "setup")
        check_node
        check_npm
        install_dependencies
        check_port
        start_server &
        SERVER_PID=$!
        health_check
        print_success "Setup complete! Server is running (PID: $SERVER_PID)"
        print_info "Press Ctrl+C to stop the server"
        wait $SERVER_PID
        ;;
    "clean")
        check_node
        check_npm
        clean_install
        print_success "Clean installation complete"
        ;;
    "help" | "--help")
        show_help
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
