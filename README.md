# Smart Learning Platform — Frontend

A modern web app for managing online learning — with role-based access for **Students, Teachers, and Admins**.  
Built using **React + Tailwind CSS + React Query + Axios** for a responsive, fast, and secure user experience.

---

## Live Demo
- **Frontend (Vercel):** [Smart Learning Platform](https://presidio-week-3-smart-learning-plat.vercel.app/)  
- **Backend 1 (Render):** [API 1](https://presidio-week-3-smart-learning-platform-1.onrender.com)  
- **Backend 2 (Render):** [API 2](https://presidio-week-3-smart-learning-platform.onrender.com)

---

## Overview

The **Smart Learning Platform** is designed to streamline education management by connecting **students**, **teachers**, and **admins** on a single dashboard.

It supports:
- Secure authentication with JWT  
- Role-based dashboards (Student, Teacher, Admin)  
- Course management, teacher onboarding, and student enrollment  
- Fully responsive design for all devices  

---

## Core Features

### Student
- View enrolled courses (**MyCourses**)  
- Track progress and view ratings  
- Access personalized dashboard  

### Teacher
- Manage students and courses (**ManageTeachers**, **CreateCourse**)  
- Add / Edit / Delete courses  
- View assigned courses & enrolled students  

### Admin
- Manage users (students & teachers)  
- Access analytics dashboard with charts & metrics  
- Approve or reject new teacher registrations  

### Authentication
- Login / Register using **JWT**  
- Auto logout on token expiry  
- Protected routes via **React Router v6**

---

## 🛠️ Tech Stack

### **Frontend**
- React 18  
- Tailwind CSS 4  
- React Query (Data fetching + caching)  
- React Hook Form + Yup (Form validation)  
- Recharts (Charts & visualizations)  
- React Hot Toast (Notifications)  
- React Router DOM v6  
- Axios (API integration)  
- Lucide-React (Icons)

### **Backend**
- Node.js + Express (JWT + Role-based Auth)  
- MongoDB (Mongoose ORM)

---


Folder Structure
```
frontend/
│
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── Courses/
│   │   │   ├── MyCourses.jsx
│   │   │   ├── CreateCourse.jsx
│   │   │   └── CourseList.jsx
│   │   └── Teachers/
│   │       └── ManageTeachers.jsx
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── HomePage.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAxiosPrivate.js
│   │   └── useRefreshToken.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── utils/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
└── README.md
```

