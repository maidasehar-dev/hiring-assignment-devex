# CLAUDE.md — Agent Guidelines

## Project Overview
This repository contains two services:
- **deployment-registry** — C#/.NET 10 API that tracks deployments
- **deployment-insights** — TypeScript/Node.js API that provides analytics

## Repository Structurehiring-assignment-devex/
├── deployment-registry/     # C# Registry API (interviewer provided)
│   └── src/DeploymentRegistry.Api/
├── deployment-insights/     # TypeScript Insights API (candidate built)
│   ├── src/
│   │   ├── app.ts          # Express app with endpoints
│   │   └── server.ts       # Server entry point
│   └── tests/
│       └── insights.test.ts
├── docker-compose.yml       # Runs everything together
├── Makefile                 # Common workflow commands
└── .github/workflows/       # CI Pipeline## How to Run

### Quick Start
```bash
docker-compose up
```

### Manual Start
1. Start MongoDB: `docker start mongodb`
2. Start Registry: `cd deployment-registry/src/DeploymentRegistry.Api && dotnet run`
3. Start Insights: `cd deployment-insights && npm run dev`

## Available Endpoints
- `GET http://localhost:4000/health`
- `GET http://localhost:4000/insights/latest`
- `GET http://localhost:4000/insights/failure-rate`
- `GET http://localhost:4000/insights/frequency`
- `GET http://localhost:5176/api/deployments`

## Running Tests
```bash
cd deployment-insights
npm test
```

## Conventions
- TypeScript strict mode enabled
- All endpoints are stateless
- Data comes from Registry API only
- Environment variables in .env file