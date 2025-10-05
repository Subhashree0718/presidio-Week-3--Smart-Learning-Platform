import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { axiosPublic } from '../../api/axios';
import { User, AtSign, Lock, Eye, EyeOff } from 'lucide-react';
const registerSchema = yup.object().shape({
    name: yup.string().required('Your full name is required.'),
    email: yup.string().email('Must be a valid email.').required('Email is required.'),
    password: yup.string().required('Password is required.').min(6, 'Password must be at least 6 characters.'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match.').required('Please confirm your password.'),
}).required();
const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema),
    });
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await axiosPublic.post('/users/register', {
                name: data.name,
                email: data.email,
                password: data.password,
            });
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col w-full max-w-md">
                <div className="text-center">
                    <h1 className="text-5xl font-bold">Create an Account</h1>
                    <p className="py-6">Join the Smart Learning Platform today to begin your journey!</p>
                </div>
                <div className="card shrink-0 w-full shadow-2xl bg-base-100">
                    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                                                <div className="form-control">
                            <label className="label"><span className="label-text">Full Name</span></label>
                            <label className="input input-bordered flex items-center gap-2">
                                <User size={16} className="opacity-50" />
                                <input type="text" placeholder="John Doe" className="grow" {...register('name')} />
                            </label>
                            <p className="text-error text-xs mt-1">{errors.name?.message}</p>
                        </div>
                                                <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <label className="input input-bordered flex items-center gap-2">
                                <AtSign size={16} className="opacity-50" />
                                <input type="email" placeholder="your-email@example.com" className="grow" {...register('email')} />
                            </label>
                            <p className="text-error text-xs mt-1">{errors.email?.message}</p>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Password</span></label>
                            <label className="input input-bordered flex items-center gap-2">
                                <Lock size={16} className="opacity-50" />
                                <input type={showPassword ? 'text' : 'password'} placeholder="password" className="grow" {...register('password')} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn btn-ghost btn-sm h-auto p-0">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </label>
                            <p className="text-error text-xs mt-1">{errors.password?.message}</p>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Confirm Password</span></label>
                            <label className="input input-bordered flex items-center gap-2">
                                <Lock size={16} className="opacity-50" />
                                <input type={showConfirmPassword ? 'text' : 'password'} placeholder="confirm password" className="grow" {...register('confirmPassword')} />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="btn btn-ghost btn-sm h-auto p-0">
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </label>
                            <p className="text-error text-xs mt-1">{errors.confirmPassword?.message}</p>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary" type="submit" disabled={isLoading}>
                                {isLoading ? <span className="loading loading-spinner"></span> : 'Create Account'}
                            </button>
                        </div>
                        <div className="divider text-xs">Already a member?</div>
                        <div className="text-center">
                            <Link to="/login" className="btn btn-outline btn-accent w-full">Login Instead</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default RegisterPage;