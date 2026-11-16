import type { FastifyInstance } from 'fastify';

import { UserController } from './Usercontroller.js';

type IdRoute = { Params: { id: string } };

const userController = new UserController();

export default async function userRoutes(server: FastifyInstance) {

  server.post('/user', (request, reply) => userController.register(request, reply));

  server.post('/login', (request, reply) => userController.login(request, reply));

  server.get('/user', (request, reply) => userController.list(request, reply));

  server.get('/user/me', (request, reply) => userController.currentUser(request, reply));

  server.put<IdRoute>('/user/:id', (request, reply) => userController.update(request, reply));
  
  server.delete<IdRoute>('/user/:id', (request, reply) => userController.destroy(request, reply));
}