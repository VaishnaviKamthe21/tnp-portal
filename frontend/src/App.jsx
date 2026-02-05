import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentJobs from './pages/StudentJobs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Chatbot from './pages/Chatbot';
import Applications from './pages/Applications';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <div className="min-h-screen bg-transparent">
            <Navbar />
            <div className="pt-16">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Student Protected Routes */}
                    <Route path="/student/jobs" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentJobs />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute allowedRoles={['student', 'admin']}>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    {/* Admin Protected Routes */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/about" element={<div className="p-20 text-center text-gray-500">About Page (Coming Soon)</div>} />
                    <Route path="/contact" element={<div className="p-20 text-center text-gray-500">Contact Page (Coming Soon)</div>} />
                    <Route path="/admin/jobs" element={<div className="p-20 text-center text-gray-500">Admin Jobs Page (Coming Soon)</div>} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
