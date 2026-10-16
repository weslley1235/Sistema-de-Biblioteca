import fs from 'node:fs';

const path = './banco/usuario.json';

function list() {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data);
    
  } catch (error) {
    throw new Error(error.message);
  }
}

function save(user) {
  try {
    const users = list();
    users.push(user);
    fs.writeFileSync(path, JSON.stringify(users, null, 2));
    return user;

  } catch (error) {
    throw new Error(error.message);
  }
}

function findById(id) {
  try {
    const users = list();
    return users.find((user) => user.id == id);

  } catch (error) {
    throw new Error(error.message);
  }
}

function findByEmail(email) {
  try {
    const users = list();
    return users.find((user) => user.email == email);

  } catch (error) {
    throw new Error(error.message);
  }
}

function findByCpf(cpf) {
  try {
    const users = list();
    return users.find((user) => user.cpf === cpf);

  } catch (error) {
    throw new Error(error.message);
  }
}

function destroy(id) {
  try {
    const users = list();
    const newUsers = users.filter((user) => user.id !== id);
    fs.writeFileSync(path, JSON.stringify(newUsers, null, 2));

  } catch (error) {
    throw new Error(error.message);
  }
}

export { list, save, findById, findByEmail, findByCpf, destroy };
