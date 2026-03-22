import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

let socketInstance = null;

export function getSocket() {
  return socketInstance;
}

export default function useSocket() {
  const { token } = useSelector((s) => s.auth);
  const [socket, setSocket] = useState(socketInstance);

  useEffect(() => {
    if (!token) {
      if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        setSocket(null);
      }
      return;
    }

    if (socketInstance?.connected) {
      setSocket(socketInstance);
      return;
    }

    if (socketInstance) socketInstance.disconnect();

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      // Ping-pong keepalive
      pingInterval: 10000,   // send ping every 10s
      pingTimeout: 5000,     // wait 5s for pong before disconnect
    });

    s.on('connect', () => {
      console.log('[Socket] Connected:', s.id);
    });

    s.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      // Auto-reconnect unless server forced disconnect
      if (reason === 'io server disconnect') {
        s.connect();
      }
    });

    s.on('reconnect', (attemptNumber) => {
      console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
    });

    s.on('connect_error', (err) => {
      console.log('[Socket] Connection error:', err.message);
    });

    // Server-side ping-pong (custom heartbeat)
    s.on('ping-check', () => {
      s.emit('pong-check');
    });

    socketInstance = s;
    setSocket(s);
  }, [token]);

  return socket;
}
