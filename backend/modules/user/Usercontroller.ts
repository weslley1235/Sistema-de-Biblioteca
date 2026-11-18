
import type { ZodError } from 'zod';
import type { publicUser } from './usecases/types.js';
import type { FastifyReply, FastifyRequest } from 'fastify';


import {getDatabaseProvider, type DatabaseProvider } from '../../shared/index.js';
import {DestroyUserFactory,ListUsersFactory,LoginUserFactory,RegisterUserFactory,UpdateUserFactory} from './usecases/index.js';
import {userValidation,userLoginValidation,userUpdateValidation} from './validator.js';

type IdParams = FastifyRequest<{
  Params: { id: string };
}>;

export class UserController {
  constructor(private readonly provider: DatabaseProvider = getDatabaseProvider()) {}

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

      const usuario = request.session.get('usuario');

      if (
        validation.data.tipoUsu === 'administracao' &&
        usuario?.tipoUsu !== 'administracao'
      ) {
        return reply.code(403).send({
          message: 'Somente um administrador pode cadastrar outro administrador',
        });
      }

      const registerUserUsecase = RegisterUserFactory.factory(this.provider);
      const result = await registerUserUsecase.execute(validation.data);

      if (result.status !== 201 || !result.user) {
        return reply.code(result.status).send(result);
      }

      return reply.code(201).send({
        message: result.message,
        matricula: result.matricula,
      });
    } catch (error) {
      return this.sendServerError(request, reply, error, 'Erro ao cadastrar usuário');
    }
  }

  public async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validation = userLoginValidation(request.body);

      if (!validation.success) {
        return this.sendInvalidData(reply, validation.error);
      }

      const { email, password, matricula, cpf } = validation.data;

      const loginUserUsecase = LoginUserFactory.factory(this.provider);
      const result = await loginUserUsecase.execute(email, password, matricula, cpf);

      if (result.status !== 200 || !result.user) {
        return reply.code(result.status).send(result);
      }

      await this.startSession(request, result.user);

      return reply.send({
        message: result.message,
        tipoUsu: result.user.tipoUsu,
      });
    } catch (error) {
      return this.sendServerError(request, reply, error, 'Erro ao realizar login');
    }
  }

  public async update(request: IdParams, reply: FastifyReply) {
    try {
      const validation = userUpdateValidation(request.body);

      if (!validation.success) {
        return this.sendInvalidData(reply, validation.error);
      }

      const updateUserUsecase = UpdateUserFactory.factory(this.provider);
      const result = await updateUserUsecase.execute(request.params.id, validation.data);

      if (result.status !== 200) {
        return reply.code(result.status).send(result);
      }

      return reply.send({ message: result.message });
    } catch (error) {
      return this.sendServerError(request, reply, error, 'Erro ao atualizar usuário');
    }
  }

  public async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const listUsersUsecase = ListUsersFactory.factory(this.provider);

      return reply.send(await listUsersUsecase.execute());
    } catch (error) {
      return this.sendServerError(request, reply, error, 'Erro ao listar usuários');
    }
  }

  public async currentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const usuario = request.session.get('usuario');

      if (!usuario) {
        return reply.code(401).send({ message: 'Usuário não autenticado' });
      }

      const cpf = usuario.cpf;

      return reply.send({
        nome: usuario.nome,
        email: usuario.email,
        tel: usuario.tel,
        tipoUsu: usuario.tipoUsu,
        cep: usuario.cep,
        state: usuario.state,
        city: usuario.city,
        street: usuario.street,
        cpf: `${cpf.slice(0, 3)}${'*'.repeat(Math.max(0, cpf.length - 5))}${cpf.slice(-2)}`,
      });
    } catch (error) {
      return this.sendServerError(request, reply, error, 'Erro ao buscar usuário logado');
    }
  }

  public async destroy(request: IdParams, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const usuario = request.session.get('usuario');

      const destroyUserUsecase = DestroyUserFactory.factory(this.provider);
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
      return this.sendServerError(request, reply, error, 'Erro ao excluir usuário');
    }
  }
}
