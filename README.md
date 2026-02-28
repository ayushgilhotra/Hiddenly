# Hiddenly - Discover Hidden Gems 🧭

Hiddenly is a beginner-friendly full-stack web application built for explorers to share and discover secret cafes, budget spots, and quiet nature places across India.

## 🚀 Key Features
- **Exploration**: Browse hidden spots by category (Cafes, Nature, Food, Adventure).
- **Security**: JWT-based login and registration system.
- **Contributions**: Logged-in users can share their own discoveries.
- **Management**: Users can edit or delete spots they have added.
- **Sample Data**: Pre-loaded with 8 realistic Indian hidden gems.

---

## 🛠️ Tech Stack (Beginner Friendly)

### Backend
- **Java 17** & **Spring Boot 3**
- **Spring Data JPA** (Database interaction)
- **Spring Security** & **JWT** (Authentication)
- **MySQL** (Database)
- **Maven** (Dependency management)

### Frontend
- **Vanilla HTML5 & CSS3** (No frameworks)
- **Vanilla JavaScript** (Modern ES6 with `fetch` API)
- **Google Fonts** & **Font Awesome**

---

## 📁 Project Structure
```texts
hiddenly/
├── backend/                  # Spring Boot Project
│   ├── src/main/java/        # Java Source Code
│   ├── src/main/resources/   # App settings and sample data
│   └── pom.xml               # Dependencies
└── frontend/                 # Vanilla Web Frontend
    ├── css/                  # Stylesheets
    ├── js/                   # Logical scripts
    └── *.html                # Interface pages
```

---

## ⚙️ Setup Instructions

### 1. Database Setup (MySQL)
1. Open your MySQL terminal or Workbench.
2. Create a database named `hiddenly_db`:
   ```sql
   CREATE DATABASE hiddenly_db;
   ```
3. Update `backend/src/main/resources/application.properties` with your MySQL `username` and `password`.

### 2. Run the Backend
1. Open the `backend/` folder in your IDE (IntelliJ, Eclipse, or VS Code).
2. Wait for Maven to download dependencies.
3. Run `HiddenlyApplication.java`.
4. The server will start on `http://localhost:8080`.

### 3. Open the Frontend
1. Simply go to the `frontend/` folder.
2. Double-click `index.html` to open it in your browser.
3. **Note**: The backend MUST be running for the frontend to show data.

---

## 🛡️ API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Create a new account | Public |
| POST | `/api/auth/login` | Login and get JWT token | Public |
| GET | `/api/spots` | Get all hidden spots | Public |
| GET | `/api/spots/{id}` | Get details of a spot | Public |
| POST | `/api/spots` | Share a new spot | User |
| PUT | `/api/spots/{id}` | Update a spot | Owner |
| DELETE| `/api/spots/{id}` | Remove a spot | Owner |

---

## 📖 Beginner Friendly Code
This project is designed for learning. You will find:
- **Detailed comments** on every file explaining the "Why".
- **Simple logic** avoids complex design patterns.
- **Clear structure** mapping 1:1 with real-world entities.

Happy Exploring! 🕵️‍♂️
