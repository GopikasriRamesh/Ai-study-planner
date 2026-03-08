import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

export const generatePlan = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/generate-plan`, data);
        return response.data;
    } catch (error) {
        console.error("Error calling API", error);
        throw error;
    }
};