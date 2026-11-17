import { unknown } from 'zod';
import type { IEntity, Response } from '../../../shared/index';

export type UserProps = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tel: string;
  tipoUsu: string;
  matricula?: string;
};

function isFilledText(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

export class User implements IEntity {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tel: string;
  tipoUsu: string;
  matricula?: string;

  constructor(props: UserProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.email = props.email;
    this.cpf = props.cpf;
    this.tel = props.tel;
    this.tipoUsu = props.tipoUsu;
    this.matricula = props.matricula;
  }

  public validate(): Response<void> {
    if (!isFilledText(this.id)) {
      return {
        isFail: true,
        error: { message: 'ID precisa ser uma string válida' },
      };
    }
    if (!isFilledText(this.nome)) {
      return {
        isFail: true,
        error: { message: 'Nome precisa ser uma string válida' },
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      return { isFail: true, error: { message: 'E-mail inválido' } };
    }

    if (!/^\d{11}$/.test(this.cpf)) {
      return {
        isFail: true,
        error: { message: 'O CPF deve conter 11 dígitos' },
      };
    }

    if (!/^\d{11}$/.test(this.tel)) {
      return {
        isFail: true,
        error: { message: 'O telefone deve conter 11 dígitos' },
      };
    }

    if (!isFilledText(this.tipoUsu)) {
      return {
        isFail: true,
        error: { message: 'Tipo de usuário obrigatório' },
      };
    }

    if (this.tipoUsu === 'administracao') {
      if (
        !isFilledText(this.matricula) ||
        !/^[A-Za-z0-9]{1,15}$/.test(this.matricula)
      ) {
        return { isFail: true, error: { message: 'Matrícula inválida' } };
      }
    }

    return { isFail: false };
  }
}
