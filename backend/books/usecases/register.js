import { v4 as uuidv4 } from 'uuid';

import { findByTitle, save } from '../repository.js';

export async function register(data) {
  try {
    const existingBook = await findByTitle(data.title);

    if (existingBook) {
      return {
        status: 409,
        message: 'Esse livro já tem cadastro',
      };
    }

    await save({
      id: uuidv4(),
      ...data,
    });

    return {
      status: 201,
      message: 'Livro cadastrado com sucesso',
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
    };
  }
}