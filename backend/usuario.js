// IMPORTAÇÃO

import fs from 'node:fs';

// ARQUIVO DE DADOS

const caminho = './banco/usuario.json';

// LISTAR USUÁRIOS

export function listaUsuarios() {
  try {
    const dados = fs.readFileSync(caminho, 'utf8');

    return JSON.parse(dados);
  } catch (erro) {
    console.log('Erro ao ler dados do Usúario:', erro);
  }
}

// SALVAR USUÁRIOS

export function salvarUsu(usuarios) {
  try {
    fs.writeFileSync(caminho, JSON.stringify(usuarios, null, 2));
  } catch (erro) {
    console.log('Erro ao salvar usúarios:', erro);
  }
}

// CADASTRAR USUÁRIO

export function cadastrarUsuario(usuario) {
  const usuarios = listaUsuarios();

  usuarios.push(usuario);

  salvarUsu(usuarios);
}

// BUSCAR USUÁRIO PELO E-MAIL

export function buscarUsu(email) {
  const usuarios = listaUsuarios();

  return usuarios.find((usuario) => usuario.email === email);
}

// BUSCAR USUÁRIO PELO CPF OU MATRÍCULA

export function buscarUsuCpf(cpf_Matri) {
  const usuarios = listaUsuarios();

  return usuarios.find((usuario) => usuario.cpf_Matri === cpf_Matri);
}

// BUSCAR USUÁRIO PELO E-MAIL

export function buscarUsuEmail(email) {
  const usuarios = listaUsuarios();

  return usuarios.find((usuario) => usuario.email === email);
}
