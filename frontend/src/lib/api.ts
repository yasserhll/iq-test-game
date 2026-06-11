import axios from 'axios';
import type { WishlistPayload, ApiResponse, Character } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: false,
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const message = err.response?.data?.message ?? 'Une erreur est survenue.';
    return Promise.reject(new Error(message));
  }
);

export async function submitWishlist(payload: WishlistPayload): Promise<ApiResponse<null>> {
  const { data } = await api.post<ApiResponse<null>>('/wishlist', payload);
  return data;
}

export async function fetchCharacters(): Promise<Character[]> {
  const { data } = await api.get<ApiResponse<Character[]>>('/characters');
  return data.data;
}

export default api;
