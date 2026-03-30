# Plataforma de Corretagem Digital de Inovação - Tríplice Hélice

## Visão Geral
Este projeto consiste em uma Prova de Conceito (PoC) desenvolvida para validar a aplicação de Processamento de Linguagem Natural (NLP) no ecossistema de inovação da Tríplice Hélice (Universidade, Indústria e Governo). A plataforma atua como um motor de matchmaking, cruzando problemas técnicos (demandas) com soluções acadêmicas (expertises e portfólios) por meio do cálculo de Similaridade de Cosseno sobre matrizes TF-IDF.

## Arquitetura
O sistema é composto por três contêineres principais orquestrados via Docker:
* Banco de Dados: PostgreSQL.
* Backend: API RESTful desenvolvida em Python (FastAPI).
* Frontend: Interface de Usuário desenvolvida em React.

## Pré-requisitos
Para executar este projeto em um ambiente Linux Mint (ou distribuições baseadas em Debian/Ubuntu), certifique-se de que as seguintes ferramentas estejam instaladas:
* Docker
* Docker Compose (Plugin)

## Instruções de Execução

1. Abra o terminal na raiz do projeto, onde o arquivo `docker-compose.yml` está localizado.

2. Execute o comando abaixo para construir as imagens e iniciar os contêineres em segundo plano:
   ```bash
   docker compose up --build -d
Para acompanhar os registros (logs) e verificar se o algoritmo de NLP e o servidor foram inicializados corretamente, utilize:

Bash
docker compose logs -f
Para interromper a execução do sistema, utilize o comando:

Bash
docker compose down
Acessos do Sistema
Após a inicialização completa dos contêineres, os serviços estarão disponíveis nos seguintes endereços locais:

Frontend (Interface do Gestor): http://localhost:3000

Backend (Documentação Swagger/OpenAPI): http://localhost:8000/docs

Banco de Dados (PostgreSQL): localhost:5432 (Acesso via DBeaver, pgAdmin ou terminal local).

Observações de Teste
Para o primeiro acesso à plataforma, é necessário possuir um usuário Gestor cadastrado na base de dados. Como a API exige autenticação JWT para as operações de escrita, recomenda-se a inserção de um usuário inicial diretamente no PostgreSQL para viabilizar o login na interface.