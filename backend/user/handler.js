import { register, login, destroy } from './usecases/index.js';

export const registerHandler = async (request, reply) => {
  const result = await register(request.body);

  if (result.status !== 201) {
    return reply.code(result.status).send(result);
  }

  request.session.set('usuario', result.user);
  await request.session.save();

  return reply.code(201).send({
    message: result.message,
  });
};

export const loginHandler = async (request, reply) => {
  const result = await login(request.body.email, request.body.password);

  if (result.status !== 200) return reply.code(result.status).send(result);

  request.session.set('usuario', result.user);
  await request.session.save();

  return reply.send({ message: result.message });
};

export const destroyHandler = async (request, reply) => {
  const result = await destroy(request.params.id);
  return reply.code(result.status).send(result);
};

export const currentUserHandler = async (request, reply) => {
  const usuario = request.session.get('usuario');

  if (!usuario) {
    return reply.code(401).send({
      message: 'Usuário não autenticado',
    });
  }

  return reply.send({
    nome: usuario.nome,
  });
};
