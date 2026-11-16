import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodError } from 'zod';
import type { publicUser } from './usecases/types.js';

import {RegisterUserUsecase,LoginUserUsecase,DestroyUserUsecase,ListUsersUsecase,UpdateUserUsecase} from './usecases/index.js';
import {userValidation,userLoginValidation,userUpdateValidation} from './validator.js';

type IdParams = FastifyRequest<{
  Params: { id: string };
}>;

export class UserController {
  private sendInvalidData(reply: FastifyReply, error: ZodError) {
    return reply.code(400).send({
      message: error.issues[0].message,
    });
  }

  private sendServerError(
    request: FastifyRequest,
    reply: FastifyReply,
    error: unknown,
    message: string,
  ) {
    request.log.error(error);

    return reply.code(500).send({ message });
  }

  private async startSession(request: FastifyRequest, user: publicUser) {
    request.session.set('usuario', user);
    await request.session.save();
  }

  public async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validation = userValidation(request.body);

      if (!validation.success) {
        return this.sendInvalidData(reply, validation.error);
      }

      const registerUserUsecase = new RegisterUserUsecase();
      const result = await registerUserUsecase.execute(validation.data);

      if (result.status !== 201 || !result.user) {
        return reply.code(result.status).send(result);
      }

      await this.startSession(request, result.user);

      return reply.code(201).send({
        message: result.message,
        matricula: result.matricula,
      });
    } catch (error) {
      return this.sendServerError(
        request,
        reply,
        error,
        'Erro ao cadastrar usuário',
      );
    }
  }

  public async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validation = userLoginValidation(request.body);

      if (!validation.success) {
        return this.sendInvalidData(reply, validation.error);
      }

      const { email, password, matricula } = validation.data;

      const loginUserUsecase = new LoginUserUsecase();
      const result = await loginUserUsecase.execute(email, password, matricula);

      if (result.status !== 200 || !result.user) {
        return reply.code(result.status).send(result);
      }

      await this.startSession(request, result.user);

      return reply.send({ message: result.message });
    } catch (error) {
      return this.sendServerError(
        request,
        reply,
        error,
        'Erro ao realizar login',
      );
    }
  }

  public async update(request: IdParams, reply: FastifyReply) {
    try {
      const validation = userUpdateValidation(request.body);

      if (!validation.success) {
        return this.sendInvalidData(reply, validation.error);
      }

      const updateUserUsecase = new UpdateUserUsecase();
      const result = await updateUserUsecase.execute(
        request.params.id,
        validation.data,
      );

      if (result.status !== 200) {
        return reply.code(result.status).send(result);
      }

      return reply.send({ message: result.message });
    } catch (error) {
      return this.sendServerError(
        request,
        reply,
        error,
        'Erro ao atualizar usuário',
      );
    }
  }

  public async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const listUsersUsecase = new ListUsersUsecase();

      return reply.send(await listUsersUsecase.execute());
    } catch (error) {
      return this.sendServerError(
        request,
        reply,
        error,
        'Erro ao listar usuários',
      );
    }
  }

  public async currentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const usuario = request.session.get('usuario');

      if (!usuario) {
        return reply.code(401).send({ message: 'Usuário não autenticado' });
      }

      return reply.send({
        nome: usuario.nome,
        tipoUsu: usuario.tipoUsu,
      });
    } catch (error) {
      return this.sendServerError(
        request,
        reply,
        error,
        'Erro ao buscar usuário logado',
      );
    }
  }

  public async destroy(request: IdParams, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const usuario = request.session.get('usuario');

      const destroyUserUsecase = new DestroyUserUsecase();
      const result = await destroyUserUsecase.execute(id);

      if (result.status !== 200) {
        return reply.code(result.status).send(result);
      }

      if (usuario?.id !== id) {
        return reply.send(result);
      }

      await request.session.destroy();

      return reply.send({ ...result, propriaConta: true });
    } catch (error) {
      return this.sendServerError(
        request,
        reply,
        error,
        'Erro ao excluir usuário',
      );
    }
  }
}
