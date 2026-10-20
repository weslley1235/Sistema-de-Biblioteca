
import {findById,findByEmail,findByCpf,update as updateUser} from '../repository.js';

export async function update(id, data) {
  const user = await findById(id);

  if (!user) {
    return { status: 404, message: 'Usuário não encontrado' };
  }

  const { nome, email, tel } = data;
  const cpf = data.cpf || user.cpf;

  const emailUser = await findByEmail(email);
  if (emailUser && String(emailUser.id) !== String(id)) {
    return { status: 409, message: 'E-mail já cadastrado' };
  }

  const cpfUser = await findByCpf(cpf);
  if (cpfUser && String(cpfUser.id) !== String(id)) {
    return { status: 409, message: 'CPF já cadastrado' };
  }

  const updatedUser = await updateUser(id, { nome, email, cpf, tel });

  return {
    status: 200,
    message: 'Usuário atualizado com sucesso',
    user: updatedUser,
  };
}
