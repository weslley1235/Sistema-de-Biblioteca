import type { Response } from '../../../shared/index.js';
import type { User } from '../entities/index.js';

export const USER_NOT_FOUND = 'Registro não encontrado';

export type UserCredentials = {
    user: User;
    passwordHash: string;
}

export interface IUserRepository {
    save(user:User, passwordHash: string): Promise<Response<void>>;
    list(): Promise<Response<Array<User>>>;
    findById(id: string): Promise<Response<User>>;
    findByEmail(email: string): Promise<Response<User>>;
    findByCpf(cpf: string): Promise<Response<User>>;
    findCredentialsByEmail(email: string): Promise<Response<UserCredentials>>;
    update(user: User): Promise<Response<void>>;
    destroy(id: string): Promise<Response<void>>;
    hasLoans(id: string): Promise<Response<boolean>>;
}