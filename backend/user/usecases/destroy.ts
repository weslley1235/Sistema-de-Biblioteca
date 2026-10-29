import { findById, destroy as destroyUser } from '../repository.js';
import type { UseCaseResult } from './types.js'

export async function destroy(id: string): Promise<UseCaseResult> {
  try {
    const user = await findById(id);

    if (!user) {
      return {
        status: 404,
        message: 'Usuario nao encontrado',
      };
    }

    await destroyUser(id);

    return {
      status: 200,
      message: 'Usuario excluido com sucesso',
    };
  } catch (error) {
    return {
      status: 500,
      message: error instanceof Error ? error.message : 'Erro ao excluir usuário',
    };
  }
}
