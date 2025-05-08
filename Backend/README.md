
# Share4Recipe Backend

This is the backend for the Share4Recipe application built with ASP.NET Core 7.0.

## Project Structure

- `Share4Recipe.Api` - Main API project
  - `Controllers` - API Controllers
  - `Services` - Business logic
  - `Models` - Domain models
  - `DTOs` - Data Transfer Objects
  - `Data` - Database context and configurations

## Setup

### Prerequisites

- .NET 7.0 SDK
- PostgreSQL

### Environment Variables

The application requires the following environment variables:

- `CONNECTION_STRING`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation

### Running the Application

```bash
cd Backend
dotnet restore
dotnet run --project Share4Recipe.Api
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login an existing user
- `GET /api/users/me` - Get current user info (requires authentication)

### Recipes

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/{id}` - Get a specific recipe by ID
- `GET /api/recipes/user` - Get recipes for the current user (requires authentication)
- `POST /api/recipes` - Create a new recipe (requires authentication)
- `PUT /api/recipes/{id}` - Update a recipe (requires authentication)
- `DELETE /api/recipes/{id}` - Delete a recipe (requires authentication)
