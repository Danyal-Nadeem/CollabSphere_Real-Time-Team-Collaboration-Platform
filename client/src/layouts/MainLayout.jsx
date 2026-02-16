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
        <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                        CollabSphere
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <Link to="/" className="flex items-center w-full px-4 py-3 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors group">
                        <Home className="mr-3 h-5 w-5 group-hover:text-indigo-400" />
                        <span>Dashboard</span>
                    </Link>

                    <div className="pt-4 pb-2 px-4 uppercase text-xs font-semibold text-slate-500 tracking-wider">
                        Workspaces
                    </div>

                    {workspaces.map((ws) => (
                        <button
                            key={ws._id}
                            onClick={() => setActiveWorkspace(ws)}
                            className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors group ${activeWorkspace?._id === ws._id ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-700'}`}
                        >
                            <Layout className="mr-3 h-4 w-4" />
                            <span className="truncate">{ws.name}</span>
                        </button>
                    ))}

                    {activeWorkspace && (
                        <>
                            <div className="pt-4 pb-2 px-4 uppercase text-xs font-semibold text-slate-500 tracking-wider">
                                {activeWorkspace.name}
                            </div>
                            <Link
                                to={`/workspace/${activeWorkspace._id}/board`}
                                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors group ${location.pathname.includes('board') ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-300 hover:bg-slate-700'}`}
                            >
                                <CheckSquare className="mr-3 h-4 w-4" />
                                <span>Board</span>
                            </Link>
                            <div className="pt-2 px-4 text-[10px] font-bold text-slate-600 tracking-widest uppercase mb-1">Channels</div>
                            {channels.map((ch) => (
                                <Link
                                    key={ch._id}
                                    to={`/workspace/${activeWorkspace._id}/channel/${ch._id}`}
                                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors group ${channelId === ch._id ? 'bg-sky-600/20 text-sky-400' : 'text-slate-300 hover:bg-slate-700'}`}
                                >
                                    <Hash className="mr-3 h-4 w-4" />
                                    <span className="truncate">{ch.name}</span>
                                </Link>
                            ))}
                        </>
                    )}

                    <button className="flex items-center w-full px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors group mt-4">
                        <PlusCircle className="mr-3 h-4 w-4 text-slate-500" />
                        <span className="text-sm italic">New Workspace</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-700 bg-slate-800/80">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center font-bold text-white shadow-lg">
                            {user?.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="truncate flex-1">
                            <p className="text-sm font-semibold text-white">{user?.user?.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user?.user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all duration-200"
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-slate-900">
                <header className="h-16 border-b border-slate-700 flex items-center justify-between px-8 bg-slate-800/30 backdrop-blur-md z-10">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            {activeWorkspace?.name || 'Overview'}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Users className="h-5 w-5 text-slate-400 cursor-pointer hover:text-white transition-colors" />
                        <div className="h-8 w-[1px] bg-slate-700 mx-2"></div>
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors">
                            <Users className="h-4 w-4 text-slate-300" />
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
