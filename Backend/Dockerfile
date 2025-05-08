
# Backend Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

WORKDIR /app

COPY Backend/*.sln .
COPY Backendi/*.csproj ./
RUN dotnet restore

COPY Backend/. .
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime

WORKDIR /app
COPY --from=build /app/out ./

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "Share4Recipe.Api.dll"]
