import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { LogOut, Home, MessageSquare, Layout, Users, PlusCircle, Hash, CheckSquare } from 'lucide-react';
import workspaceService from '../services/workspaceService';
import channelService from '../services/channelService';

const MainLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const [workspaces, setWorkspaces] = useState([]);
    const [channels, setChannels] = useState([]);
    const [activeWorkspace, setActiveWorkspace] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { workspaceId, channelId } = useParams();

    useEffect(() => {
        if (user) {
            const fetchWorkspaces = async () => {
                try {
                    const data = await workspaceService.getWorkspaces(user.token);
                    setWorkspaces(data.data);
                    if (data.data.length > 0 && !activeWorkspace) {
                        setActiveWorkspace(data.data[0]);
                    }
                } catch (error) {
                    console.error('Error fetching workspaces:', error);
                }
            };
            fetchWorkspaces();
        }
    }, [user, activeWorkspace]);

    useEffect(() => {
        if (activeWorkspace && user) {
            const fetchChannels = async () => {
                try {
                    const data = await channelService.getChannels(activeWorkspace._id, user.token);
                    setChannels(data.data);
                } catch (error) {
                    console.error('Error fetching channels:', error);
                }
            };
            fetchChannels();
        }
    }, [activeWorkspace, user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent">
                        CollabSphere
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <Link to="/" className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group">
                        <Home className="mr-3 h-5 w-5 group-hover:text-indigo-600" />
                        <span>Dashboard</span>
                    </Link>

                    <div className="pt-4 pb-2 px-4 uppercase text-xs font-semibold text-gray-500 tracking-wider">
                        Workspaces
                    </div>

                    {workspaces.map((ws) => (
                        <button
                            key={ws._id}
                            onClick={() => setActiveWorkspace(ws)}
                            className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors group ${activeWorkspace?._id === ws._id ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <Layout className="mr-3 h-4 w-4" />
                            <span className="truncate">{ws.name}</span>
                        </button>
                    ))}

                    {activeWorkspace && (
                        <>
                            <div className="pt-4 pb-2 px-4 uppercase text-xs font-semibold text-gray-500 tracking-wider">
                                {activeWorkspace.name}
                            </div>
                            <Link
                                to={`/workspace/${activeWorkspace._id}/board`}
                                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors group ${location.pathname.includes('board') ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <CheckSquare className="mr-3 h-4 w-4" />
                                <span>Board</span>
                            </Link>
                            <div className="pt-2 px-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Channels</div>
                            {channels.map((ch) => (
                                <Link
                                    key={ch._id}
                                    to={`/workspace/${activeWorkspace._id}/channel/${ch._id}`}
                                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors group ${channelId === ch._id ? 'bg-sky-50 text-sky-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <Hash className="mr-3 h-4 w-4" />
                                    <span className="truncate">{ch.name}</span>
                                </Link>
                            ))}
                        </>
                    )}

                    <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group mt-4">
                        <PlusCircle className="mr-3 h-4 w-4 text-gray-400" />
                        <span className="text-sm italic">New Workspace</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-bold text-white shadow-lg">
                            {user?.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="truncate flex-1">
                            <p className="text-sm font-semibold text-gray-900">{user?.user?.name}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] text-gray-500 truncate">{user?.user?.email}</p>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${user?.user?.role === 'Admin' ? 'bg-rose-100 text-rose-700' :
                                        user?.user?.role === 'Manager' ? 'bg-indigo-100 text-indigo-700' :
                                            'bg-gray-200 text-gray-700'
                                    }`}>
                                    {user?.user?.role || 'Member'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-10 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                            {activeWorkspace?.name || 'Overview'}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Users className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors" />
                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                            <Users className="h-4 w-4 text-gray-600" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
