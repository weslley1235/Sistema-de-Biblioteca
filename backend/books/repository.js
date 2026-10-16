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
6;
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

function update(id, dados) {
  try {
    const books = list();
    const index = books.findIndex((book) => String(book.id) === String(id));

    if( index == -1 ){
      return false;
    }

    books[index] = { ...books[index], ...dados};
    save(books);

    return true;
    
  } catch (error) {
    throw new Error(error.message);
  }
}

export { list, save, findById, findByTitle, update, destroy };
