# ADET To-Do List Application

A modern, full-stack to-do list application built with **Next.js**, **React**, **TypeScript**, **MySQL**, and **Tailwind CSS**. This application allows users to create, manage, organize, and track their tasks with features like task categorization, priority levels, Pomodoro timer, and completion heatmaps.

## Features

✨ **Core Features:**
- **User Authentication** - Secure signup and login with password hashing (bcryptjs)
- **Task Management** - Create, read, update, and delete tasks
- **Task Organization** - Categorize tasks (Personal, School, Work, Fitness, Others)
- **Priority Levels** - Set tasks as Low, Medium, or High priority
- **Task Status Tracking** - Track task status (Pending, In-Progress, Completed)
- **Dashboard** - Personalized user dashboard with task summaries
- **Pomodoro Timer** - Built-in Pomodoro timer for productivity tracking
- **Task Completion Heatmap** - Visual representation of task completion over time
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Time-based Greeting** - Dynamic greetings based on time of day

## Project Structure

```
ADET/
├── app/
│   ├── api/                          # API Routes (Backend)
│   │   ├── debug/
│   │   │   └── db-test/             # Database connection testing
│   │   ├── login/                    # User authentication (READ)
│   │   ├── signup/                   # User registration (CREATE)
│   │   ├── settings/                 # User settings
│   │   ├── tasks/                    # Task operations
│   │   │   ├── route.ts             # GET (READ) & POST (CREATE) tasks
│   │   │   └── [id]/
│   │   │       └── route.ts         # PUT (UPDATE) & DELETE operations
│   │   └── test/                     # Testing endpoints
│   ├── components/                   # Reusable React Components
│   │   ├── DashboardGreetingSection.tsx
│   │   ├── PomodoroTimerSection.tsx
│   │   ├── SidebarNavigationSection.tsx
│   │   ├── TaskCompletionHeatmapSection.tsx
│   │   ├── TaskModal.tsx
│   │   ├── TaskSummarySection.tsx
│   │   ├── TaskTrackerSection.tsx
│   │   └── TimeOfDaySection.tsx
│   ├── dashboard/                    # Dashboard page
│   ├── login/                        # Login page
│   ├── mytasks/                      # My Tasks page
│   ├── pomodoro/                     # Pomodoro timer page
│   ├── settings/                     # Settings page
│   ├── signup/                       # Signup page
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   └── globals.css                   # Global styles
├── lib/
│   └── db.ts                         # MySQL database connection utility
├── public/
│   └── fonts/                        # Custom fonts
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.mjs                # PostCSS configuration
├── eslint.config.mjs                 # ESLint configuration
└── README.md                         # Project documentation
```

## CRUD Operations Guide

### **CREATE (POST)**

#### Create a New Task
**Endpoint:** `POST /api/tasks`

**Request Body:**
```json
{
  "userId": "1",
  "name": "Complete project",
  "description": "Finish the ADET application",
  "category": "Work",
  "priority": "High",
  "status": "Pending"
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "taskId": 123
}
```

**Location:** [app/api/tasks/route.ts](app/api/tasks/route.ts)

---

#### Create a New User Account
**Endpoint:** `POST /api/signup`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "accountPassword": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": 1,
  "username": "john_doe"
}
```

**Location:** [app/api/signup/route.ts](app/api/signup/route.ts)

---

### **READ (GET)**

#### Retrieve All Tasks for a User
**Endpoint:** `GET /api/tasks?userId=1`

**Response:**
```json
{
  "tasks": [
    {
      "TaskID": 1,
      "TaskName": "Complete project",
      "TaskDesc": "Finish the ADET application",
      "TaskCategory": "Work",
      "PriorityLevel": "High",
      "TaskStatus": "In-Progress",
      "DateCompleted": null
    }
  ]
}
```

**Location:** [app/api/tasks/route.ts](app/api/tasks/route.ts)

---

#### User Login (Read User Authentication)
**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "accountPassword": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "userId": 1,
  "username": "john_doe"
}
```

**Location:** [app/api/login/route.ts](app/api/login/route.ts)

---

### **UPDATE (PUT)**

#### Update Task Status and Completion Date
**Endpoint:** `PUT /api/tasks/[id]`

**Request Body (Status Update):**
```json
{
  "status": "Completed",
  "dateCompleted": "2024-01-15"
}
```

**Response:**
```json
{
  "message": "Task updated successfully",
  "taskId": 1
}
```

#### Update Full Task Details
**Request Body (Full Edit):**
```json
{
  "name": "Updated task name",
  "description": "Updated description",
  "category": "School",
  "priority": "Medium"
}
```

**Location:** [app/api/tasks/[id]/route.ts](app/api/tasks/[id]/route.ts)

---

### **DELETE**

#### Delete a Task
**Endpoint:** `DELETE /api/tasks/[id]`

**Response:**
```json
{
  "message": "Task deleted successfully",
  "taskId": 1
}
```

**Location:** [app/api/tasks/[id]/route.ts](app/api/tasks/[id]/route.ts)

---

## Tech Stack

### **Frontend:**
- **React 19.2.4** - UI library
- **Next.js 16.2.7** - React framework with built-in routing
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS 4** - CSS processing

### **Backend:**
- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - JavaScript runtime

### **Database:**
- **MySQL** - Relational database
- **mysql2/promise** - MySQL client for Node.js with Promise support

### **Security & Authentication:**
- **bcryptjs 3.0.3** - Password hashing and encryption

### **Development Tools:**
- **ESLint 9** - Code linting
- **TypeScript** - Type checking

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL Server running locally or remotely

### Step 1: Clone and Install Dependencies

```bash
cd ADET
npm install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the project root and add your database credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=todo_app
DB_USER=root
DB_PASSWORD=your_password_here
```

### Step 3: Create Database Tables

Create the following tables in your MySQL database:

#### Users Table
```sql
CREATE TABLE Users (
  UserID INT PRIMARY KEY AUTO_INCREMENT,
  Username VARCHAR(100) NOT NULL UNIQUE,
  Email VARCHAR(100) NOT NULL UNIQUE,
  AccountPassword VARCHAR(255) NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tasks Table
```sql
CREATE TABLE Tasks (
  TaskID INT PRIMARY KEY AUTO_INCREMENT,
  UserID INT NOT NULL,
  TaskName VARCHAR(200) NOT NULL,
  TaskDesc TEXT,
  TaskCategory ENUM('Personal', 'School', 'Work', 'Fitness', 'Others') NOT NULL,
  PriorityLevel ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  TaskStatus ENUM('Pending', 'In-Progress', 'Completed') NOT NULL DEFAULT 'Pending',
  DateCompleted DATE NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Usage

### 1. **Sign Up**
   - Navigate to `/signup`
   - Enter username, email, and password
   - Password must be at least 6 characters

### 2. **Log In**
   - Navigate to `/login`
   - Enter your email and password

### 3. **Dashboard**
   - View task summary and greeting
   - See task completion heatmap
   - Quick access to Pomodoro timer

### 4. **Create Tasks** (`/mytasks`)
   - Click "Add Task" button
   - Fill in task details (name, description, category, priority)
   - Tasks default to "Pending" status

### 5. **Manage Tasks**
   - Update task status (Pending → In-Progress → Completed)
   - Edit task details
   - Delete tasks

### 6. **Pomodoro Timer** (`/pomodoro`)
   - Use the built-in Pomodoro timer for productivity
   - 25-minute work sessions with 5-minute breaks

### 7. **Settings** (`/settings`)
   - Manage user account settings

## API Endpoints Summary

| Method | Endpoint | Purpose | Location |
|--------|----------|---------|----------|
| POST | `/api/tasks` | Create new task | [app/api/tasks/route.ts](app/api/tasks/route.ts) |
| GET | `/api/tasks?userId=ID` | Get all user tasks | [app/api/tasks/route.ts](app/api/tasks/route.ts) |
| PUT | `/api/tasks/[id]` | Update task | [app/api/tasks/[id]/route.ts](app/api/tasks/[id]/route.ts) |
| DELETE | `/api/tasks/[id]` | Delete task | [app/api/tasks/[id]/route.ts](app/api/tasks/[id]/route.ts) |
| POST | `/api/signup` | Register new user | [app/api/signup/route.ts](app/api/signup/route.ts) |
| POST | `/api/login` | User login | [app/api/login/route.ts](app/api/login/route.ts) |

## Error Handling

The API includes comprehensive error handling:
- **400 Bad Request** - Missing or invalid required fields
- **401 Unauthorized** - Invalid login credentials
- **500 Internal Server Error** - Database connection or server errors

Error responses include:
```json
{
  "error": "Error message",
  "message": "Detailed message",
  "code": "Error code",
  "errno": "Error number"
}
```

## Database Connection

The application uses the `getConnection()` utility function from [lib/db.ts](lib/db.ts):

```typescript
import { getConnection } from "@/lib/db";

const connection = await getConnection();
const [result] = await connection.execute("SQL_QUERY", [params]);
await connection.end();
```

**Note:** Ensure environment variables are properly configured before running the application.

## Security Features

✅ Password hashing with bcryptjs  
✅ SQL prepared statements to prevent SQL injection  
✅ Email validation for signup  
✅ Password strength requirements (minimum 6 characters)  
✅ Secure database connection with environment variables  

## Development Notes

- All API routes use TypeScript for type safety
- Console logging is implemented for debugging in development mode
- The application uses Next.js 16 with App Router
- Tailwind CSS is configured for styling
- MySQL connection is pooled for better performance

## Future Enhancements

- [ ] Email notifications for task reminders
- [ ] Task sharing and collaboration
- [ ] Advanced filtering and search
- [ ] Dark mode support
- [ ] Task recurring/recurring tasks
- [ ] Calendar view for tasks
- [ ] Task attachment support
- [ ] Notification system
- [ ] User profile customization
- [ ] Analytics and insights

## Troubleshooting

### Database Connection Error
- Verify MySQL server is running
- Check `.env.local` file for correct credentials
- Ensure database and tables are created

### Port Already in Use
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### Module Not Found
```bash
npm install
rm -rf node_modules package-lock.json
npm install
```

## License

This project is created for COMP 019 - Applications Development and Emerging Technologies at PUP.

## Contact & Support

For questions or issues, please contact your instructor or refer to the project documentation.

---

**Last Updated:** January 2026  
**Version:** 1.0.0
