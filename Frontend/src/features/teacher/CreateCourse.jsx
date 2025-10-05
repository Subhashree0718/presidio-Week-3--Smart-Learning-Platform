import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Send } from 'lucide-react';

const COURSE_SERVICE_URL = import.meta.env.VITE_COURSE_SERVICE_URL;

const COURSE_CATEGORIES = [
    'Technology', 'Science', 'Arts & Humanities', 'Business', 'Health & Wellness', 'Mathematics', 'Languages'
];

const courseSchema = yup.object().shape({
    title: yup.string().required('Course title is required.').max(100),
    description: yup.string().required('Description is required.').min(20),
    category: yup.string().required('Please select a category.'),
});

const CreateCourse = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(courseSchema),
        defaultValues: { category: '' }
    });

    const createCourseMutation = useMutation({
        mutationFn: (newCourseData) => axiosPrivate.post(`${COURSE_SERVICE_URL}/courses`, newCourseData),
        onSuccess: () => {
            toast.success('Course created successfully! 🎉');
            queryClient.invalidateQueries({ queryKey: ['courses'] });
            navigate('/teacher/dashboard');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create course.');
        }
    });

    const onSubmit = (data) => {
        createCourseMutation.mutate({
            course_title: data.title,
            course_description: data.description,
            course_category: data.category,
            teacher_id: auth.user.id,
        });
    };

    return (
        <div className="flex justify-center py-10 min-h-screen bg-gray-50">
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl border border-gray-100">
                <div className="card-body p-8 sm:p-12">
                    <div className="flex items-center space-x-3 mb-8 border-b pb-4">
                        <BookOpen size={36} className="text-primary" />
                        <h1 className="text-4xl font-extrabold text-gray-800">New Course Details</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold text-gray-700">Course Title</span></label>
                            <input type="text" placeholder="e.g., Intro to React" {...register('title')} className={`input input-bordered input-lg w-full ${errors.title ? 'input-error' : 'focus:ring-2 focus:ring-primary'}`} />
                            <p className="text-error text-sm mt-1">{errors.title?.message}</p>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold text-gray-700">Course Description</span></label>
                            <textarea placeholder="Detailed summary..." {...register('description')} className={`textarea textarea-bordered h-32 w-full ${errors.description ? 'textarea-error' : 'focus:ring-2 focus:ring-primary'}`}></textarea>
                            <p className="text-error text-sm mt-1">{errors.description?.message}</p>
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text font-semibold text-gray-700">Category</span></label>
                            <select {...register('category')} className={`select select-bordered select-lg w-full ${errors.category ? 'select-error' : 'focus:ring-2 focus:ring-primary'}`}>
                                <option value="" disabled>Select a course category</option>
                                {COURSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <p className="text-error text-sm mt-1">{errors.category?.message}</p>
                        </div>
                        <div className="form-control pt-4">
                            <button type="submit" className="btn btn-primary btn-lg w-full shadow-lg" disabled={createCourseMutation.isLoading}>
                                {createCourseMutation.isLoading ? <>Creating...</> : <> <Send size={20} /> Create Course </>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
