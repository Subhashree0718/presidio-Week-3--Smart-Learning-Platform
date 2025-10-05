import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { BookCopy, Star, Tag, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

const COURSE_SERVICE_URL = import.meta.env.VITE_COURSE_SERVICE_URL;

const CourseListSkeleton = () => (
    <div className="space-y-8 animate-pulse p-4">
        <div className="bg-base-300 h-24 w-full rounded-lg"></div>
        <div className="card lg:card-side bg-base-300 shadow-xl h-64"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="card bg-base-300 h-48 rounded-xl"></div>)}
        </div>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-64 bg-base-200 rounded-lg text-center p-4">
        <span className="text-error mb-4">⚠️</span>
        <h3 className="text-xl font-semibold text-error">Could Not Fetch Courses</h3>
        <p className="text-base-content/70">{message}</p>
    </div>
);

const StudentDashboard = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());

    const { data: courses, isLoading, error } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => (await axiosPrivate.get(`${COURSE_SERVICE_URL}/courses`)).data.courses,
    });

    const enrollMutation = useMutation({
        mutationFn: (courseId) =>
            axiosPrivate.post(`${COURSE_SERVICE_URL}/courses/${courseId}/enroll`, {
                studentId: auth.user.id,
            }),
        onSuccess: (data, courseId) => {
            toast.success("Successfully enrolled in the course!");
            setEnrolledCourseIds(prev => new Set(prev).add(courseId));
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to enroll.");
        },
    });

    const handleEnroll = courseId => enrollMutation.mutate(courseId);

    if (isLoading) return <CourseListSkeleton />;
    if (error) return <ErrorDisplay message={error.message || "Failed to connect to the course service."} />;

    const featuredCourse = courses && courses[0];
    const regularCourses = courses && courses.slice(1);

    const renderEnrollButton = (course) => {
        const isEnrolled = enrolledCourseIds.has(course.course_id);
        const btnClass = isEnrolled ? 'btn-success' : 'btn-primary';
        const btnText = isEnrolled ? (<><CheckCircle size={18} /> Enrolled</>) : 'Enroll Now';
        const isDisabled = enrollMutation.isLoading || isEnrolled;
        return (
            <button
                className={`btn ${btnClass} btn-sm sm:btn-md transition-colors duration-200`}
                onClick={() => handleEnroll(course.course_id)}
                disabled={isDisabled}
            >
                {enrollMutation.isLoading && !isEnrolled ? 'Enrolling...' : btnText}
            </button>
        );
    };

    return (
        <div className="space-y-10 p-4 sm:p-6 lg:p-8">
            <div className="p-4 sm:p-6 bg-primary/10 rounded-xl">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-primary">Welcome, {auth.user?.name}!</h1>
                <p className="text-sm sm:text-lg text-primary-content/90 mt-2">Explore our catalog and start your learning journey today.</p>
            </div>

            {featuredCourse && (
                <div className="card lg:card-side bg-base-100 shadow-xl border border-primary/20 transition-all duration-300 hover:shadow-2xl">
                    <figure className="aspect-video lg:aspect-auto lg:w-1/3 flex items-center justify-center p-0 rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80"
                            alt="Featured Course"
                            className="w-full h-full object-cover"
                        />
                    </figure>
                    <div className="card-body lg:w-2/3 p-4 sm:p-8">
                        <div className="flex justify-between items-start mb-2">
                            <div className="badge badge-sm sm:badge-lg badge-secondary">Featured Course</div>
                            <span className="flex items-center gap-1 text-sm font-semibold"><Star size={16} className="text-yellow-500" />{featuredCourse.course_rating || 'N/A'}</span>
                        </div>
                        <h2 className="card-title text-xl sm:text-3xl mb-2 text-base-content">{featuredCourse.course_title}</h2>
                        <p className="text-sm sm:text-base text-base-content/70 flex-grow pr-0 sm:pr-4 line-clamp-4">{featuredCourse.course_description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm mt-4">
                            <span className="flex items-center gap-1 badge badge-outline badge-sm"><Tag size={14} />{featuredCourse.course_category}</span>
                        </div>
                        <div className="card-actions justify-end mt-6">
                            {renderEnrollButton(featuredCourse)}
                            <button className="btn btn-ghost btn-sm sm:btn-md text-primary hover:bg-base-200">View Details <ArrowRight size={16} /></button>
                        </div>
                    </div>
                </div>
            )}

            <div className="divider text-lg sm:text-xl font-bold text-base-content">All Courses</div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-6">
                <BookCopy className="text-secondary" />
                Course Catalog
            </h2>

            {!courses || courses.length === 0 ? (
                <p className="text-center text-lg text-base-content/70">No courses available at the moment. Check back later!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {regularCourses?.map(course => (
                        <div key={course.course_id} className="card bg-base-100 shadow-lg hover:shadow-xl border border-base-200 transition-shadow duration-300">
                            <figure className="h-40 sm:h-32 bg-base-300 rounded-t-lg flex items-center justify-center overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&h=200&q=80"
                                    alt="Course thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            </figure>
                            <div className="card-body p-4 sm:p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="card-title text-lg sm:text-xl font-semibold">{course.course_title}</h3>
                                    <div className="badge badge-primary badge-outline badge-sm">{course.course_category}</div>
                                </div>
                                <p className="text-base-content/70 text-sm flex-grow mb-4 line-clamp-3">{course.course_description || "No detailed description available."}</p>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <Star size={14} className="text-yellow-500" />
                                        <span>{course.course_rating || 'N/A'}</span>
                                    </div>
                                    <div className="card-actions">
                                        {renderEnrollButton(course)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
