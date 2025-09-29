# Advanced Financial Dashboard

A real-time financial dashboard with candlestick charts for Forex, Cryptocurrencies, Stocks, and Commodities built with modern DevOps practices and progressive architecture evolution.

## 🚀 Features

- **Real-time Market Data**: Live market data with candlestick charts using TradingView's lightweight charts
- **Multi-Asset Support**: Forex, Cryptocurrencies, Stocks, and Commodities
- **Professional Charts**: Interactive trading charts with OHLC data
- **Responsive Design**: Mobile-first design that works across all devices
- **Auto-refresh**: Real-time updates every 30 seconds
- **Market Analytics**: Live market statistics and trending analysis

## 🛠️ Technologies Used

- **Backend**: Flask (Python 3.10)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: TradingView Lightweight Charts
- **HTTP Client**: Axios for API communication
- **Styling**: Font Awesome icons, Custom CSS
- **Containerization**: Docker & Docker Compose
- **Infrastructure**: Terraform (Infrastructure as Code)
- **CI/CD**: GitHub Actions

## 🏗️ Architecture Overview

### Step 1: Monolithic Application (Current)
This project starts as a **monolithic Flask application** to establish solid DevOps foundations before evolving into microservices.

**Current Architecture:**
```
Client (Browser) → Flask App → In-Memory Data Store
                     ↓
                Mock Market Data APIs
```

### Step 2: Microservices Evolution (Future)
After establishing infrastructure patterns, the application will be decomposed into microservices:

**Future Architecture:**
```
Client → API Gateway → ┌── Auth Service → Database
                      ├── Market Data Service → Database  
                      ├── Chart Service → Cache/Storage
                      ├── Analytics Service → Database
                      └── Notification Service → Message Queue
```

## 📋 Development Workflow

This project follows a **three-stage progressive DevOps approach**:

### 🔧 1. Development Environment (**Done**)

**Purpose**: Fast development cycles and feature validation

**Infrastructure:**
- **Compute**: Single AWS EC2 instance (t2.micro)
- **Storage**: In-memory data (no database)
- **Networking**: Basic VPC with public subnet
- **Security**: SSH access from every IP, used for general Dev Environment deployments
- **CI/CD**: GitHub Actions for rapid builds and deployment
- **IaC**: Terraform modules for AWS resources (VPC, EC2, S3, IAM)

**Focus Areas:**
- ✅ Rapid prototyping and feature development
- ✅ API integrations and data flow validation
- ✅ Basic containerization with Docker
- ✅ Terraform module structure establishment

### 🧪 2. QA Environment (**Current Phase**)

**Purpose**: Kubernetes adoption and monitoring excellence

**Infrastructure:**
- **Compute**: Amazon EKS cluster with managed node groups
- **Storage**: Still in-memory (maintaining Step 1 simplicity)
- **Networking**: Multi-AZ deployment with private/public subnets
- **Monitoring**: Prometheus + Grafana (comprehensive observability)
- **Logging**: FluentD → CloudWatch Logs
- **CI/CD**: Enhanced GitHub Actions with Kubernetes deployment
- **Testing**: Load testing and performance validation

**Focus Areas:**
- 🎯 Use Kubernetes in a safe environment
- 🎯 Establish monitoring and observability patterns
- 🎯 Container orchestration expertise
- 🎯 **GitHub Actions** with Kubernetes deployments
- 🎯 Performance testing and optimization

### 🏭 3. Production Environment (**Future**)

**Purpose**: Security hardening and high availability

**Infrastructure:**
- **Compute**: Multi-AZ EKS cluster with auto-scaling
- **Storage**: Same application (battle-tested from QA)
- **Networking**: Private subnets, VPC endpoints, NAT gateways
- **Security**: AWS WAF, Kubernetes RBAC, Network Policies
- **Load Balancing**: Application Load Balancer with SSL termination
- **Monitoring**: Inherited from QA + business metrics
- **CI/CD**: Jenkins with approval gates, security scanning, and production deployment pipelines

**Focus Areas:**
- 🎯 Security hardening and compliance
- 🎯 High availability and disaster recovery
- 🎯 Production-grade monitoring and alerting
- 🎯 **Enterprise CI/CD** with Jenkins and approval workflows
- 🎯 Cost optimization and performance

## 🚧 Current Development Status

### ✅ Completed
- Flask application with market data APIs
- Docker containerization
- Terraform infrastructure modules (VPC, EC2, S3, IAM)
- GitHub Actions CI/CD pipeline
- Basic error handling and logging

### 🔄 In Progress
- Terraform configuration fixes and validation
- Enhanced monitoring and health checks
- Documentation and deployment guides

### 📋 Upcoming
- QA environment with EKS cluster
- Prometheus + Grafana monitoring stack
- Load testing framework
- Production security hardening

## 🏃‍♂️ Quick Start

### Prerequisites
- Python 3.10+
- Docker & Docker Compose
- AWS CLI configured
- Terraform >= 1.0

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd financial-dashboard

# Run with Docker Compose
docker-compose -f docker-compose.dev.yml up --build

# Or run locally
pip install -r requirements.txt
python app.py
```

Access the dashboard at `http://localhost:5000`

### Infrastructure Deployment
```bash
# Navigate to dev environment
cd terraform/dev

# Initialize Terraform
terraform init

# Plan deployment (review changes)
terraform plan -var-file="dev.tfvars"

# Deploy infrastructure
terraform apply -var-file="dev.tfvars"
```

## 📊 API Endpoints

|-------------------------------------|-------|--------------------------------------|
|               Endpoint              |Method |             Description              |
|-------------------------------------|-------|--------------------------------------|
| `/`                                 |  GET  | Main dashboard interface             |
| `/api/prices`                       |  GET  | Current market prices for all assets |
| `/api/historical/<market>/<symbol>` |  GET  | Historical OHLC data                 |
| `/api/news`                         |  GET  | Latest financial news                |
| `/api/market-stats`                 |  GET  | Overall market statistics            |
| `/api/watchlist`                    |  GET  | User watchlist (mock data)           |
|-------------------------------------|-------|--------------------------------------|

## 🌟 Step 2: Microservices Transformation

### Planned Service Decomposition
1. **Authentication Service**: User management and JWT tokens
2. **Market Data Service**: Real-time price feeds and historical data
3. **Chart Service**: OHLC data processing and chart generation
4. **Analytics Service**: Market statistics and trend analysis
5. **Notification Service**: Alerts and real-time updates
6. **API Gateway**: Request routing and rate limiting

### Database Strategy (Step 2)
- **PostgreSQL**: User data, watchlists, preferences
- **TimescaleDB**: Time-series market data
- **Redis**: Caching and session management
- **MongoDB**: News articles and unstructured data

### Service Communication
- **Synchronous**: REST APIs with OpenAPI documentation
- **Asynchronous**: Apache Kafka for event streaming
- **Service Discovery**: Kubernetes native service discovery
- **Configuration**: Kubernetes ConfigMaps and Secrets

## 🔐 Security Considerations

### Current (Development)
- Environment variable management
- Basic input validation
- CORS configuration

### QA Environment
- Kubernetes RBAC
- Network segmentation testing
- Container security scanning

### Production
- AWS WAF integration
- SSL/TLS everywhere
- Secrets management (AWS Secrets Manager)
- Regular security audits and compliance

## 📈 Monitoring & Observability Roadmap

### Development
- Basic application logs
- Simple health checks

### QA (Monitoring Excellence)
- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **FluentD**: Log aggregation
- **Kubernetes metrics**: Cluster and application monitoring
- **AWS clodwatch**: Cloud Monitoring

### Production
- Inherited monitoring from QA
- Business metrics and KPIs
- Alerting and incident response
- Performance monitoring

## 📝 License

This project is for educational and portfolio purposes, demonstrating modern DevOps practices and progressive architecture evolution.

---

**Note**: This is Step 1 of a two-phase project focusing on establishing DevOps excellence before architectural complexity. The monolithic approach allows for rapid iteration and learning while building the foundation for future microservices evolution.
