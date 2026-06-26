# 🔗 AlumniConnect Platform

<p align="center">
  <strong>Bridging the gap between students and alumni through mentorship, networking, and career opportunities.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#demo">Demo</a> •
  <a href="#getting-started">Getting Started</a>
</p>

---

## 🚀 About the Project

AlumniConnect is a premium full-stack platform designed to foster meaningful connections between university students and graduates. Whether it's finding a mentor, exploring job opportunities, or booking 1:1 sessions, AlumniConnect provides a seamless experience for everyone involved.

### ✨ Key Highlights

- **Role-Based Access**: Tailored experiences for Students, Alumni, and Administrators
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Real-Time Features**: Messaging, bookings, and network updates
- **Comprehensive Admin Suite**: Verification workflows, analytics, and user management
- **Secure Authentication**: JWT-based authentication with role-based permissions

---

## 🎯 Features

### 🎓 For Students

- Browse verified alumni profiles
- Book mentorship sessions
- Explore job opportunities
- Request job referrals
- Connect and message with alumni
- Manage personal profile

### 👔 For Alumni

- Create professional profiles
- Post job openings
- Manage mentorship availability
- Review job applications
- Share resources with the community
- Build your network

### 🔐 For Administrators

- Verify alumni applications (3-phase workflow)
- Manage all users
- View platform analytics
- Moderate content
- Oversee platform activity

---

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- Lucide React
- React Router

### Backend

- Express.js
- TypeScript
- MySQL
- JWT Authentication
- bcryptjs
- Multer
- CORS

---

## 📸 Screenshots

_(Coming Soon - Add screenshots of your application here)_

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MySQL (v8.0+)
- npm or yarn

### Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/AlumniConnect.git
   cd AlumniConnect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up database**
   - Create MySQL database `alumniconnect`
   - Import schema from `SQL/alumniconnect (1).sql`

5. **Run the app**

   ```bash
   npm run dev:all
   ```

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 📄 License

This project is proprietary and confidential.
