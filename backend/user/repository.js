import database from '../../database/db.js';

async function query(errorMessage, sql, params = []) {
  try {
    return await database.query(sql, params);
  } catch (error) {
    throw new Error(errorMessage, { cause: error });
  }
}

async function list() {
  const result = await query(
    'Erro ao listar usuários',
    'SELECT * FROM usuarios ORDER BY nome',
  );

  return result.rows;
}

async function save(user) {
  const { id, nome, email, cpf, tel, tipoUsu, senha } = user;

  const result = await query(
    'Erro ao salvar usuário',
    `INSERT INTO usuarios (id, nome, email, cpf, tel, tipousu, senha)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [id, nome, email, cpf, tel, tipoUsu, senha],
  );

  return result.rows[0];
}

async function findById(id) {
  const result = await query(
    'Erro ao buscar usuário por id',
    'SELECT * FROM usuarios WHERE id = $1',
    [id],
  );

  return result.rows[0];
}

async function findByEmail(email) {
  const result = await query(
    'Erro ao buscar usuário por email',
    'SELECT * FROM usuarios WHERE email = $1',
    [email],
  );

  return result.rows[0];
}

async function findByCpf(cpf) {
  const result = await query(
    'Erro ao buscar usuário por CPF',
    'SELECT * FROM usuarios WHERE cpf = $1',
    [cpf],
  );

  return result.rows[0];
}

async function destroy(id) {
  const result = await query(
    'Erro ao excluir usuário',
    'DELETE FROM usuarios WHERE id = $1',
    [id],
  );

  return result.rowCount > 0;
}

async function update(id, { nome, email, cpf, tel }) {
  const result = await query(
    'Erro ao atualizar usuário',
    `UPDATE usuarios
     SET nome = $1, email = $2, cpf = $3, tel = $4
     WHERE id = $5
     RETURNING *`,
    [nome, email, cpf, tel, id],
  );

  return result.rows[0];
}

export { list, save, findById, findByEmail, findByCpf, destroy, update };