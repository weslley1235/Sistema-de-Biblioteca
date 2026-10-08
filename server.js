// IMPORTAÇÕES

import { fastify } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import { v4 as uuidv4 } from 'uuid';

import {
  registrar as registrarUsuario,
  login,
} from './backend/autenticacao_usuario.js';
import { registrar as registrarlivro } from './backend/autenticacao_livro.js';

import {
  buscarLivro,
  listaLivros,
  excluirLivro,
  atualizarLivro,
} from './backend/livros.js';
import {
  cadastrarEmprestimo,
  listaEmprestimo,
  verificarEmprestimo,
  emprestimoSchema,
  devolverEmprestimo,
} from './backend/emprestimo.js';

// SERVIDOR

const server = fastify();

// VERIFICAR LOGIN

function verificarLogin(request, reply, done) {
  if (!request.session.usuario) {
    return reply.redirect('/');
  }

  done();
}

// CONFIGURAÇÕES

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
  root: '/Users/weslley/Documents/projetos e aulas/projetos/Projeto-biblioteca/front',
});

// AUTENTICAÇÃO

// Página inicial

server.get('/', async (request, reply) => {
  return reply.sendFile('cadastro_usu.html');
});

// Cadastro de usuário

server.post('/usuario', async (request, reply) => {
  try {
    const { nome, email, senha, cpf_Matri, tel, tipoUsu } = request.body;

    const resultado = await registrarUsuario(
      nome,
      email,
      senha,
      cpf_Matri,
      tel,
      tipoUsu,
    );

    return reply.status(resultado.status).send({
      mensagem: resultado.mensagem,
    });
  } catch (erro) {
    console.log('Erro ao cadastrar usúario', erro);

    return reply.status(500).send({
      mensagem: 'Erro interno do servidor',
    });
  }
});

// Login

server.post('/login', async (request, reply) => {
  try {
    const { email, senha } = request.body;

    const resultado = await login(email, senha);

    if (resultado.status !== 200) {
      return reply.status(resultado.status).send({
        mensagem: resultado.mensagem,
      });
    }

    request.session.set('usuario', resultado.usuario);

    await request.session.save();

    console.log('Sessão salva:', request.session.get('usuario'));
    return reply.status(200).send({ mensagem: 'Login realizado com sucesso' });
  } catch (erro) {
    console.log('Erro ao realizar login:', erro);

    return reply.status(500).send({
      mensagem: 'Erro do servidor',
    });
  }
});

// Logout

server.get('/logout', async (request, reply) => {
  await request.session.destroy();

  return reply.redirect('/cadastro_usu.html');
});

// Página principal

server.get('/index', { preHandler: verificarLogin }, async (request, reply) => {
  return reply.sendFile('index.html');
});

// LIVROS

// Cadastrar livro

server.post(
  '/livro',
  { preHandler: verificarLogin },
  async (request, reply) => {
    try {
      const { titulo, autor, ano } = request.body;
      const resultado = await registrarlivro(titulo, autor, ano);

      return reply.status(resultado.status).send({
        mensagem: resultado.mensagem,
      });
    } catch (erro) {
      console.log('Erro ao cadastrar livro:', erro);

      return reply.status(500).send({
        mensagem: 'Erro do servidor',
      });
    }
  },
);

// Listar livros

server.get('/livro', { preHandler: verificarLogin }, async (request, reply) => {
  try {
    const livros = listaLivros();

    return reply.send(livros);
  } catch (erro) {
    console.log('Erro a listas os livros:', erro);

    return reply.status(500).send({
      mensagem: 'Erro do servidor',
    });
  }
});

// Buscar livro pelo ID

server.get(
  '/livro/:id',
  { preHandler: verificarLogin },
  async (request, reply) => {
    try {
      const { id } = request.params;
      const livro = buscarLivro(id);

      if (!livro) {
        return reply.status(404).send({});
      }

      return reply.send(livro);
    } catch (erro) {
      console.log('Erro ao buscar livro:', erro);

      return reply.status(500).send({
        mensagem: 'Erro do servidor',
      });
    }
  },
);

// Atualizar livro

server.put(
  '/livro/:id',
  { preHandler: verificarLogin },
  async (request, reply) => {
    try {
      const { id } = request.params;
      const { titulo, autor, ano } = request.body;

      const livro = buscarLivro(id);

      if (!livro) {
        return reply.status(404).send({
          mensagem: 'livro não encontrado',
        });
      }

      atualizarLivro(id, titulo, autor, ano);

      return reply.send({
        mensagem: 'Livro atualizado com sucesso!',
      });
    } catch (erro) {
      console.log('Erro ao atualizar livro:', erro);

      return reply.status(500).send({
        mensagem: 'Erro do servidor',
      });
    }
  },
);

// Excluir livro

server.delete(
  '/livro/:id',
  { preHandler: verificarLogin },
  async (request, reply) => {
    try {
      const { id } = request.params;
      const livro = buscarLivro(id);

      if (!livro) {
        return reply.status(404).send({
          mensagem: 'Livro não encontrado',
        });
      }

      excluirLivro(id);

      return reply.send({
        mensagem: 'Livro excluido com sucesso',
      });
    } catch (erro) {
      console.log('Erro ao excluir livro:', erro);

      return reply.status(500).send({
        mensagem: 'Erro do servidor',
      });
    }
  },
);

// EMPRÉSTIMOS

// Página de livros emprestados

server.get(
  '/livros-emprestados',
  { preHandler: verificarLogin },
  async (request, reply) => {
    return reply.sendFile('livros_emprestados.html');
  },
);

// Página de livros disponíveis

server.get(
  '/livros-disponiveis',
  { preHandler: verificarLogin },
  async (request, reply) => {
    return reply.sendFile('livros_disponiveis.html');
  },
);

// Página de novo empréstimo

server.get(
  '/novo-emprestimo',
  { preHandler: verificarLogin },
  async (request, reply) => {
    return reply.sendFile('novo_emprestimo.html');
  },
);

// Cadastrar empréstimo

server.post(
  '/emprestimo',
  { preHandler: verificarLogin },
  async (request, reply) => {
    try {
      const { livroId, nome, tel, cpfMatri, dataEmprestimo, dataDevolucao } =
        request.body;

      const resultado = emprestimoSchema.safeParse({
        livroId,
        nome,
        tel,
        cpfMatri,
        dataEmprestimo,
        dataDevolucao,
      });

      if (!resultado.success) {
        return reply.status(400).send({
          mensagem: resultado.error.issues[0].message,
        });
      }

      const livro = buscarLivro(livroId);

      if (!livro) {
        return reply.status(404).send({
          mensagem: 'Livro não encontrado',
        });
      }

      const emprestimoExistente = verificarEmprestimo(livroId);

      if (emprestimoExistente) {
        return reply.status(400).send({
          mensagem: 'Este livro já está emprestado',
        });
      }

      const emprestimo = {
        id: uuidv4(),
        livroId: livroId,
        nome: nome,
        tel: tel,
        cpfMatri: cpfMatri,
        dataEmprestimo: dataEmprestimo,
        dataDevolucao: dataDevolucao,
        devolvido: false,
      };

      cadastrarEmprestimo(emprestimo);

      return reply.status(201).send({
        mensagem: 'Empréstimo confirmado!',
      });
    } catch (erro) {
      console.log('Erro ao cadastrar emprestimo:', erro);

      return reply.status(500).send({
        mensagem: 'Erro do servidor',
      });
    }
  },
);

// Listar empréstimos

server.get(
  '/emprestimo',
  { preHandler: verificarLogin },
  async (request, reply) => {
    try {
      const emprestimo = listaEmprestimo();

      return reply.send(emprestimo);
    } catch (erro) {
      console.log('Erro ao listar empréstimos', erro);

      return reply.status(500).send({
        mensagem: 'Erro do servidor',
      });
    }
  },
);

// Devolver livro

server.put(
  '/emprestimo/:id',
  { preHandler: verificarLogin },
  async (request, reply) => {
    try {
      const { id } = request.params;

      const resultado = devolverEmprestimo(id);

      if (!resultado) {
        return reply.status(404).send({
          mensagem: 'Emprestimo não encontrado',
        });
      }

      return reply.send({
        mensagem: 'livro devolvido com sucesso!',
      });
    } catch (erro) {
      console.group('Erro ao devolver livros:', erro);

      return reply.status(500).send({
        mensagem: 'Erro do servidor',
      });
    }
  },
);

// INICIAR SERVIDOR

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333,
});
