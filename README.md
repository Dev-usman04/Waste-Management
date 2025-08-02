# Waste Management System

A full-stack waste management application built with React (Frontend) and Node.js/Express (Backend).

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd waste-management
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   **Backend (.env in BACKEND folder):**
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

   **Frontend (.env in clients folder):**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

#### Option 1: Run both servers together (Recommended)
```bash
npm run dev
```

#### Option 2: Run servers separately

**Backend:**
```bash
npm run dev:backend
```

**Frontend:**
```bash
npm run dev:frontend
```

### Access the Application

- **Frontend:** http://localhost:5173 (or the port shown in terminal)
- **Backend API:** http://localhost:5000

## 📁 Project Structure

```
waste-management/
├── BACKEND/                 # Backend server
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   ├── uploads/            # File uploads
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── clients/                # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── config/         # Configuration files
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json        # Frontend dependencies
└── package.json            # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register/user` - Register new user
- `POST /api/auth/register/worker` - Register new worker

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Worker Management
- `GET /api/worker/profile` - Get worker profile
- `PUT /api/worker/profile` - Update worker profile

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/workers` - Get all workers

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads
- **cloudinary** - Image storage

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling

## 🔒 Environment Variables

Make sure to set up the following environment variables:

### Backend (.env)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `PORT`: Server port (default: 5000)

### Frontend (.env)
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000)

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   - The application will automatically try the next available port
   - Check the terminal output for the actual port being used

2. **MongoDB connection error**
   - Ensure MongoDB is running
   - Check your MONGO_URI in the .env file

3. **MetaMask errors**
   - These are browser extension errors and don't affect the application
   - You can safely ignore them

4. **CORS errors**
   - The backend is configured with CORS enabled
   - If you still get CORS errors, check that the frontend URL is correct

### Getting Help

If you encounter any issues:
1. Check the terminal output for error messages
2. Ensure all dependencies are installed
3. Verify environment variables are set correctly
4. Make sure MongoDB is running

## 📝 License

This project is licensed under the ISC License.
