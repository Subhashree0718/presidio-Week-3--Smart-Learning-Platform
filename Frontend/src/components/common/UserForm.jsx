import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
const buildSchema = (isEditing, role) => {
    return yup.object().shape({
        name: yup.string().required('Full name is required.'),
        email: yup.string().email('Must be a valid email.').required('Email is required.'),
                password: isEditing 
            ? yup.string() 
            : yup.string().required('Password is required.').min(6, 'Password must be at least 6 characters.'),
                age: role === 'student' 
            ? yup.number().typeError('Age must be a number.').positive('Age must be a positive number.').integer('Age must be a whole number.').nullable().transform((value, originalValue) => originalValue.trim() === "" ? null : value)
            : yup.mixed(),
        guardian_info: role === 'student' 
            ? yup.string()
            : yup.mixed(),
        specialization: role === 'teacher' 
            ? yup.string()
            : yup.mixed(),
    });
};
const UserForm = ({ onSubmit, defaultValues, isLoading, role }) => {
    const isEditing = !!defaultValues;
    const schema = buildSchema(isEditing, role);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues || {}
    });
    useEffect(() => {
        reset(defaultValues || {});
    }, [defaultValues, reset]);

    const renderStudentFields = () => (
        <>
            <div className="form-control">
                <label className="label"><span className="label-text">Age</span></label>
                <input type="number" {...register('age')} className={`input input-bordered ${errors.age ? 'input-error' : ''}`} />
                <p className="text-error text-xs mt-1">{errors.age?.message}</p>
            </div>
            <div className="form-control">
                <label className="label"><span className="label-text">Guardian Info</span></label>
                <input type="text" {...register('guardian_info')} className={`input input-bordered ${errors.guardian_info ? 'input-error' : ''}`} />
                <p className="text-error text-xs mt-1">{errors.guardian_info?.message}</p>
            </div>
        </>
    );
    const renderTeacherFields = () => (
        <div className="form-control md:col-span-2"> 
            <label className="label"><span className="label-text">Specialization</span></label>
            <input type="text" {...register('specialization')} className={`input input-bordered ${errors.specialization ? 'input-error' : ''}`} />
            <p className="text-error text-xs mt-1">{errors.specialization?.message}</p>
        </div>
    );
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label"><span className="label-text">Full Name</span></label>
                    <input type="text" {...register('name')} className={`input input-bordered ${errors.name ? 'input-error' : ''}`} />
                    <p className="text-error text-xs mt-1">{errors.name?.message}</p>
                </div>
                <div className="form-control">
                    <label className="label"><span className="label-text">Email</span></label>
                    <input type="email" {...register('email')} className={`input input-bordered ${errors.email ? 'input-error' : ''}`} />
                    <p className="text-error text-xs mt-1">{errors.email?.message}</p>
                </div>
                {!isEditing && (
                     <div className="form-control md:col-span-2">
                        <label className="label"><span className="label-text">Password</span></label>
                        <input type="password" {...register('password')} className={`input input-bordered ${errors.password ? 'input-error' : ''}`} />
                        <p className="text-error text-xs mt-1">{errors.password?.message}</p>
                    </div>
                )}
                {role === 'student' && renderStudentFields()}
                {role === 'teacher' && renderTeacherFields()}
            </div>
            <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? <span className="loading loading-spinner"></span> : isEditing ? 'Save Changes' : 'Create User'}
                </button>
            </div>
        </form>
    );
};
export default UserForm;