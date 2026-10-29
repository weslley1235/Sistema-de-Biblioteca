import { list as listUsers } from '../repository.js';

export type ListedUser = {
  id: string;
  nome: string;
  email: string;
  tel: string;
  tipoUsu: string;
  cpf: string;
}

export async function list(): Promise<ListedUser[]> {
  const users = await listUsers();

  return users.map(({ id, nome, email, tel, cpf, tipousu }) => ({
    id,
    nome,
    email,
    tel,
    tipoUsu: tipousu,
    cpf: `${cpf.slice(0, 3)}${'*'.repeat(Math.max(0, cpf.length - 5))}${cpf.slice(-2)}`,
  }));
}
