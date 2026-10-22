import {fastifyStatic,fastifyCookie,fastifySession,path,fileURLToPath} from './backend/config.js';
import server from './backend/fastify.js';

import userRoutes from './backend/user/routes.js';
import loanRoutes from './backend/emprestimo/routes.js';

import { requestController } from './backend/books/controller.js';
import { destroyController } from './backend/books/destroyController.js';
import { updateController } from './backend/books/updateController.js';
import { listBooksController } from './backend/books/listController.js';
import { findBookController } from './backend/books/findBookController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ?? 3333;

// ---------------------------------------------------------------------------
// Configurações
// ---------------------------------------------------------------------------
server.register(fastifyCookie);

server.register(fastifySession, {
  secret: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  cookieName: 'bibliotecaSession',
  cookie: {
    secure: false,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  },
});

server.register(fastifyStatic, {
  root: path.join(__dirname, 'front'),
});

// Verificar login

async function verificarLogin(request, reply) {
  if (!request.session.usuario) {
    return reply.redirect('/');
  }
}

const protegida = { preHandler: verificarLogin };

// Páginas

const paginasProtegidas = {
  '/index': 'html/index.html',
  '/usuarios': 'html/listaUsuarios.html',
  '/livros-inativos': 'html/livros_inativos.html',
};

server.get('/', (request, reply) => reply.sendFile('html/cadastro_usu.html'));

for (const [rota, arquivo] of Object.entries(paginasProtegidas)) {
  server.get(rota, protegida, (request, reply) => reply.sendFile(arquivo));
}

// Usuários e empréstimos

server.register(userRoutes);
server.register(loanRoutes);

// Livros

server.post('/livro', protegida, requestController);
server.get('/livro', protegida, listBooksController);
server.get('/livro/:id', protegida, findBookController);
server.put('/livro/:id', protegida, updateController);
server.delete('/livro/:id', protegida, destroyController);

// Logout

server.get('/logout', async (request, reply) => {
  await request.session.destroy();
  return reply.redirect('/');
});

// Iniciar servidor

try {
  await server.listen({ host: '0.0.0.0', port: PORT });
  console.log(`Servidor rodando na porta ${PORT}`);
  
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
