# 3-Tier Microservices Application

A learning-focused 3-tier application with:

- Frontend: Angular
- Backend: ASP.NET Core 8 Web API
- Microservices:
  - User Service
  - Order Service
- Database: SQL Server
- No Docker, Docker Compose, Terraform, Kubernetes, or AWS deployment files are included.

## Architecture

Angular Frontend
    |
    +--> User Service (.NET 8)
    |       |
    |       +--> SQL Server / AppDb
    |
    +--> Order Service (.NET 8)
            |
            +--> SQL Server / AppDb

The two services use separate databases logically through separate database names:
- MicroservicesUsersDb
- MicroservicesOrdersDb

## Prerequisites

- Node.js 20+
- Angular CLI 18+
- .NET 8 SDK
- SQL Server 2019/2022 or SQL Server Express/Developer
- SQL Server Management Studio or Azure Data Studio

## 1. Create databases

Run:

database/create-databases.sql

Then update the connection strings in:

backend/UserService/appsettings.json
backend/OrderService/appsettings.json

Default connection string assumes local SQL Server:

Server=localhost;Database=...;Trusted_Connection=True;TrustServerCertificate=True;

If you use SQL Server Express, change Server=localhost to:
localhost\\SQLEXPRESS

If using SQL authentication, replace the connection string with your SQL username/password.

## 2. Run User Service

cd backend/UserService
dotnet restore
dotnet run

Default URL:
http://localhost:5001

Swagger:
http://localhost:5001/swagger

## 3. Run Order Service

Open another terminal:

cd backend/OrderService
dotnet restore
dotnet run

Default URL:
http://localhost:5002

Swagger:
http://localhost:5002/swagger

## 4. Run Angular frontend

Open another terminal:

cd frontend
npm install
ng serve

Open:
http://localhost:4200

The Angular application calls:
- http://localhost:5001/api/users
- http://localhost:5002/api/orders

## Test flow

1. Open the Angular application.
2. Create users.
3. Create orders using a user ID.
4. View users and orders.
5. Test the APIs directly using Swagger.

## Important

This project intentionally contains application source code only.

You can later create your own:
- Dockerfiles
- Docker Compose
- Docker networks
- Docker volumes
- Docker Hub repositories
- GitHub repository
- GitHub Actions pipeline
- AWS EC2 deployment
- Reverse proxy
- HTTPS
- Kubernetes manifests
- Terraform infrastructure

That is intentional so you can practice implementing the deployment side yourself.
