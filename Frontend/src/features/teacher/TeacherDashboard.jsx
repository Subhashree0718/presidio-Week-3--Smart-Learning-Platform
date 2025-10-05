import { Link } from 'react-router-dom';
import { Users, PlusCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
const TeacherDashboard = () => {
    const { auth } = useAuth();
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
            <p className="text-lg">Welcome, {auth.user?.name}! Manage your students and courses from here.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/teacher/manage-students" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="card-body items-center text-center">
                        <Users size={48} className="text-primary" />
                        <h2 className="card-title mt-4">Manage Students</h2>
                        <p>View, add, edit, and remove students.</p>
                    </div>
                </Link>
                <Link to="/teacher/create-course" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                     <div className="card-body items-center text-center">
                        <PlusCircle size={48} className="text-secondary" />
                        <h2 className="card-title mt-4">Create a New Course</h2>
                        <p>Design a new course for students to enroll in.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};
export default TeacherDashboard;