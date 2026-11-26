import type { IEntity, Response } from '../../../shared/index';

export type UserTypesProp = 'administracao' | 'usuario' | 'Professor' | 'Aluno';

export type UserProps = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tel: string;
  tipoUsu: UserTypesProp;
  matricula?: string;
  cep: string;
  state: string ;
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
  tipoUsu: UserTypesProp;
  matricula?: string;
  cep: string;
  state: string;
  city: string;
  street: string;

  public constructor(props: UserProps) {
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

  private static validate(props: UserProps): Response<void> {
    if (!isFilledText(props.id)) {
      return {
        isFail: true,
        error: { message: 'ID precisa ser uma string válida' },
      };
    }
    if (!isFilledText(props.nome) || !lettersRegex.test(props.nome.trim())) {
      return {
        isFail: true,
        error: { message: 'Nome deve conter apenas letras' },
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) {
      return { isFail: true, error: { message: 'E-mail inválido' } };
    }

    if (!/^\d{11}$/.test(props.cpf)) {
      return {
        isFail: true,
        error: { message: 'O CPF deve conter 11 dígitos' },
      };
    }

    if (!/^\d{11}$/.test(props.tel)) {
      return {
        isFail: true,
        error: { message: 'O telefone deve conter 11 dígitos' },
      };
    }

    if (!isFilledText(props.tipoUsu)) {
      return {
        isFail: true,
        error: { message: 'Tipo de usuário obrigatório' },
      };
    }

    if (!/^\d{8}$/.test(props.cep)) {
      return {
        isFail: true,
        error: { message: 'O CEP deve conter 8 dígitos' },
      };
    }

    if (!/^[A-Za-z]{2}$/.test(props.state)) {
      return {
        isFail: true,
        error: { message: 'O estado deve conter 2 letras' },
      };
    }

    if (!isFilledText(props.city) || props.city.trim().length < 2) {
      return {
        isFail: true,
        error: { message: 'Cidade inválida' },
      };
    }

    if (!isFilledText(props.street) || props.street.trim().length < 2) {
      return {
        isFail: true,
        error: { message: 'Rua inválida' },
      };
    }

    if (props.tipoUsu === 'administracao') {
      if (
        !isFilledText(props.matricula) ||
        !/^[A-Za-z0-9]{1,15}$/.test(props.matricula)
      ) {
        return { isFail: true, error: { message: 'Matrícula inválida' } };
      }
    }

    return { isFail: false };
  }

  public static create(props: UserProps): Response<User> {
    const validator = this.validate(props);

    if (validator.isFail) {
      return {
        isFail: true,
        error: {
          message: validator.error?.message as string,
        },
      };
    }

    return {
      isFail: false,
      success: {
        value: new User(props),
      },
    };
  }

  public isAdmin(): boolean {
    return this.tipoUsu === 'administracao';
  }

  public validate(): Response<void> {
    return User.validate(this);
  }
}
