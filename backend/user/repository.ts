import type { QueryResult, QueryResultRow } from 'pg';

import database from '../../database/db.js';
import { unknown } from 'zod';

export type User = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tel: string;
  tipousu: string;
  senha: string;
}
export type NewUser = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tel: string;
  tipoUsu: string;
  senha: string;
};

export type UserUpdateData = Pick<User, 'nome' | 'email' | 'cpf' | 'tel'>;

async function query<T extends QueryResultRow = QueryResultRow> (
  errorMessage: string,
  sql: string,
  params: unknown[] = [],
): Promise<QueryResult<T>>{
  try { 
    return await database.query<T>(sql, params);
  } catch (error) {
    throw new Error(errorMessage, { cause: error });
  }
}

async function list(): Promise<User[]> {
  const result = await query<User> (
    'Erro ao listar usuários',
    'SELECT * FROM usuarios ORDER BY nome',
  );

  return result.rows;
}

async function save(user: NewUser): Promise<User | undefined> {
  const { id, nome, email, cpf, tel, tipoUsu, senha } = user;

  const result = await query<User>(
    'Erro ao salvar usuário',
    `INSERT INTO usuarios (id, nome, email, cpf, tel, tipousu, senha)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [id, nome, email, cpf, tel, tipoUsu, senha],
  );

  return result.rows[0];
}

async function findById(id: string): Promise<User | undefined> {
  const result = await query<User>(
    'Erro ao buscar usuário por id',
    'SELECT * FROM usuarios WHERE id = $1',
    [id],
  );

  return result.rows[0];
}

async function findByEmail(email: string): Promise<User | undefined> {
  const result = await query<User>(
    'Erro ao buscar usuário por email',
    'SELECT * FROM usuarios WHERE email = $1',
    [email],
  );

  return result.rows[0];
}

async function findByCpf(cpf: string): Promise<User | undefined> {
  const result = await query<User>(
    'Erro ao buscar usuário por CPF',
    'SELECT * FROM usuarios WHERE cpf = $1',
    [cpf],
  );

  return result.rows[0];
}


async function destroy(id: string): Promise<boolean> {
  const result = await query(
    'Erro ao excluir usuário',
    'DELETE FROM usuarios WHERE id = $1',
    [id],
  );

  return (result.rowCount ?? 0) > 0 ;
}

async function update(id: string, { nome, email, cpf, tel }: UserUpdateData,
): Promise<User | undefined> {
  const result = await query<User>(
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

