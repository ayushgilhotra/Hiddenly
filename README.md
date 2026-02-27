# Hiddenly - Discover Hidden Gems 🗺️✨

Hiddenly is a digital explorer's journal where users find, share, and explore hidden cafes, budget food spots, and secret local places. Built with a premium "explorer-journal" aesthetic.

## ✨ Features
- **Discover**: Full-screen landing with categories and trending spots.
- **Explore**: Split-view map and list to find spots nearby.
- **Share**: Multi-step journal entry form for new spots.
- **Personal Journal**: Save spots to wishlist and manage your shared entries.
- **Secure**: JWT-based authentication with Access and Refresh tokens.
- **Aesthetic**: Dark charcoal palette with golden accents and frosted glass effects.

## 🛠️ Tech Stack

### Backend
- **Java 17 / Spring Boot 3**: Core framework
- **Spring Security + JWT**: Stateless authentication
- **PostgreSQL**: Primary database
- **Flyway**: Database migrations
- **Cloudinary**: Image management
- **Swagger / OpenAPI**: API Documentation

### Frontend
- **React 18 + Vite**: Modern frontend library and build tool
- **Tailwind CSS**: Utility-first styling
- **TanStack Query (React Query)**: Data fetching and caching
- **Framer Motion**: Premium micro-animations
- **Lucide React**: Iconography

## 🚀 Getting Started

### Prerequisites
- JDK 17+
- Node.js 18+
- **Docker Desktop** (Recommended for easiest database setup)
- Cloudinary Account & Google Maps API Key

### Database Setup (Using Docker)
If you have Docker Desktop installed, you don't need to install PostgreSQL manually:
1. Open a terminal in the project root.
2. Run: `docker-compose up -d`
   - This starts PostgreSQL on port 5432 and **pgAdmin** on port 5050.
   - Database: `hiddenly` | User: `postgres` | Password: `password`

### Backend Setup
1. Navigate to `/backend`
2. Configure your database in `src/main/resources/application.properties` (The defaults already match the Docker setup!)
3. Set environment variables:
   ```env
   DB_PASSWORD=your_password
   JWT_SECRET=your_32_char_secret
   CLOUDINARY_CLOUD_NAME=name
   CLOUDINARY_API_KEY=key
   CLOUDINARY_API_SECRET=secret
   ```
4. Run: `./mvnw spring-boot:run`

### Frontend Setup
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:8080/api
   VITE_GOOGLE_MAPS_KEY=your_key
   ```
4. Run: `npm run dev`

## 📖 Learning Notes
This project is designed for beginners. Every file contains detailed inline comments explaining the software design patterns used:
- **Separation of Concerns**: (Controller -> Service -> Repository)
- **DTO Pattern**: Safe data transfer between layers.
- **Stateless Auth**: Using JWTs over Session IDs.
- **Declarative UI**: React's component-based architecture.

---
Built for Explorers, by Explorers. 🧭
