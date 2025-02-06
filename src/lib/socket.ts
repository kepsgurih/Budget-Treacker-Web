import { io } from 'socket.io-client';

const accessToken = localStorage.getItem('accessToken');

export const socket = io(import.meta.env.VITE_BASE_BE,{
    extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
    }
});