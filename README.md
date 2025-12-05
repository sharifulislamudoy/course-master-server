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
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=kotTsBARs6W218C8VjTt4sR5lmGwM6Ozo6OCcS9F7/M=
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Server side
```bash
MONGO_URI=mongodb+srv://coursemasterDB:1UhT3ypPtb6AAH4G@cluster0.jcakfyu.mongodb.net/?appName=Cluster0
JWT_SECRET=da4407099493664d6eb6a807730f62449937e6208fcac591fb072f5720aecfe2b6f917f22cd1cecb06dfa46c496e5bc7bffb23fef9353229572d99900c3b7e2e
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```
