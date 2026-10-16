// IMPORTAÇÕES
import { v4 as uuidv4 } from 'uuid';

import { bookValidation } from './books/validator.js';
import { findByTitle, save } from './books/repository.js';

// CADASTRAR LIVRO

export async function registrar(titulo, autor, ano) {
  try {
    const validation = bookValidation({ titulo, autor, ano });

    if (!validation.success) {
      return {
        status: 400,
        message: validation.error.issues[0].message,
      };
    }

    const findBook = findByTitle(titulo);

    if (findBook) {
      return {
        status: 409,
        message: 'Esse livro já tem cadastro',
      };
    }

    await save({
      id: uuidv4(),
      titulo,
      autor,
      ano,
    });

    return {
      status: 201,
      message: 'Livro cadastrado com sucesso',
    };
  } catch (error) {
    return {
      status: 500,
      mensage: error.mensage,
    };
  }
}
