import type { FastifyReply, FastifyRequest } from 'fastify';

export const ADMIN = 'administracao';

export function isAdmin(request: FastifyRequest): boolean {
  return request.session.get('usuario')?.tipoUsu == ADMIN;
}

export async function requireLoginApi(request: FastifyRequest, reply: FastifyReply) {
  if (!request.session.get('usuario')) {
    return reply.code(401).send({ message: 'Usuário não autenticado' });
  }
}

export async function requireAdminApi(request: FastifyRequest, reply: FastifyReply) {
  if (!request.session.get('usuario')) {
    return reply.code(401).send({ message: 'Usuário não autenticado' });
  }

  if (!isAdmin(request)) {
    return reply.code(403).send({ message: 'Acesso restrito à administração' });
  }
}

export async function requireLoginPage(request: FastifyRequest, reply: FastifyReply) {
  if (!request.session.get('usuario')) {
    return reply.redirect('/');
  }
}

export async function requireAdminPage(request: FastifyRequest, reply: FastifyReply) {
  if (!isAdmin(request)) {
    return reply.redirect(request.session.get('usuario') ? '/index' : '/');
  }
}
