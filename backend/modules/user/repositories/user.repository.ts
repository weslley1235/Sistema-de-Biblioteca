import type { QueryResult, QueryResultRow } from 'pg';

import database from '../../../../database/db';
import type { Response } from '../../../shared/index';
import { User, type UserTypesProp } from '../entities/index';
import { USER_NOT_FOUND } from './user.repository.interface.js';
import type {IUserRepository,UserCredentials} from './user.repository.interface';

type UserRow = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tel: string;
  tipousu: UserTypesProp;
  senha: string;
  cep: string;
  state: string;
  city: string;
  street: string;
};

export class UserRepository implements IUserRepository {
  private async query<T extends QueryResultRow = QueryResultRow>(
    errorMessage: string,
    sql: string,
    params: unknown[] = [],
  ): Promise<QueryResult<T>> {
    try {
      return await database.query<T>(sql, params);
    } catch (error) {
      throw new Error(errorMessage, { cause: error });
    }
  }

  private toEntity(row: UserRow): User {
    return new User({
      id: row.id,
      nome: row.nome,
      email: row.email,
      cpf: row.cpf,
      tel: row.tel,
      tipoUsu: row.tipousu,
      cep: row.cep,
      state: row.state,
      city: row.city,
      street: row.street,
    });
  }

  private fail<T>(error: unknown, fallback: string): Response<T> {
    return {
      isFail: true,
      error: { message: error instanceof Error ? error.message : fallback },
    };
  }

  private async findOne(
    errorMessage: string,
    column: 'id' | 'email' | 'cpf',
    value: string,
  ): Promise<Response<User>> {
    try {
      const result = await this.query<UserRow>(
        errorMessage,
        `SELECT * FROM usuarios WHERE ${column} = $1`,
        [value],
      );

      const row = result.rows[0];

      if (!row) {
        return { isFail: true, error: { message: USER_NOT_FOUND } };
      }

      return { isFail: false, success: { value: this.toEntity(row) } };
    } catch (error) {
      return this.fail(error, 'Houve um erro ao buscar o usuário');
    }
  }

  public async save(user: User, passwordHash: string): Promise<Response<void>> {
    try {
      await this.query(
        'Erro ao salvar usuário',
        `INSERT INTO usuarios (id, nome, email, cpf, tel, tipousu, senha, cep, state, city, street)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          user.id,
          user.nome,
          user.email,
          user.cpf,
          user.tel,
          user.tipoUsu,
          passwordHash,
          user.cep,
          user.state,
          user.city,
          user.street,
        ],
      );

      return { isFail: false };
    } catch (error) {
      return this.fail(error, 'Houve um erro ao salvar o usuário');
    }
  }

  public async list(): Promise<Response<Array<User>>> {
    try {
      const result = await this.query<UserRow>(
        'Erro ao listar usuários',
        'SELECT * FROM usuarios ORDER BY nome',
      );

      return {
        isFail: false,
        success: { value: result.rows.map((row) => this.toEntity(row)) },
      };
    } catch (error) {
      return this.fail(error, 'Houve um erro ao listar os usuários');
    }
  }

  public async findById(id: string): Promise<Response<User>> {
    return this.findOne('Erro ao buscar usuário por id', 'id', id);
  }

  public async findByEmail(email: string): Promise<Response<User>> {
    return this.findOne('Erro ao buscar usuário por email', 'email', email);
  }

  public async findByCpf(cpf: string): Promise<Response<User>> {
    return this.findOne('Erro ao buscar usuário por CPF', 'cpf', cpf);
  }

  public async findCredentialsByEmail(
    email: string,
  ): Promise<Response<UserCredentials>> {
    try {
      const result = await this.query<UserRow>(
        'Erro ao buscar usuário por email',
        'SELECT * FROM usuarios WHERE email = $1',
        [email],
      );
      const row = result.rows[0];

      if (!row) {
        return { isFail: true, error: { message: USER_NOT_FOUND } };
      }

      return {
        isFail: false,
        success: {
          value: { user: this.toEntity(row), passwordHash: row.senha },
        },
      };
    } catch (error) {
      return this.fail(error, 'Houve um erro ao buscar o usuário');
    }
  }

  public async update(user: User): Promise<Response<void>> {
    try {
      const result = await this.query(
        'Erro ao atualizar usuário',
        `UPDATE usuarios 
             SET nome = $1, email = $2, cpf = $3, tel = $4, cep = $5, state = $6, city = $7, street = $8
             WHERE id = $9`,
        [
          user.nome,
          user.email,
          user.cpf,
          user.tel,
          user.cep,
          user.state,
          user.city,
          user.street,
          user.id,
        ],
      );

      if ((result.rowCount ?? 0) == 0) {
        return { isFail: true, error: { message: 'Usuário não encontrado' } };
      }

      return { isFail: false };
    } catch (error) {
      return this.fail(error, 'Houve um erro ao atualizar o usuário');
    }
  }

  public async destroy(id: string): Promise<Response<void>> {
    try {
      const result = await this.query(
        'Erro ao exluir usuário',
        'DELETE FROM usuarios WHERE id = $1',
        [id],
      );
      if ((result.rowCount ?? 0) == 0) {
        return { isFail: true, error: { message: 'Usuário não encontrado' } };
      }

      return { isFail: false };
    } catch (error) {
      return this.fail(error, 'Houve um erro ao ecluir o usuário');
    }
  }

  public async hasLoans(id: string): Promise<Response<boolean>> {
    try {
      const result = await this.query(
        'Erro ao verficar empréstimos do Usuário',
        `SELECT 1 FROM emprestimos 
         WHERE usuario_id = $1 AND devolvido = FALSE
         LIMIT 1`,
        [id],
      );

      return {
        isFail: false,
        success: { value: (result.rowCount ?? 0) > 0 },
      };
    } catch (error) {
      return this.fail(error, 'Houve um erro ao verificar os empréstimos');
    }
  }
}


// TERMINAR DE ARRUMAR AS REGRAS DE NEGOCIO E VER SE TODAS SÃ TOTALMENTE NECESSARIAS
// PARA O CASO DE USU 