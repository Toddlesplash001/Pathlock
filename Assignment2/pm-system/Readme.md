# 🧩 Project Manager System

A **full-stack Project Management System** built using **.NET 8 (C#)** for the backend and **React + TypeScript + Vite** for the frontend.  
It allows users to **register, log in, create projects, manage tasks, and toggle task completion** — all with JWT-based authentication and RESTful APIs.

---

## 🚀 Tech Stack

### **Backend (PmBackend)**
- ASP.NET Core 8 Web API  
- Entity Framework Core (InMemory Database)  
- JWT Authentication  
- Swagger (API Documentation)  
- CORS Enabled for React Frontend  

### **Frontend (PmFrontend)**
- React 18 + TypeScript  
- Vite  
- Axios for API requests  
- React Router for navigation  
- Tailwind CSS (optional, for styling)

---

## ⚙️ Features

### 👤 **Authentication**
- Register new users  
- Login and get JWT token  
- JWT is stored in localStorage and reused for API calls  

### 📁 **Projects**
- Create and delete projects  
- Fetch list of projects  
- Fetch project details (with tasks)  

### ✅ **Tasks**
- Add, update, delete tasks within a project  
- Toggle task completion  
- Tasks automatically load along with project details  

### 💡 **Frontend Features**
- Responsive UI with navigation bar  
- Protected routes using JWT  
- Form validation & error handling  
- Dynamic project/task updates without page refresh  

---

## 🧱 Project Structure

### **Backend**
PmBackend/
├── Controllers/
│ ├── AuthController.cs
│ ├── ProjectsController.cs
│ └── TasksController.cs
├── DTOs/
│ ├── UserDto.cs
│ ├── ProjectDto.cs
│ └── TaskDto.cs
├── Services/
│ ├── AuthService.cs
│ ├── ProjectService.cs
│ └── TaskService.cs
├── Data/
│ └── AppDbContext.cs
├── Program.cs
└── appsettings.json

### **Frontend**
PmFrontend/
├── src/
│ ├── api/
│ │ └── api.ts
│ ├── components/
│ │ └── Navbar.tsx
│ ├── pages/
│ │ ├── Login.tsx
│ │ ├── Register.tsx
│ │ ├── Dashboard.tsx
│ │ └── ProjectDetails.tsx
│ ├── layouts/
│ │ └── MainLayout.tsx
│ ├── App.tsx
│ └── main.tsx
└── tsconfig.json

---

## 🔑 API Endpoints

### **Auth**
| Method | Endpoint | Description |
|:------:|:---------|:-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login and get JWT token |

### **Projects**
| Method | Endpoint | Description |
|:------:|:----------|:-------------|
| `GET` | `/api/projects` | Get all projects |
| `POST` | `/api/projects` | Create new project |
| `GET` | `/api/projects/{id}` | Get project details (with tasks) |
| `DELETE` | `/api/projects/{id}` | Delete project |

### **Tasks**
| Method | Endpoint | Description |
|:------:|:----------|:-------------|
| `POST` | `/api/projects/{projectId}/tasks` | Add new task to a project |
| `PUT` | `/api/tasks/{taskId}` | Update or toggle task completion |
| `DELETE` | `/api/tasks/{taskId}` | Delete a task |

---

## 🧠 Example Request Bodies

### **Register**
```json
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "password123"
}
Login
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
Create Project
POST /api/projects
{
  "name": "AI Research Dashboard"
}
Add Task
POST /api/projects/1/tasks
{
  "title": "Build model training pipeline"
}
Update Task
PUT /api/tasks/3
{
  "isCompleted": true
}
## 🧭 Frontend Navigation Flow
Page	Route	Description
Register	/register	User signup form
Login	/login	Login form
Dashboard	/	List of projects
Project Details	/projects/:id	Shows project tasks and allows adding/updating/deleting
⚡ Running Locally
1️⃣ Backend Setup
cd PmBackend
dotnet restore
dotnet run
➡️ Runs on: https://localhost:5094 (Swagger enabled)
2️⃣ Frontend Setup
cd PmFrontend
npm install
npm run dev
➡️ Runs on: http://localhost:5173
🔐 Environment Variables
PmBackend/appsettings.json
"Jwt": {
  "Key": "supersecretkey12345",
  "Issuer": "PmBackend",
  "Audience": "PmFrontend"
}
🔄 CORS Configuration (Backend)
Enabled in Program.cs:
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
🧰 Tools & Libraries Used
Backend
Microsoft.AspNetCore.Authentication.JwtBearer
Microsoft.EntityFrameworkCore.InMemory
Swashbuckle.AspNetCore (Swagger)
Frontend
react-router-dom
axios
vite
typescript
tailwindcss (optional)
🧑‍💻 Author
Kuwar Jain
📍 Built as part of a full-stack assignment
💡 Stack: .NET + React + TypeScript
📸 Screenshots (Optional)
Add:
Register/Login Page
Dashboard Page
Project Detail Page (tasks view)
🧾 License
This project is licensed under the MIT License.

## ⭐ Summary
🔹 Full-stack project management web app
🔹 Secure JWT authentication
🔹 In-memory EF backend with CORS
🔹 React + TypeScript frontend with modular architecture
🔹 Ideal for showcasing full-stack skills (ASP.NET + React)