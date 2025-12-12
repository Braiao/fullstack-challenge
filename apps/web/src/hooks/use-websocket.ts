import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3004';

export function useWebSocket(onEvent: (event: string, data: any) => void) {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const socket = io(WS_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
      socket.emit('authenticate', user.id);
    });

    socket.on('task:created', (data) => {
      onEvent('task:created', data);
    });

    socket.on('task:updated', (data) => {
      onEvent('task:updated', data);
    });

    socket.on('comment:new', (data) => {
      onEvent('comment:new', data);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [user, onEvent]);

  return socketRef.current;
}
