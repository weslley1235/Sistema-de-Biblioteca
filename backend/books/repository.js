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

function save(books) {
  try {
    fs.writeFileSync(path, JSON.stringify(books, null, 2));
  } catch (error) {
    throw new Error(error.message);
  }
}

function findById(id) {
  try {
    const books = list();
    return books.find((book) => book.id === id);
  } catch (error) {
    throw new Error(error.message);
  }
}

function findByTitle(title) {
  try {
    const books = list();
    return books.find(
      (book) => book.title.toLowerCase() === title.toLowerCase(),
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

function destroy(id) {
  try {
    const books = list();
    const newBooks = books.filter((book) => String(book.id) !== String(id));
    save(newBooks);
  } catch (error) {
    throw new Error(error.message);
  }
}

export { list, save, findById, findByTitle, destroy };
