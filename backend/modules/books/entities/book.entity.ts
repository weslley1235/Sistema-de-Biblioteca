import { IEntity, Response } from '../../../shared';

export type BookProps = {
  id: string;
  title: string;
  autor: string;
  ano: number;
};

function isFilledText(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

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
    if (!isFilledText(this.id)) {
      return {isFail: true,error: { message: 'ID precisa ser uma string válida' }};
    }
    if (!isFilledText(this.title)) {
      return {isFail: true,error: { message: 'Titulo precisa ser uma string válida' }};
    }
    if (!isFilledText(this.autor)) {
      return {isFail: true,error: { message: 'Autor precisa ser uma string válida' }};
    }
    if (typeof this.ano !== 'number' || !Number.isInteger(this.ano)) {
      return {isFail: true,error: { message: 'Ano precisa ser um número inteiro' }};
    }
    if (this.ano < 1900 || this.ano > new Date().getFullYear()) {
      return {isFail: true,error: {message: `Ano precisa estar entre 1900 e ${new Date().getFullYear()}`
        },
      };
    }

    return {isFail: false};
    
  }
}
