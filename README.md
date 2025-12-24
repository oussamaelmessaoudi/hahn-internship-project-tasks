# Task Management System - Microservices Architecture

A full-stack task management application built with **Spring Boot microservices**, **React**, **Docker Compose**, and **PostgreSQL**.

## 🎯 Features

- **Authentication**: JWT-based secure authentication
- **Project Management**: Create, read, update, and delete projects
- **Task Management**: Full CRUD operations for tasks within projects
- **Progress Tracking**: Real-time project progress visualization
- **Search & Filter**: Search tasks by title and filter by status (all/active/completed)
- **Microservices Architecture**: Separate services for auth, projects, and tasks
- **Responsive UI**: Modern, dark-themed interface with gradient accents

## 🛠️ Technology Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **PostgreSQL 15** database
- **JWT** for authentication
- **Maven** for dependency management
- **Docker** for containerization

### Frontend
- **React 18** with **TypeScript**
- **React Router** for navigation
- **Axios** for API communication
- **date-fns** for date formatting
- **Lucide React** for icons

### Infrastructure
- **Docker Compose** for orchestration
- **Nginx** for serving frontend
- **Multi-stage builds** for optimized images

## 📋 Prerequisites

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Java 17** (for local development)
- **Node.js 18+** (for local development)
- **Maven 3.8+** (for local development)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/oussamaelmessaoudi/hahn-internship-project-tasks.git
cd task-management-system
```

### 2. Start the application with Docker Compose

```bash
docker-compose up --build
```

This command will:
- Build all microservices (auth, project, task services)
- Build the React frontend
- Start PostgreSQL database
- Set up networking between services

### 3. Access the application

- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:8081
- **Project Service**: http://localhost:8082
- **Task Service**: http://localhost:8083
- **PostgreSQL**: localhost:5432

### 4. Default Test Credentials

The application starts with an empty database. Create a new account through the registration page.

## 📁 Project Structure

```
.
├── backend/
│   ├── auth-service/          # Authentication microservice
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── pom.xml
│   ├── project-service/       # Project management microservice
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── pom.xml
│   └── task-service/          # Task management microservice
│       ├── src/
│       ├── Dockerfile
│       └── pom.xml
├── frontend/                  # React application
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🔧 Development Setup

### Backend Services

Each microservice can be run independently:

```bash
cd backend/auth-service
mvn spring-boot:run
```

**Environment Variables:**
- `SPRING_DATASOURCE_URL`: PostgreSQL connection string
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT token generation (minimum 256 bits)
- `JWT_EXPIRATION`: Token expiration time in milliseconds

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will run on http://localhost:3000

## 🏗️ Architecture

### Microservices

1. **Auth Service (Port 8081)**
   - User registration and login
   - JWT token generation and validation
   - Password encryption with BCrypt

2. **Project Service (Port 8082)**
   - Project CRUD operations
   - Project search functionality
   - Progress calculation

3. **Task Service (Port 8083)**
   - Task CRUD operations
   - Task completion toggle
   - Task filtering (active/completed)
   - Task search functionality
   - Project statistics

### Database Schema

**Users Table:**
- id (Primary Key)
- email (Unique)
- password (Encrypted)
- name
- created_at

**Projects Table:**
- id (Primary Key)
- title
- description
- user_id (Foreign Key)
- created_at
- updated_at

**Tasks Table:**
- id (Primary Key)
- title
- description
- project_id (Foreign Key)
- due_date
- completed (Boolean)
- created_at
- updated_at

## 🔐 Security

- **JWT Authentication**: All API routes (except login/register) require authentication
- **Password Hashing**: BCrypt with salt for secure password storage
- **CORS Configuration**: Configured for frontend origin
- **Environment Variables**: Sensitive data stored in environment variables

## 🧪 API Endpoints

### Auth Service

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/validate` - Validate JWT token

### Project Service

- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project by ID
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects/search?query={query}` - Search projects

### Task Service

- `GET /api/tasks/project/{projectId}` - Get all tasks for project
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/toggle` - Toggle task completion
- `GET /api/tasks/project/{projectId}/search?query={query}` - Search tasks
- `GET /api/tasks/project/{projectId}/filter?completed={true|false}` - Filter tasks
- `GET /api/tasks/project/{projectId}/stats` - Get project statistics

## 🐳 Docker Configuration

### Services

- **postgres**: PostgreSQL 15 database
- **auth-service**: Authentication microservice
- **project-service**: Project management microservice
- **task-service**: Task management microservice
- **frontend**: React application with Nginx

### Networks

All services run on the `task-network` bridge network for inter-service communication.

### Volumes

- `postgres_data`: Persistent storage for PostgreSQL data

## 🎨 UI Features

- **Dark Theme**: Modern dark interface with purple gradient accents
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Progress**: Visual progress bars for each project
- **Search & Filter**: Instant search and status filtering
- **Modal Forms**: Clean modal dialogs for creating/editing
- **Hover Effects**: Smooth transitions and interactive elements

## 🔄 Data Flow

1. User authenticates → Auth Service generates JWT
2. Frontend stores JWT in localStorage
3. All API requests include JWT in Authorization header
4. Services validate JWT before processing requests
5. Project Service communicates with Task Service for statistics
6. Frontend updates UI in real-time based on API responses

## 📝 Future Enhancements

- [ ] Add pagination for projects and tasks
- [ ] Implement task priorities
- [ ] Add task assignments and collaboration
- [ ] Email notifications for due dates
- [ ] Export projects/tasks to PDF
- [ ] Dark/Light theme toggle
- [ ] Task comments and attachments
- [ ] Activity logs and audit trails

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Author

Built as a technical assessment project demonstrating microservices architecture with Spring Boot and React.

---

**Note**: For production deployment, ensure to:
- Change the JWT secret to a secure random string (minimum 256 bits)
- Update database credentials
- Configure proper environment variables
- Set up SSL/TLS certificates
- Implement rate limiting
- Add comprehensive logging and monitoring
