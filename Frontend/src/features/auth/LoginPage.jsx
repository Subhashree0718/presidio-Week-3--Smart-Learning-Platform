import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { axiosPublic } from '../../api/axios';
import { AtSign, Lock, Eye, EyeOff, BookOpenCheck } from 'lucide-react'; // Added BookOpenCheck for branding

const loginSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
}).required();

const roleRedirects = {
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
};

const LoginPage = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await axiosPublic.post('/users/login', data);
            const { accessToken, user } = response.data;
            setAuth({ accessToken, user });
            toast.success('Login successful!');
            const redirectPath = roleRedirects[user.role] || from;
            navigate(redirectPath, { replace: true });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
            <div className="card lg:card-side w-full max-w-5xl shadow-2xl bg-base-100/95 backdrop-blur-sm overflow-hidden">
                                <div className="p-10 lg:w-1/2 bg-primary/10 text-primary-content flex flex-col justify-center items-center text-center">
                    <BookOpenCheck size={72} className="mb-4 text-primary" />
                    <h1 className="text-4xl font-extrabold text-primary">Smart Learning Platform</h1>
<p className="py-4 text-gray-600 text-lg max-w-md">
    Access your courses, manage students, and oversee analytics to continue your educational journey.
</p>           <div className="mt-6">
                        <Link to="/register" className="btn btn-outline btn-primary border-2">
                            Create an Account
                        </Link>
                    </div>
                </div>

                {/* 2. Login Form Side (Cleaned up JSX) */}
                <div className="card-body lg:w-1/2 p-8">
                    <h2 className="text-3xl font-bold text-center mb-6">Welcome Back!</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        
                        {/* Email Field */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <label className={`input input-bordered flex items-center gap-2 ${errors.email ? 'input-error' : ''}`}>
                                <AtSign size={16} className="opacity-50" />
                                <input
                                    type="email"
                                    placeholder="your-email@example.com"
                                    className="grow"
                                    {...register('email')}
                                    autoComplete="email"
                                />
                            </label>
                            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <label className={`input input-bordered flex items-center gap-2 ${errors.password ? 'input-error' : ''}`}>
                                <Lock size={16} className="opacity-50" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="password"
                                    className="grow"
                                    {...register('password')}
                                    autoComplete="current-password"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn btn-ghost btn-sm h-auto p-0">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </label>
                            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Login Button */}
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type="submit" disabled={isLoading}>
                                {isLoading ? <span className="loading loading-spinner"></span> : 'Login'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="divider mt-6 mb-4 text-xs">OR</div>
                    
                    {/* Simplified Register Link (moved into marketing side, but kept here for accessibility) */}
                    <div className="text-center lg:hidden">
                        <Link to="/register" className="btn btn-outline btn-accent w-full">Create an Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;