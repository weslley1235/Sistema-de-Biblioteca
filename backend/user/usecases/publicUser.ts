import type { User } from '../repository.js';
import type { publicUser } from './types.js';

export function topublicUser( user:User ): publicUser {
    return{
        id: user.id,
        nome: user.nome,
        email: user.email,
        cpf: user.cpf,
        tel: user.tel,
        tipoUsu: user.tipousu,
    };
}