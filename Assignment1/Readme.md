# 🗒️ Task Manager Application

A simple **full-stack Task Manager** web application built using **React (TypeScript)** for the frontend and **.NET 8 Web API** for the backend.  
This project allows users to **add, view, toggle, and delete tasks**. The backend uses an **in-memory array** instead of a database for simplicity.

---

## 🚀 Tech Stack

### **Frontend**
- React + TypeScript (Vite)
- Tailwind CSS (via CDN)
- Axios for API communication

### **Backend**
- .NET 8 Web API (C#)
- CORS enabled for frontend communication
- In-memory data storage (no database)

---

## 🧩 Features

- ➕ Add new tasks  
- ✅ Mark tasks as complete/incomplete  
- ❌ Delete tasks  
- 🔁 Auto-updated task list  
- 💡 Clean UI with Tailwind styling  
- 🔗 Connected to .NET backend via REST APIs  

---

## 🗂️ Folder Structure

├── TaskManagerApi/ # .NET backend
│ ├── Program.cs
│ ├── Controllers/
│ │ └── TasksController.cs
│ └── Properties/
│ └── launchSettings.json
└── task-manager/ # React frontend
├── src/
│ ├── App.tsx
│ ├── services/
│ │ └── api.ts
│ └── main.tsx
├── index.html
└── package.json

## ⚙️ Setup Instructions

### 🧠 Prerequisites
- Node.js (v18+)
- .NET SDK 8.0+
- npm or yarn

---

### 🖥️ 1. Run the Backend

```bash
cd TaskManagerApi
dotnet run
The server will start at:
👉 http://localhost:5275
```
### 🌐 2. Run the Frontend
```
cd task-manager
npm install
npm run dev
```
Then open your browser at:
👉 http://localhost:5173


 ## 🔌 API Endpoints
| Method | Endpoint          | Description            |
|---------|-------------------|------------------------|
| GET     | `/api/tasks`      | Get all tasks          |
| POST    | `/api/tasks`      | Add a new task         |
| PUT     | `/api/tasks/{id}` | Update (toggle) a task |
| DELETE  | `/api/tasks/{id}` | Delete a task          |


## 💾 Data Model
{
  "id": 1,
  "description": "Complete assignment",
  "isCompleted": false
}