import { UserRepository, USER_NOT_FOUND } from '../repositories/index.js';
import type { UseCaseResult } from './types.js';

export async function destroy(id: string): Promise<UseCaseResult> {
  try {
    const repository = new UserRepository();

    const found = await repository.findById(id);

    if (found.isFail) {
      if (found.error?.message === USER_NOT_FOUND) {
        return { status: 404, message: 'Usuario nao encontrado' };
      }

      throw new Error(found.error?.message ?? 'Erro ao buscar usuário');
    }

    const loans = await repository.hasLoans(id);

    if (loans.isFail) {
      throw new Error(loans.error?.message ?? 'Erro ao verificar empréstimos');
    }

    if (loans.success?.value) {
      return {
        status: 409,
        message:
          'Este usuário possui empréstimos registrados e não pode ser excluído',
      };
    }

    const destroyed = await repository.destroy(id);

    if (destroyed.isFail) {
      throw new Error(destroyed.error?.message ?? 'Erro ao excluir usuário');
    }

    return { status: 200, message: 'Usuario excluido com sucesso' };
  } catch (error) {
    return {
      status: 500,
      message: error instanceof Error ? error.message: 'Erro ao exluir usuário',
    };
  }
}