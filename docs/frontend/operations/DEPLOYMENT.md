# Deployment Guide

This project is now prepared for full-stack deployment:

- Frontend: Vite/React
- Backend: Spring Boot
- Database: MongoDB Atlas

Recommended stack:

- Frontend on Vercel
- Backend on Render or Railway
- Database on MongoDB Atlas

## 1. MongoDB Atlas

Create a MongoDB Atlas cluster and copy your connection string.

Use a database name like `disaster_relief`.

## 2. Backend Deployment

The backend now supports environment-driven deployment.

Important environment variables:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `APP_KAFKA_ENABLED`

Example values are in [backend/.env.example](backend/.env.example).

If your host supports Docker, deploy from [backend/Dockerfile](backend/Dockerfile).

If your host builds directly from source:

```bash
cd backend
mvn -DskipTests package
java -jar target/disaster-relief-platform-0.0.1-SNAPSHOT.jar
```

Suggested production values:

- `APP_KAFKA_ENABLED=false`
- `CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`

## 3. Frontend Deployment

Create a frontend environment file from [.env.example](.env.example).

Required variable:

- `VITE_API_BASE_URL=https://your-backend-service.example.com/api`

Optional:

- `VITE_ENABLE_DEMO_MODE=false`

Build command:

```bash
npm install
npm run build
```

Output directory:

```bash
dist
```

## 4. First Production Checks

After deployment, verify:

1. The frontend can load.
2. `POST /api/v1/auth/login` works from the deployed UI.
3. `POST /api/v1/emergencies/public/requests` saves to MongoDB Atlas.
4. The request appears on the dashboard.
5. Tracking works with the generated tracking code.

## 5. Important Notes

- Do not commit real `.env` files.
- Set a strong `JWT_SECRET` in production.
- Update `CORS_ALLOWED_ORIGINS` any time your frontend domain changes.
- GitHub Pages alone is not enough for this app because login and request submission need the backend and MongoDB.
