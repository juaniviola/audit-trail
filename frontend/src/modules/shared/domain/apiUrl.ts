const url = process.env.NEXT_PUBLIC_API_URL;

export const apiUrl = url ? `${url}/v1` : 'http://localhost:5000/v1';
