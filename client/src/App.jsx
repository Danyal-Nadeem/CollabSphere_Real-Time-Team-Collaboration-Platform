import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Board from './pages/Board';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const { user } = useSelector((state) => state.auth);

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

                    <Route path="/" element={<PrivateRoute />}>
                        <Route element={<MainLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="workspace/:workspaceId/channel/:channelId" element={<Chat />} />
                            <Route path="workspace/:workspaceId/board" element={<Board />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
            <ToastContainer />
        </>
    );
}

export default App;
