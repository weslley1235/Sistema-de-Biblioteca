import { IEntity, Response } from '../../../shared';

export type BookProps = {
  id: string;
  title: string;
  autor: string;
  ano: number;
};

export class Book implements IEntity {
  id: string;
  title: string;
  autor: string;
  ano: number;

  constructor(props: BookProps) {
    this.id = props.id;
    this.title = props.title;
    this.autor = props.autor;
    this.ano = props.ano;
  }

  public validate(): Response<void> {
    if (typeof this.ano !== 'number') {
      return {
        isFail: true,
        error: {
          message: 'Ano precisa ser um número válido',
        },
      };
    }
    if (typeof this.title !== 'string' || this.title.trim() === '') {
      return {
        isFail: true,
        error: { message: 'Título precisa ser uma string válida' },
      };
    }

    if (typeof this.autor !== 'string' || this.autor.trim() === '') {
      return {
        isFail: true,
        error: { message: 'Autor precisa ser uma string válida' },
      };
    }

    if (typeof this.ano !== 'number' || !Number.isInteger(this.ano)) {
      return {
        isFail: true,
        error: { message: 'Ano precisa ser um número inteiro' },
      };
    }

    if (this.ano < 1900 || this.ano > new Date().getFullYear()) {
      return {
        isFail: true,
        error: {
          message: `Ano precisa estar entre 1900 e ${new Date().getFullYear()}`,
        },
      };
    }

    return {
      isFail: false,
    };
  }
}
