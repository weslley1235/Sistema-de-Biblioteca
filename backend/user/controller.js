import { register, login, destroy, list, update } from './usecases/index.js';
import {userValidation,userLoginValidation,userUpdateValidation} from './validator.js';

function sendInvalidData(reply, validation) {
  return reply.code(400).send({
    message: validation.error.issues[0].message,
  });
}

function sendServerError(request, reply, error, message) {
  request.log.error(error);

  return reply.code(500).send({ message });
}

async function startSession(request, user) {
  request.session.set('usuario', user);
  await request.session.save();
}

export async function registerController(request, reply) {
  try {
    const validation = userValidation(request.body);

    if (!validation.success) {
      return sendInvalidData(reply, validation);
    }

    const result = await register(validation.data);

    if (result.status !== 201) {
      return reply.code(result.status).send(result);
    }

    await startSession(request, result.user);

    return reply.code(201).send({ message: result.message });
  } catch (error) {
    return sendServerError(request, reply, error, 'Erro ao cadastrar usuário');
  }
}

export async function loginController(request, reply) {
  try {
    const validation = userLoginValidation(request.body);

    if (!validation.success) {
      return sendInvalidData(reply, validation);
    }

    const { email, password } = validation.data;
    const result = await login(email, password);

    if (result.status !== 200) {
      return reply.code(result.status).send(result);
    }

    await startSession(request, result.user);

    return reply.send({ message: result.message });
  } catch (error) {
    return sendServerError(request, reply, error, 'Erro ao realizar login');
  }
}

export async function updateController(request, reply) {
  try {
    const validation = userUpdateValidation(request.body);

    if (!validation.success) {
      return sendInvalidData(reply, validation);
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

export async function listUsersController(request, reply) {
  try {
    return reply.send(await list());
  } catch (error) {
    return sendServerError(request, reply, error, 'Erro ao listar usuários');
  }
}

export async function currentUserController(request, reply) {
  try {
    const usuario = request.session.get('usuario');

    if (!usuario) {
      return reply.code(401).send({ message: 'Usuário não autenticado' });
    }

    return reply.send({ nome: usuario.nome });
  } catch (error) {
    return sendServerError(request, reply, error, 'Erro ao buscar usuário logado');
  }
}

export async function destroyController(request, reply) {
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