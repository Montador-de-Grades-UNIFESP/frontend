import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';


try {
    await axios.get(apiURL + '/ping');
}
catch (err) {
    alert('API não disponível no momento, você pode usar o aplicativo, mas algumas funcionalidades podem não estar disponíveis.');
}

export default function useAPI() {
    return {
        get: async (url) => {
            const response = await axios.get(apiURL + url, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response;
        },
        post: async (url, data) => {
            const response = await axios.post(apiURL + url, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response);
            return response;
        }
    }
}
