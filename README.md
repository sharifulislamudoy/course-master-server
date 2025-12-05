# CourseMaster - Full-Featured EdTech Platform

## 📖 Description

CourseMaster is a production-ready E-learning platform built with the MERN stack (MongoDB, Express.js, React/Next.js, Node.js). It simulates a real-world EdTech environment where students can browse, enroll in, and consume courses, while administrators manage course content, track enrollments, and review assignments.

The platform features:

- **Role-based authentication** (Student & Admin)
- **Course catalog** with search, filter, sort, and pagination
- **Student dashboard** for enrolled courses with progress tracking
- **Course consumption** with video lectures, assignments, and quizzes
- **Admin panel** for course CRUD, batch management, and enrollment tracking
- **Performance optimizations** including database indexing and caching (Redis optional)

## 🚀 Installation & Run Instructions

### Prerequisites
- Node.js (v18 or later)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Step 1: Clone the Repository
Client side
```bash
git clone https://github.com/sharifulislamudoy/course-master
cd course-master
npm i
npm run dev
```
Server side 
```bash
git clone https://github.com/sharifulislamudoy/course-master-server
cd course-master-server
npm i
node index.js
```

### Step 2: Import env file
Client side (.env.local) 
```bash
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret-key-here
NODE_ENV=development
```

Server side
```bash
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret-key-here
NODE_ENV=development
```
