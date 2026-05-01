# Deployment Insights Service

## Overview
This project builds on top of the Deployment Registry API to provide 
useful deployment metrics and analytics.

## Architecture

## How to Run Everything

### Prerequisites
- Docker Desktop
- Node.js
- .NET 10 SDK

### Start with Docker Compose
```bash
docker-compose up
```

### Or Start Manually

1. Start MongoDB:
```bash
docker start mongodb
```

2. Start Registry API:
```bash
cd deployment-registry/src/DeploymentRegistry.Api
dotnet run
```

3. Start Insights Service:
```bash
cd deployment-insights
npm run dev
```

## Endpoints Implemented

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check including Registry API status |
| GET | /insights/latest | Latest deployed version per service |
| GET | /insights/failure-rate | Failure rate per service and environment |
| GET | /insights/frequency | Deployment frequency per service |

## Decisions and Trade-offs

- **TypeScript** was chosen for the Insights service for fast development
- **Stateless design** — all data comes from Registry API
- **Docker Compose** allows running everything with one command

## What I Would Improve Given More Time

- Add Redis caching to reduce Registry API calls
- Add more detailed error handling
- Add more comprehensive tests
- Implement remaining endpoints (lead-time)

## Running Tests
```bash
cd deployment-insights
npm test
```