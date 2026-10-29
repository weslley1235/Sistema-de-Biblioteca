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
    if (typeof this.ano == 'number') {
      return {
        isFail: true,
        error: {
          message: 'Ano precisa ser um número',
        },
      };
    }

    // validar as outras props

    return {
      isFail: false,
    };
  }
}
