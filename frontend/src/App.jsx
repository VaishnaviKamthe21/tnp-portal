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
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import AdminJobs from './pages/AdminJobs';
import JobRecommendations from './pages/JobRecommendations';
import ApplicantsManagement from './pages/ApplicantsManagement';
import FloatingChatbot from './components/FloatingChatbot';

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
                    <Route path="/student/chatbot" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <Chatbot />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/applications" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <Applications />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/recommendations" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <JobRecommendations />
                        </ProtectedRoute>
                    } />

                    {/* Admin Protected Routes */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/jobs" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminJobs />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/applicants" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <ApplicantsManagement />
                        </ProtectedRoute>
                    } />

                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                </Routes>
                <FloatingChatbot />
            </div>
        </div>
    );
}

export default App;
