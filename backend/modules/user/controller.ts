import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodError } from 'zod';
import type { publicUser } from './usecases/types.js';

import { register, login, destroy, list, update } from './usecases/index.js';
import {userValidation,userLoginValidation,userUpdateValidation} from './validator.js';

type IdParams = FastifyRequest<{
  Params: { id: string };
}>;

function sendInvalidData(reply: FastifyReply, error: ZodError) {
  return reply.code(400).send({
    message: error.issues[0].message,
  });
}

function sendServerError(
  request: FastifyRequest,
  reply: FastifyReply,
  error: unknown,
  message: string,
) {
  request.log.error(error);

  return reply.code(500).send({ message });
}

async function startSession(request: FastifyRequest, user: publicUser) {
  request.session.set('usuario', user);
  await request.session.save();
}

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const validation = userValidation(request.body);

    if (!validation.success) {
      return sendInvalidData(reply, validation.error);
    }

    const result = await register(validation.data);

    if (result.status !== 201 || !result.user) {
      return reply.code(result.status).send(result);
    }

    await startSession(request, result.user);

    return reply.code(201).send({ message: result.message });
  } catch (error) {
    return sendServerError(request, reply, error, 'Erro ao cadastrar usuário');
  }
}

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const validation = userLoginValidation(request.body);

    if (!validation.success) {
      return sendInvalidData(reply, validation.error);
    }

    const { email, password } = validation.data;
    const result = await login(email, password);

    if (result.status !== 200 || !result.user) {
      return reply.code(result.status).send(result);
    }

    await startSession(request, result.user);

    return reply.send({ message: result.message });
  } catch (error) {
    return sendServerError(request, reply, error, 'Erro ao realizar login');
  }
}

export async function updateController(request: IdParams, reply: FastifyReply) {
  try {
    const validation = userUpdateValidation(request.body);

    if (!validation.success) {
      return sendInvalidData(reply, validation.error);
    }

    const result = await update(request.params.id, validation.data);

    if (result.status !== 200) {
      return reply.code(result.status).send(result);
    }

    return reply.send({ message: result.message });
  } catch (error) {
    return sendServerError(request, reply, error, 'Erro ao atualizar usuário');
  }
}

export async function listUsersController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    return reply.send(await list());
  } catch (error) {
    return sendServerError(request, reply, error, 'Erro ao listar usuários');
  }
}

export async function currentUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const usuario = request.session.get('usuario');

    if (!usuario) {
      return reply.code(401).send({ message: 'Usuário não autenticado' });
    }

    return reply.send({ nome: usuario.nome });
  } catch (error) {
    return sendServerError(
      request,
      reply,
      error,
      'Erro ao buscar usuário logado',
    );
  }
}

export async function destroyController(
  request: IdParams,
  reply: FastifyReply,
) {
  try {
    const { id } = request.params;
    const usuario = request.session.get('usuario');

    const result = await destroy(id);

    if (result.status !== 200) {
      return reply.code(result.status).send(result);
    }

    if (usuario?.id !== id) {
      return reply.send(result);
    }

    await request.session.destroy();

    return reply.send({ ...result, propriaConta: true });
  } catch (error) {
    return sendServerError(request, reply, error, 'Erro ao excluir usuário');
  }
}
