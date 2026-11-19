import type { FastifyInstance } from 'fastify';

import { requireAdminApi, requireLoginApi } from '../../shared/authentication';
import { UserController } from './Usercontroller';
import { getDatabaseProvider } from '../../shared';

type IdRoute = { Params: { id: string } };

const userController = new UserController(getDatabaseProvider());

export default async function userRoutes(server: FastifyInstance) {
  server.post('/login', (request, reply) =>
    userController.login(request, reply),
  );

  server.get('/user/me', { preHandler: requireLoginApi }, (request, reply) =>
    userController.currentUser(request, reply),
  );

  server.get<{ Params: { cep: string } }>('/cep/:cep', (request, reply) =>
    userController.buscarCep(request, reply),
  );

  server.post('/user', (request, reply) =>
    userController.register(request, reply),
  );

  server.get('/user', { preHandler: requireAdminApi }, (request, reply) =>
    userController.list(request, reply),
  );

  server.put<IdRoute>(
    '/user/:id',
    { preHandler: requireAdminApi },
    (request, reply) => userController.update(request, reply),
  );

  server.delete<IdRoute>(
    '/user/:id',
    { preHandler: requireAdminApi },
    (request, reply) => userController.destroy(request, reply),
  );
}
