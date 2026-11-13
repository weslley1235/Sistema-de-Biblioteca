import type { IEntity, Response } from '../../../shared/index.js';

export type LoanProps = {
  id: string;
  livroId: string;
  usuarioId: string;
  nomeLivro: string;
  autor: string;
  ano: number;
  dataEmprestimo: string;
  dataDevolucao: string;
  devolvido: boolean;
};

function isFilledText(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

export class Loan implements IEntity {
  id: string;
  livroId: string;
  usuarioId: string;
  nomeLivro: string;
  autor: string;
  ano: number;
  dataEmprestimo: string;
  dataDevolucao: string;
  devolvido: boolean;

  constructor(props: LoanProps) {
    this.id = props.id;
    this.livroId = props.livroId;
    this.usuarioId = props.usuarioId;
    this.nomeLivro = props.nomeLivro;
    this.autor = props.autor;
    this.ano = props.ano;
    this.dataEmprestimo = props.dataEmprestimo;
    this.dataDevolucao = props.dataDevolucao;
    this.devolvido = props.devolvido;
  }
  public validate(): Response<void> {
    if(!isFilledText(this.id)) {
        return {isFail: true, error:{message: 'ID precisa ser uma string válida'}}
    }
    if(!isFilledText(this.livroId)){
        return { isFail: true, error: {message: 'ID do livro inválido'}}
    }
    if(!isFilledText(this.usuarioId)){
        return { isFail: true, error: { message: 'ID do usuário inválido'}}
    }
     const emprestimo = new Date(this.dataEmprestimo);
     const devolucao = new Date(this.dataDevolucao);

     if(Number.isNaN(emprestimo.getTime())){
        return { isFail: true, error: { message: 'Data do empréstimo inválida'}}
     }
     if(Number.isNaN(devolucao.getTime())){
        return { isFail: true, error: {message: 'Data da devolução inválida'}}
     }
    if ( devolucao < emprestimo){
        return{ isFail: true, error: {message: 'A devolução não pode ser antes do empréstimo'}}
     }

      return { isFail: false}
  }
}
