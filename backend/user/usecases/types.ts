export type publicUser = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  tel: string;
  tipoUsu: string;
};

export type UseCaseResult = {
  status: number;
  message: string;
};

export type UserResult = UseCaseResult & {
  user?: publicUser;
};
