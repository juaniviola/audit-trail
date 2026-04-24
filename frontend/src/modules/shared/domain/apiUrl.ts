const url = process.env.NEXT_PUBLIC_API_URL;

export const apiUrl = url ? `${url.replace(/\/$/, '')}/v1` : '/api/v1';
