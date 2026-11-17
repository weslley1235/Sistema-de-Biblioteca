import type { Response } from '../../../shared/index';
import { User as UserEntity } from '../entities/index';
import { UserRepository, USER_NOT_FOUND } from '../repositories/index';
import type { userUpdateInput } from '../validator';
import { PublicUser } from './publicUser';
import type { UserResult } from './types';

export class UpdateUserUsecase {
  private takenByOther(result: Response<UserEntity>, id: string): boolean {
    if (!result.isFail) return result.success?.value.id !== id;

    if (result.error?.message === USER_NOT_FOUND) return false;

    throw new Error(result.error?.message ?? 'Erro ao consultar usuário');
  }

  public async execute(id: string, data: userUpdateInput): Promise<UserResult> {
    const repository = new UserRepository();

    const current = await repository.findById(id);

    if (current.isFail || !current.success) {
      if (current.error?.message === USER_NOT_FOUND) {
        return { status: 404, message: 'Usuário não encontrado' };
      }

      throw new Error(current.error?.message ?? 'Erro ao buscar usuário');
    }

    const currentUser = current.success.value;
    const cpf = data.cpf || currentUser.cpf;

    if (this.takenByOther(await repository.findByEmail(data.email), id)) {
      return { status: 409, message: 'E-mail já cadastrado' };
    }

    if (this.takenByOther(await repository.findByCpf(cpf), id)) {
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

    const updated = await repository.update(user);

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
