import axios from 'axios';

const API_URL = 'http://localhost:5000/api/channels';

const getChannels = async (workspaceId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/workspace/${workspaceId}`, config);
    return response.data;
};

const createChannel = async (channelData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, channelData, config);
    return response.data;
};

const channelService = {
    getChannels,
    createChannel,
};

export default channelService;
