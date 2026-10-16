import fs from 'node:fs';
const path = './banco/livros.json';

function list() {
  try {
    const dados = fs.readFileSync(path, 'utf8');

    return JSON.parse(dados);
  } catch (error) {
    throw new Error(error.message);
  }
}

function save(book) {
  const books = list();

  const foundBook = books.find((livro) => livro.id == book.id);

  try {
    const toRegisterBook = !foundBook ? register(book) : update(foundBook);

    // let toRegisterBook = register(book);

    // if (!foundBook) {
    //   toRegisterBook = update(foundBook);
    // }

    books.push(toRegisterBook);

    fs.writeFileSync(path, JSON.stringify(books, null, 2));

    return book;
  } catch (error) {
    throw new Error(error.message);
  }
}

function findById(id) {
  try {
    const books = list();

    return books.find((livro) => livro.id == id);
  } catch (error) {
    throw new Error(error.message);
  }
}

function findByTitle(title) {
  try {
    const books = list();

    return books.find(
      (book) => book.title.toLowerCase() == title.toLowerCase(),
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

function destroy(id) {
  try {
    const livros = list();

    const novoLivro = livros.filter((livro) => livro.id != id);

    fs.writeFileSync(path, JSON.stringify(novoLivro, null, 2));
  } catch (error) {
    throw new Error(error.message);
  }
}

function register(book) {
  try {
    return book;
  } catch (error) {
    throw new Error(error.message);
  }
}

function update(foundBook, newBook) {
  try {
    foundBook.titulo = newBook.titulo;
    foundBook.autor = newBook.autor;
    foundBook.ano = newBook.ano;

    return foundBook;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { list, save, findById, findByTitle, destroy };
