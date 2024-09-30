

const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

try {
    fetch(apiURL + '/ping').then(console.log);
}
catch (err) {
    console.error('API not available');
}

export default function useAPI() {
    return {
        get: async (url) => {
            const response = await fetch(apiURL + url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response;
        },
        post: async (url, data) => {
            const response = await fetch(apiURL + url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return response;
        }
    }
}
