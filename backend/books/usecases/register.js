import { v4 as uuidv4 } from 'uuid';

import { bookValidation } from '../validator.js';
import { findByTitle, save } from '../repository.js';

export async function register(payload) {
  try {
    const validation = bookValidation(payload);

    if (!validation.success) {
      return {
        status: 400,
        message: validation.error.issues[0].message,
      };
    }

    const existingBook = await findByTitle(validation.data.title);

    if (existingBook) {
      return {
        status: 409,
        message: 'Esse livro já tem cadastro',
      };
    }

    await save({
      id: uuidv4(),
      ...validation.data,
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