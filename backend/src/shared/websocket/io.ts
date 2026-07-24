import type { Server as HttpServer } from 'node:http'
import { Server as SocketIOServer } from 'socket.io'
import { env } from '../../config/env'

let io: SocketIOServer

export function createSocketIOServer(httpServer: HttpServer): SocketIOServer {
	io = new SocketIOServer(httpServer, {
		cors: {
			origin: env.FRONTEND_URL
		},
	})

	return io
}

export function getIO(): SocketIOServer {
	if (!io) {
		throw new Error('Socket.IO ainda não foi inicializado')
	}

	return io
}
