import useAuth from '../../hooks/useAuth';
import ThemeToggle from '../common/ThemeToggle';
import { LogOut, Menu, UserCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../../api/axios';
const Header = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const logout = async () => {
        try {
            await axiosPrivate.post('/users/logout');
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            setAuth({});
            localStorage.removeItem('auth');
            navigate('/login');
        }
    };
    return (
        <header className="navbar bg-base-100 shadow-sm border-b border-base-200 sticky top-0 z-30">
            <div className="flex-none lg:hidden">
                <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
                    <Menu />
                </label>
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold px-2">Smart Learning Platform</h1>
            </div>
            <div className="flex-none gap-2 items-center">
                <ThemeToggle />
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost flex items-center gap-2">
                        <div className="avatar placeholder online">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                <span className="text-sm">{auth.user?.name?.charAt(0).toUpperCase()}</span>
                            </div>
                        </div>
                        <span className="font-semibold hidden sm:inline">{auth.user?.name}</span>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                            <a className="justify-between">
                                <UserCircle size={16} />
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a><Settings size={16}/>Settings</a></li>
                        <div className="divider my-1"></div>
                        <li>
                            <button onClick={logout}>
                                <LogOut size={16}/>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};
export default Header;