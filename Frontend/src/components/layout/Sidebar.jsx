import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, BookOpen, BookMarked, PlusCircle, Lightbulb, User, X, Menu } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const navLinks = {
    admin: [
        { to: '/admin/dashboard', icon: <LayoutDashboard />, text: 'Dashboard' },
        { to: '/admin/students', icon: <Users />, text: 'Manage Students' },
        { to: '/admin/teachers', icon: <UserCog />, text: 'Manage Teachers' },
    ],
    teacher: [
        { to: '/teacher/dashboard', icon: <LayoutDashboard />, text: 'Dashboard' },
        { to: '/teacher/manage-students', icon: <Users />, text: 'Manage Students' },
        { to: '/teacher/create-course', icon: <PlusCircle />, text: 'Create Course' },
    ],
    student: [
        { to: '/student/dashboard', icon: <BookOpen />, text: 'All Courses' },
        { to: '/student/my-courses', icon: <BookMarked />, text: 'My Courses' },
    ]
};

const Sidebar = () => {
    const { auth } = useAuth();
    const links = navLinks[auth?.user?.role] || [];
    const userRole = auth?.user?.role || 'Guest';
    
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile burger button */}
            <button 
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-base-100 shadow-md"
                onClick={() => setIsOpen(true)}
            >
                <Menu size={24} /> {/* Use Menu icon for burger */}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden" 
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static top-0 left-0 h-screen w-64 bg-base-100 text-base-content flex flex-col border-r border-base-200 shadow-md
                transform lg:translate-x-0 transition-transform duration-300 z-50
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            `}>
                {/* Mobile close button */}
                <div className="lg:hidden flex justify-end p-4">
                    <button onClick={() => setIsOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                {/* Logo */}
                <div className="p-5 text-2xl font-extrabold text-primary border-b border-base-200 flex items-center gap-2">
                    <Lightbulb size={28} className="text-secondary" />
                    <span className="truncate">SmartLearn</span>
                </div>

                {/* Nav Links */}
                <ul className="menu p-4 pt-3 flex-1 space-y-1">
                    {links.map((link) => (
                        <li key={link.to}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) => 
                                    `flex items-center gap-3 p-3 rounded-lg font-medium relative transition-all duration-200
                                    hover:bg-base-200/50 
                                    ${isActive 
                                        ? 'bg-primary/5 text-primary border-l-4 border-primary' 
                                        : 'text-base-content/80 hover:border-l-4 hover:border-base-300'
                                    }`
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                {link.icon}
                                {link.text}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Profile */}
                <div className="p-4 border-t border-base-200 bg-base-200/50">
                    <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                <span className="text-sm">{auth.user?.name?.charAt(0).toUpperCase() || <User size={16} />}</span>
                            </div>
                        </div>
                        <div className="truncate">
                            <p className="font-semibold truncate">{auth.user?.name || 'User Profile'}</p>
                            <p className="text-xs text-base-content/70 capitalize">{userRole}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-1 text-xs text-base-content/60 border-t border-base-200 text-center">
                    © {new Date().getFullYear()} Smart Learning
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
