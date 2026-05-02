.PHONY: up down test seed lint clean help

help:
	@echo "Available commands:"
	@echo "  make up      - Start all services with docker-compose"
	@echo "  make down    - Stop all services"
	@echo "  make test    - Run tests"
	@echo "  make seed    - Seed MongoDB with sample data"
	@echo "  make clean   - Remove containers and volumes"

up:
	docker-compose up --build

down:
	docker-compose down

test:
	cd deployment-insights && npm test

seed:
	docker cp deployment-registry/seed-data.json mongodb:/seed-data.json
	docker exec mongodb mongosh --eval "use deployment-registry; const data = require('/seed-data.json'); db.deployments.insertMany(data);"

clean:
	docker-compose down -v
	cd deployment-insights && rm -rf node_modules dist