import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import { BookMarked, AlertCircle } from 'lucide-react';

const COURSE_SERVICE_URL = import.meta.env.VITE_COURSE_SERVICE_URL;

const MyCourses = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const { data: enrolledCourses, isLoading, error } = useQuery({
        queryKey: ['myCourses', auth.user.id],
        queryFn: async () => {
            const response = await axiosPrivate.get(`${COURSE_SERVICE_URL}/courses/enrolled/${auth.user.id}`);
            return response.data;
        },
    });

    if (isLoading) return <div>Loading your courses...</div>;
    if (error) return <div>Error fetching your courses.</div>;

    const uniqueCourses = enrolledCourses?.reduce((unique, course) => {
        if (!unique.some(item => item.course_id === course.course_id)) {
            unique.push(course);
        }
        return unique;
    }, []) || [];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <BookMarked />
                My Enrolled Courses
            </h1>
            {uniqueCourses.length === 0 ? (
                <p className="text-lg text-base-content/70">You are not enrolled in any courses yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uniqueCourses.map(course => (
                        <div key={course.course_id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">{course.course_title}</h2>
                                <p>{course.course_description || "No description available."}</p>
                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-primary">Continue Learning</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCourses;
