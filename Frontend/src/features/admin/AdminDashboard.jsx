import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import StatCard from '../../components/common/StatCard';
import { Users, UserCog, BookOpen, AlertCircle, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as PieTooltip } from 'recharts';
const DashboardSkeleton = () => (
    <div className="animate-pulse">
        <div className="bg-base-300 h-8 w-64 mb-6 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-base-300 h-28 rounded-lg"></div>
            <div className="bg-base-300 h-28 rounded-lg"></div>
            <div className="bg-base-300 h-28 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-base-300 h-80 rounded-lg"></div>
            <div className="bg-base-300 h-80 rounded-lg"></div>
        </div>
    </div>
);
const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-64 bg-base-200 rounded-lg text-center p-4">
        <AlertCircle className="w-12 h-12 text-error mb-4" />
        <h3 className="text-xl font-semibold text-error">An Error Occurred</h3>
        <p className="text-base-content/70">{message}</p>
    </div>
);
const AdminDashboard = () => {
    const axiosPrivate = useAxiosPrivate();
    const { data: analytics, isLoading, error } = useQuery({
        queryKey: ['adminAnalytics'],
        queryFn: async () => {
            const { data } = await axiosPrivate.get('/users/data/analytics');
            return data;
        },
    });
    if (isLoading) return <DashboardSkeleton />;
    if (error) {
        return <ErrorDisplay message={error.response?.data?.message || "Could not fetch analytics data."} />;
    }
    const ageChartData = analytics.studentsByAge?.map(item => ({ name: `Age ${item.age}`, students: item.count })) || [];
    const roleDistributionData = [
        { name: 'Students', value: analytics.totalStudents },
        { name: 'Teachers', value: analytics.totalTeachers },
    ];
    const COLORS = ['#0088FE', '#00C49F'];
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-base-content">Admin Analytics</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<Users />} title="Total Students" value={analytics.totalStudents} />
                <StatCard icon={<UserCog />} title="Total Teachers" value={analytics.totalTeachers} />
                <StatCard icon={<BookOpen />} title="Total Courses" value={analytics.totalCourses} />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-xl flex flex-col">
                    <div className="card-body">
                        <h2 className="card-title">Students by Age</h2>
                        <div className="flex-grow h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ageChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip wrapperClassName="!bg-base-200 !border-base-300" />
                                    <Legend />
                                    <Bar dataKey="students" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="card bg-base-100 shadow-xl flex flex-col">
                    <div className="card-body">
                        <h2 className="card-title">User Role Distribution</h2>
                        <div className="flex-grow h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roleDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={110}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {roleDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <PieTooltip wrapperClassName="!bg-base-200 !border-base-300" />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Recent Students</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th className="flex items-center gap-2"><CalendarDays size={16}/> Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.recentStudents?.map((student) => (
                                    <tr key={student.user_email} className="hover">
                                        <td>
                                            <div className="font-bold">{student.user_name}</div>
                                        </td>
                                        <td>{student.user_email}</td>
                                        <td>{new Date(student.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table></div>
                </div></div>
        </div>
    );
};
export default AdminDashboard;