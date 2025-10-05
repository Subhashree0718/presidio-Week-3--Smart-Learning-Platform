import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Send } from 'lucide-react'; // Import icon for better UI

// Sample categories for the select dropdown
const COURSE_CATEGORIES = [
    'Technology',
    'Science',
    'Arts & Humanities',
    'Business',
    'Health & Wellness',
    'Mathematics',
    'Languages',
];

const courseSchema = yup.object().shape({
    title: yup.string().required('Course title is required.').max(100, 'Title cannot exceed 100 characters.'),
    description: yup.string().required('Description is required.').min(20, 'Description must be at least 20 characters.'),
    category: yup.string().required('Please select a category.'), // Updated validation for select
});

const CreateCourse = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(courseSchema),
        defaultValues: { // Set a default value for the select
            category: '',
        }
    });

    const createCourseMutation = useMutation({
        mutationFn: (newCourseData) => {
            // Note: It's usually better practice to use a relative path like '/courses' 
            // and let axiosPrivate handle the base URL, but keeping the absolute URL for consistency.
            return axiosPrivate.post('http://localhost:5000/courses', newCourseData);
        },
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
        // Centered container with a nice background
        <div className="flex justify-center py-10 min-h-screen bg-gray-50">
            {/* Card with slightly wider max-width and border */}
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl border border-gray-100">
                <div className="card-body p-8 sm:p-12">
                    
                    {/* Header with Icon and Separator */}
                    <div className="flex items-center space-x-3 mb-8 border-b pb-4">
                        <BookOpen size={36} className="text-primary" />
                        <h1 className="text-4xl font-extrabold text-gray-800">New Course Details</h1>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Course Title Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-700">Course Title</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g., Introduction to Modern React" 
                                {...register('title')} 
                                className={`input input-bordered input-lg w-full transition-all duration-200 ${errors.title ? 'input-error focus:ring-error' : 'focus:ring-2 focus:ring-primary'}`} 
                            />
                            <p className="text-error text-sm mt-1">{errors.title?.message}</p>
                        </div>

                        {/* Course Description Textarea */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-700">Course Description</span>
                            </label>
                            <textarea 
                                placeholder="Provide a detailed summary of what students will learn..."
                                {...register('description')} 
                                className={`textarea textarea-bordered h-32 w-full transition-all duration-200 ${errors.description ? 'textarea-error focus:ring-error' : 'focus:ring-2 focus:ring-primary'}`}
                            ></textarea>
                            <p className="text-error text-sm mt-1">{errors.description?.message}</p>
                        </div>

                        {/* Category Select Dropdown (Improved UX) */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-gray-700">Category</span>
                            </label>
                            <select 
                                {...register('category')} 
                                className={`select select-bordered select-lg w-full transition-all duration-200 ${errors.category ? 'select-error focus:ring-error' : 'focus:ring-2 focus:ring-primary'}`}
                            >
                                <option value="" disabled>Select a course category</option>
                                {COURSE_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <p className="text-error text-sm mt-1">{errors.category?.message}</p>
                        </div>
                        
                        {/* Submission Button */}
                        <div className="form-control pt-4">
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg w-full shadow-lg hover:shadow-xl transition-all duration-300" 
                                disabled={createCourseMutation.isLoading}
                            >
                                {createCourseMutation.isLoading ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Create Course
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default CreateCourse;