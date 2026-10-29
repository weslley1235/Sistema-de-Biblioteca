import type { FastifyInstance } from 'fastify'
import {registerController,loginController,destroyController,currentUserController,listUsersController,updateController} from './controller.js';

type IdRoute = { Params: {id: string } }

export default async function userRoutes(server: FastifyInstance) {
  server.post('/user', registerController);
  server.post('/login', loginController);

  server.get('/user', listUsersController);
  server.get('/user/me', currentUserController);

  server.put<IdRoute>('/user/:id', updateController);
  server.delete<IdRoute>('/user/:id', destroyController);
}