import { useSelector } from 'react-redux';
import { Layout, MessageSquare, CheckSquare, Clock } from 'lucide-react';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-sky-600 rounded-2xl p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.user?.name}!
                </h1>
                <p className="text-indigo-100 opacity-90">
                    Manage your team, track tasks, and collaborate in real-time.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Layout className="text-indigo-400" />}
                    title="Workspaces"
                    value="0"
                    label="Active spaces"
                />
                <StatCard
                    icon={<MessageSquare className="text-sky-400" />}
                    title="Channels"
                    value="0"
                    label="Communication hubs"
                />
                <StatCard
                    icon={<CheckSquare className="text-emerald-400" />}
                    title="Tasks"
                    value="0"
                    label="Pending items"
                />
                <StatCard
                    icon={<Clock className="text-amber-400" />}
                    title="Activity"
                    value="Today"
                    label="Recent changes"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 min-h-[300px] shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500 italic">
                        No recent activity yet. Start collaborating!
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 h-fit shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Upcoming Deadlines</h3>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 italic">No tasks with deadlines.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, label }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
                {icon}
            </div>
        </div>
        <h4 className="text-gray-600 text-sm font-medium uppercase tracking-wider">{title}</h4>
        <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-xs text-gray-500">{label}</span>
        </div>
    </div>
);

export default Dashboard;
