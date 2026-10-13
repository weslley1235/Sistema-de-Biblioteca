import { findById, destroy as destroyUser } from '../repository.js';

export function destroy(id) {
  try {
    const user = findById(id);

    if (!user) {
      return {
        status: 404,
        message: 'Usuario nao encontrado',
      };
    }

    destroyUser(id);
    return {
      status: 200,
      message: 'Usuario excluido com sucesso',
    };
    
  } catch (error) {
    return {
      status: 500,
      message: error.message,
    };
  }
}
