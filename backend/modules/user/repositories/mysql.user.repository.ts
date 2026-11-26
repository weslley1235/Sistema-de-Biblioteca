import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import mysqlDatabase from '../../../../database/mysql';
import type { Response } from '../../../shared/index';
import { User, UserTypesProp } from '../entities/index';
import { USER_NOT_FOUND } from './user.repository.interface';
import type {
  IUserRepository,
  UserCredentials,
} from './user.repository.interface';

type UserRow = RowDataPacket & {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tel: string;
  tipousu: string | UserTypesProp;
  senha: string;
  matricula: string | null;
  cep: string;
  state: string;
  city: string;
  street: string;
};

type SearchColumn = 'id' | 'email' | 'cpf';

const SUCCESS: Response<void> = { isFail: false };

function notFound<T>(message = USER_NOT_FOUND): Response<T> {
  return { isFail: true, error: { message } };
}

export class MysqlUserRepository implements IUserRepository {
  private async attempt<T>(
    fallback: string,
    action: () => Promise<Response<T>>,
  ): Promise<Response<T>> {
    try {
      return await action();
    } catch (error) {
      return {
        isFail: true,
        error: { message: error instanceof Error ? error.message : fallback },
      };
    }
  }

  private async select(
    sql: string,
    params: unknown[] = [],
  ): Promise<UserRow[]> {
    const [rows] = await mysqlDatabase.query<UserRow[]>(sql, params);

    return rows;
  }

  private async changeOne(
    fallback: string,
    sql: string,
    params: unknown[],
  ): Promise<Response<void>> {
    return this.attempt(fallback, async () => {
      const [result] = await mysqlDatabase.query<ResultSetHeader>(sql, params);

      return result.affectedRows === 0
        ? notFound('Usuário não encontrado')
        : SUCCESS;
    });
  }

  private async findOne(
    column: SearchColumn,
    value: string,
  ): Promise<Response<User>> {
    return this.attempt('Houve um erro ao buscar o usuário', async () => {
      const [row] = await this.select(
        `SELECT * FROM usuarios WHERE ${column} = ?`,
        [value],
      );

      return row
        ? { isFail: false, success: { value: this.toEntity(row) } }
        : notFound();
    });
  }

  private toEntity(row: UserRow): User {
    const result = User.create({
      id: row.id,
      nome: row.nome,
      email: row.email,
      cpf: row.cpf,
      tel: row.tel,
      tipoUsu: row.tipousu as UserTypesProp,
      matricula: row.matricula ?? undefined,
      cep: row.cep,
      state: row.state,
      city: row.city,
      street: row.street,
    });

    if (result.isFail || !result.success) {
      throw new Error(result.error?.message ?? 'Dados inválidos para o usuário');
    }

    return result.success.value;
  }

  public async save(user: User, passwordHash: string): Promise<Response<void>> {
    return this.attempt('Houve um erro ao salvar o usuário', async () => {
      await mysqlDatabase.query(
        `INSERT INTO usuarios (id, nome, email, cpf, tel, tipousu, senha, matricula, cep, state, city, street)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.nome,
          user.email,
          user.cpf,
          user.tel,
          user.tipoUsu,
          passwordHash,
          user.matricula ?? null,
          user.cep,
          user.state,
          user.city,
          user.street,
        ],
      );

      return SUCCESS;
    });
  }

  public async list(): Promise<Response<Array<User>>> {
    return this.attempt('Houve um erro ao listar os usuários', async () => {
      const rows = await this.select('SELECT * FROM usuarios ORDER BY nome');

      return {
        isFail: false,
        success: { value: rows.map((row) => this.toEntity(row)) },
      };
    });
  }

  public findById(id: string): Promise<Response<User>> {
    return this.findOne('id', id);
  }

  public findByEmail(email: string): Promise<Response<User>> {
    return this.findOne('email', email);
  }

  public findByCpf(cpf: string): Promise<Response<User>> {
    return this.findOne('cpf', cpf);
  }

  public async findCredentialsByEmail(
    email: string,
  ): Promise<Response<UserCredentials>> {
    return this.attempt('Houve um erro ao buscar o usuário', async () => {
      const [row] = await this.select(
        'SELECT * FROM usuarios WHERE email = ?',
        [email],
      );

      return row
        ? {
            isFail: false,
            success: {
              value: { user: this.toEntity(row), passwordHash: row.senha },
            },
          }
        : notFound();
    });
  }

  public async update(user: User): Promise<Response<void>> {
    return this.changeOne(
      'Houve um erro ao atualizar o usuário',
      `UPDATE usuarios
       SET nome = ?, email = ?, cpf = ?, tel = ?, cep = ?, state = ?, city = ?, street = ?
       WHERE id = ?`,
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
  }

  public async destroy(id: string): Promise<Response<void>> {
    return this.changeOne(
      'Houve um erro ao excluir o usuário',
      'DELETE FROM usuarios WHERE id = ?',
      [id],
    );
  }

  public async hasLoans(id: string): Promise<Response<boolean>> {
    return this.attempt(
      'Houve um erro ao verificar os empréstimos',
      async () => {
        const [rows] = await mysqlDatabase.query<RowDataPacket[]>(
          `SELECT 1 FROM emprestimos
           WHERE usuario_id = ? AND devolvido = FALSE
           LIMIT 1`,
          [id],
        );

        return { isFail: false, success: { value: rows.length > 0 } };
      },
    );
  }
}
