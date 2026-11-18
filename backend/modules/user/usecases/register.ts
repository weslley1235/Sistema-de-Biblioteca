import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { ADMIN } from '../../../shared/authentication.js';
import { generateMatricula } from '../../../shared/matricula.js';
import {databaseStrategy,type DatabaseProvider,type Response} from '../../../shared/index.js';
import { User as UserEntity } from '../entities/index.js';
import { USER_NOT_FOUND } from '../repositories/index.js';
import { PublicUser } from './publicUser.js';
import type { UserResult } from './types.js';
import type { UserInput } from '../validator.js';
import type { IUserRepository } from '../repositories/index.js';

function alreadyExists(result: Response<UserEntity>): boolean {
  if (!result.isFail) return true;
  if (result.error?.message === USER_NOT_FOUND) return false;

  throw new Error(result.error?.message ?? 'Erro ao consultar usuário');
}

export class RegisterUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(data: UserInput): Promise<UserResult> {
    try {
      if (alreadyExists(await this.userRepository.findByEmail(data.email))) {
        return { status: 409, message: 'Esse email já está cadastrado' };
      }

      if (alreadyExists(await this.userRepository.findByCpf(data.cpf))) {
        return { status: 409, message: 'Esse CPF já está cadastrado' };
      }

      const matricula =
        data.tipoUsu === ADMIN ? generateMatricula() : undefined;

      const user = new UserEntity({
        id: uuidv4(),
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        tel: data.tel,
        tipoUsu: data.tipoUsu,
        matricula,
        cep: data.cep,
        state: data.state,
        city: data.city,
        street: data.street,
      });

      const validation = user.validate();

      if (validation.isFail) {
        return {
          status: 400,
          message: validation.error?.message ?? 'Usuário inválido',
        };
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      const saved = await this.userRepository.save(user, passwordHash);

      if (saved.isFail) {
        return {
          status: 500,
          message: saved.error?.message ?? 'Erro ao cadastrar usuário',
        };
      }

      return {
        status: 201,
        message: 'Usuário cadastrado com sucesso',
        user: PublicUser.execute(user),
        matricula,
      };
    } catch (error) {
      return {
        status: 500,
        message:
          error instanceof Error ? error.message : 'Erro ao cadastrar usuário',
      };
    }
  }
}

export class RegisterUserFactory {
  public static factory(provider: DatabaseProvider) {
    return new RegisterUserUsecase(databaseStrategy[provider]().user);
  }
}
