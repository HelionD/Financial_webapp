# Advanced Financial Dashboard

A real-time financial dashboard with candlestick charts for Forex, Cryptocurrencies, Stocks, and Commodities.

## Features

- **Candlestick Charts**: Professional trading charts using TradingView's lightweight charts
- **Real-time Data**: Live market data from Alpha Vantage and Yahoo Finance APIs
- **Multiple Markets**: Forex, Cryptocurrencies, Stocks, and Commodities
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-refresh**: Updates every 30 seconds

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: TradingView Lightweight Charts
- **HTTP Client**: Axios
- **Styling**: Font Awesome icons


## Development Workflow
This project is being developed in three main stages:

### 1. Development (**Current Stage**)

- **CI/CD**: GitHub Actions for fast builds, testing, and feedback loops.
- **Infrastructure**: Local environment with Docker for containerization.
- **IaC / Cloud**: Early setup using Terraform for provisioning dev cloud resources (small AWS EC2 instance + S3 for static files and log archiving)
*Logs in S3 are temporary for early testing; full observability with Prometheus & Grafana is planned.*
- **Focus**: Rapidly prototype new features and validate API integrations.

### 2. Testing (**Planned**) 

- **CI/CD**: GitHub Actions with extended test pipelines (unit, integration, and security tests).
- **Infrastructure**: Kubernetes (minikube) for staging cluster deployments.
- **IaC / Cloud**: Terraform + Ansible for automated provisioning of testing environments in AWS.
- **Focus**: Reliability, scaling tests, and monitoring with Prometheus + Grafana.

### 3. Production (**Planned**)
- **CI/CD**: Jenkins pipelines for controlled and stable enterprise-grade deployments.
- **Infrastructure**: Kubernetes cluster on AWS (EKS) or a hybrid setup with high availability.
- **IaC / Cloud**: Complete IaC automation using Terraform and Ansible for configuration management, with AWS S3/CloudWatch for logging and monitoring.
- **Focus**: Security hardening, disaster recovery setup, and cost optimization.

#### What's being worked on:

- Adding a database.
- Updating the UI.
- Adding Terraform for Dev Environment.

##### NOTE

This project is under construction 🚧.
