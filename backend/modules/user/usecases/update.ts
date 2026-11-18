import {
  databaseStrategy,
  type DatabaseProvider,
  type Response,
} from '../../../shared/index.js';

import { User as UserEntity } from '../entities/index.js';
import { USER_NOT_FOUND } from '../repositories/index.js';
import { PublicUser } from './publicUser.js';
import type { UserResult } from './types.js';
import type { IUserRepository } from '../repositories/index.js';
import type { UserUpdateInput } from '../validator.js';

const takenByOther = (result: Response<UserEntity>, id: string): boolean => {
  if (!result.isFail) {
    return result.success?.value.id !== id;
  }

  if (result.error?.message === USER_NOT_FOUND) {
    return false;
  }

  throw new Error(result.error?.message ?? 'Erro ao consultar usuário');
};

export class UpdateUserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(id: string, data: UserUpdateInput): Promise<UserResult> {
    const current = await this.userRepository.findById(id);

    if (current.isFail || !current.success) {
      if (current.error?.message === USER_NOT_FOUND) {
        return { status: 404, message: 'Usuário não encontrado' };
      }

      throw new Error(current.error?.message ?? 'Erro ao buscar usuário');
    }

    const currentUser = current.success.value;
    const cpf = data.cpf || currentUser.cpf;

    if (takenByOther(await this.userRepository.findByEmail(data.email), id)) {
      return { status: 409, message: 'E-mail já cadastrado' };
    }

    if (takenByOther(await this.userRepository.findByCpf(cpf), id)) {
      return { status: 409, message: 'CPF já cadastrado' };
    }

    const user = new UserEntity({
      id,
      nome: data.nome,
      email: data.email,
      cpf,
      tel: data.tel,
      tipoUsu: currentUser.tipoUsu,
      matricula: currentUser.matricula,
    });

    const validation = user.validate();

    if (validation.isFail) {
      return {
        status: 400,
        message: validation.error?.message ?? 'Usuário inválido',
      };
    }

    const updated = await this.userRepository.update(user);

    if (updated.isFail) {
      return {
        status: 500,
        message: updated.error?.message ?? 'Erro ao atualizar usuário',
      };
    }

    return {
      status: 200,
      message: 'Usuário atualizado com sucesso',
      user: PublicUser.execute(user),
    };
  }
}

export class UpdateUserFactory {
  public static factory(provider: DatabaseProvider) {
    return new UpdateUserUsecase(databaseStrategy[provider]().user);
  }
}
