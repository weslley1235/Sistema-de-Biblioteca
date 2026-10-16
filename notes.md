# Melhorias gerais

- Falha de segurança: o banco de dados em formato JSON não está no .gitignore e pode subir para o git com dados sensíveis do usuário
- Tratativas de erro nos blocos de catch, hoje esta só com console.log; tente usar o "throw new Error()" [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). Quando este throw for disparado pela stack-trace você captura ele no server.js e apresenta isso como um erro 500

## Arquitetura

- Separe a estrutura de validação da estrutura do server
- Separe a implementação de banco da lógica do endpoint
- Adicione validações específicas de CPF
- Deixe o controller somente como um roteador de funções
- Crie um usecase que será um orquestrador e nele ficarão as regras de negócio

### Estrutura sugerida

- Módulo por contexto
  - Repository: é o tipo de arquivo responsável por lidar com o banco de dados
  - Use case: é o arquivo que vai ser chamado pelo controller e deve ser ele o reponsável por chamar o repository
  - Controller: já existe e ele vai orquestrar validações e direcionar as coisas para o use case. A principal responsabilidade é garantir que os processos sejam executados em uma sequência lógica
  - Validators: são arquivos que só fazem validações

# Estudar

- Prettier
- Eslint
