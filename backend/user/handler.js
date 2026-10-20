import { register, login, destroy, list, update } from './usecases/index.js';
import { userValidation } from './validator.js';

export const registerHandler = async (request, reply) => {
  const result = userValidation(request.body);

  if (!result.success) {
    return reply.code(400).send({
      message: result.error.issues[0].message,
    });
  }

  const resultRegister = await register(result.data);

  if (resultRegister.status !== 201) {
    return reply.code(resultRegister.status).send(resultRegister);
  }

  request.session.set('usuario', resultRegister.user);
  await request.session.save();

  return reply.code(201).send({
    message: resultRegister.message,
  });
};

export const loginHandler = async (request, reply) => {
  const result = await login(request.body.email, request.body.password);

  if (result.status !== 200) {
    return reply.code(result.status).send(result);
  }

  request.session.set('usuario', result.user);
  await request.session.save();

  return reply.send({
    message: result.message,
  });
};

export const updateHandler = async (request, reply) => {
  const result = await update(request.params.id, request.body);

  if (result.status !== 200) {
    return reply.code(result.status).send(result);
  }

  return reply.send({
    message: result.message,
  });
};

export const listUsersHandler = async (request, reply) => {
  const users = await list();

  return reply.send(users);
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

export const destroyHandler = async (request, reply) => {
  const id = request.params.id;
  const usuario = request.session.get('usuario');

  const result = await destroy(id);

  if (result.status !== 200) {
    return reply.code(result.status).send(result);
  }

  if (usuario?.id === id) {
    await request.session.destroy();

    return reply.send({
      ...result,
      propriaConta: true,
    });
  }

  return reply.send(result);
};
