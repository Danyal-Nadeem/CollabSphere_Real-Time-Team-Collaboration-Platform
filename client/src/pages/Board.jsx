import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Plus, MoreVertical, Calendar, User } from 'lucide-react';
import axios from 'axios';

const Board = () => {
    const { workspaceId } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const columns = ['Todo', 'In Progress', 'Done'];

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(`http://localhost:5000/api/tasks/workspace/${workspaceId}`, config);
                setTasks(data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setIsLoading(false);
            }
        };

        if (workspaceId) {
            fetchTasks();
        }
    }, [workspaceId, user.token]);

    const getTasksByStatus = (status) => tasks.filter((task) => task.status === status);

    return (
        <div className="flex h-full overflow-x-auto pb-4 space-x-6">
            {columns.map((column) => (
                <div key={column} className="flex-shrink-0 w-80 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <h3 className="text-lg font-semibold">{column}</h3>
                            <span className="ml-3 bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                                {getTasksByStatus(column).length}
                            </span>
                        </div>
                        <button className="p-1 text-slate-500 hover:text-white transition-colors">
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 bg-slate-900/50 rounded-xl p-2 space-y-3 min-h-[500px]">
                        {getTasksByStatus(column).map((task) => (
                            <div
                                key={task._id}
                                className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm hover:border-indigo-500/50 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-sm">{task.title}</h4>
                                    <button className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{task.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-[10px] text-slate-500">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                                    </div>
                                    <div className="flex -space-x-2">
                                        {task.assignedTo ? (
                                            <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold">
                                                {task.assignedTo.name.charAt(0)}
                                            </div>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center">
                                                <User className="h-3 w-3 text-slate-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Board;
