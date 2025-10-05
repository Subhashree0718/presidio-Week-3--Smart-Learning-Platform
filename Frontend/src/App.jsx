import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import AdminDashboard from './features/admin/AdminDashboard';
import ManageStudents from './features/admin/ManageStudents';
import ManageTeachers from './features/admin/ManageTeachers';
import StudentDashboard from './features/student/StudentDashboard';
import MyCourses from './features/student/MyCourses';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherDashboard from './features/teacher/TeacherDashboard';
import CreateCourse from './features/teacher/CreateCourse';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/students" element={<ManageStudents />} />
          <Route path="admin/teachers" element={<ManageTeachers />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route path="teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="teacher/manage-students" element={<ManageStudents />} />
            <Route path="teacher/create-course" element={<CreateCourse />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="student/my-courses" element={<MyCourses />} />
        </Route>
        <Route index element={<p>Welcome! Please navigate using the sidebar.</p>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
export default App;