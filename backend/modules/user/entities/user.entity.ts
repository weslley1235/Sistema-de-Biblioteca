import type { IEntity, Response } from '../../../shared/index';

export type UserProps = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tel: string;
  tipoUsu: string;
  matricula?: string;
  cep: string;
  state: string;
  city: string;
  street: string;
};

function isFilledText(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

const lettersRegex = /^[\p{L}\s'-]{2,}$/u;

export class User implements IEntity {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tel: string;
  tipoUsu: string;
  matricula?: string;
  cep: string;
  state: string;
  city: string;
  street: string;

  constructor(props: UserProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.email = props.email;
    this.cpf = props.cpf;
    this.tel = props.tel;
    this.tipoUsu = props.tipoUsu;
    this.matricula = props.matricula;
    this.cep = props.cep;
    this.state = props.state;
    this.city = props.city;
    this.street = props.street;
  }

  public validate(): Response<void> {
    if (!isFilledText(this.id)) {
      return {
        isFail: true,
        error: { message: 'ID precisa ser uma string válida' },
      };
    }
    if (!isFilledText(this.nome) || !lettersRegex.test(this.nome.trim())) {
      return {
        isFail: true,
        error: { message: 'Nome deve conter apenas letras' },
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

    if (!/^\d{8}$/.test(this.cep)) {
      return {
        isFail: true,
        error: { message: 'O CEP deve conter 8 dígitos' },
      };
    }

    if (!/^[A-Za-z]{2}$/.test(this.state)) {
      return {
        isFail: true,
        error: { message: 'O estado deve conter 2 letras' },
      };
    }

    if (!isFilledText(this.city) || this.city.trim().length < 2) {
      return {
        isFail: true,
        error: { message: 'Cidade inválida' },
      };
    }

    if (!isFilledText(this.street) || this.street.trim().length < 2) {
      return {
        isFail: true,
        error: { message: 'Rua inválida' },
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
