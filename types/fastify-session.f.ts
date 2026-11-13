import 'fastify';

declare module 'fastify' {
  interface Session {
    usuario?: {
      id: string;
      nome: string;
      email: string;
      cpf: string;
      tel: string;
      tipoUsu: string;
    };
  }
}