import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3333'

export function connectRealtime(userId) {
  const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket', 'polling'],
    auth: { userId },
  })

  return socket
}
