import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workspaces';

const getWorkspaces = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const createWorkspace = async (workspaceData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, workspaceData, config);
    return response.data;
};

const workspaceService = {
    getWorkspaces,
    createWorkspace,
};

export default workspaceService;
