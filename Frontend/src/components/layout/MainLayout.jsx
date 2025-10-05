import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuth from '../../hooks/useAuth';
const MainLayout = () => {
    const { auth } = useAuth();
    const location = useLocation();
    if (!auth?.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return (
        <div className="flex h-screen bg-base-200">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-100 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
export default MainLayout;