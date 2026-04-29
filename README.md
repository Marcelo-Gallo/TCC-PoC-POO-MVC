# 🧬 InovaHelix: Matchmaking Semântico para a Tríplice Hélice Municipal

![Status](https://img.shields.io/badge/Status-Concluído-green)
![Python](https://img.shields.io/badge/Python-3%2E10--Slim-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-ASGI-009688)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![Docker](https://img.shields.io/badge/Docker-Conteinerizado-2496ED)

> Trabalho de Conclusão de Curso (Bacharelado em Sistemas de Informação) apresentado ao Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP) - Campus Votuporanga.

## 📖 Sobre o Projeto
O Brasil enfrenta um cenário de engessamento na gestão pública que resulta na Paralisia da Inovação municipal. Embora o modelo da Tríplice Hélice proponha a integração entre Universidade, Indústria e Governo, essa colaboração esbarra na assimetria de informações. 

Este projeto é uma Prova de Conceito (PoC) desenvolvida sob o padrão MVC e arquitetura API-First. Ele atua como um **corretor digital de inovação**. Através de Processamento de Linguagem Natural (NLP), o sistema automatiza o *matchmaking* (correlação semântica) entre as demandas da gestão pública/indústria e os pesquisadores acadêmicos por meio de seus portfólios.

## 🛠️ Tecnologias e Arquitetura

O ecossistema foi construído visando alta coesão e baixo acoplamento, sendo totalmente conteinerizado:
* **Backend / IA:** Python com FastAPI (Padrão ASGI). Rotinas de NLP utilizando NLTK (Stemming) e spaCy (Lematização).
* **Frontend:** React. Comunicação segura via JWT (JSON Web Tokens).
* **Banco de Dados:** PostgreSQL, garantindo integridade referencial e transacional (Propriedades ACID).
* **Infraestrutura:** Docker e Docker Compose para orquestração dos serviços.

## ⚙️ Variáveis de Ambiente (.env)

Para a execução do projeto será necessário um arquivo `.env` na raiz do repositório baseado na estrutura abaixo. Este arquivo orquestra as portas e credenciais tanto do Banco de Dados quanto do envio de e-mails para recuperação de senhas.

```env
# Credenciais do Banco de Dados
POSTGRES_USER=admin
POSTGRES_PASSWORD=sua_senha_segura
POSTGRES_DB=inovahelix_db

# Configuração de Portas (Docker)
DB_PORT=5432
BACKEND_PORT=8000
FRONTEND_PORT=3000

# String de Conexão utilizada pelo SQLAlchemy no Backend
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:${DB_PORT}/${POSTGRES_DB}

# Variáveis para Deploy (Ex: AWS, Nginx, API Gateway)
# Descomente e ajuste as linhas abaixo APENAS em ambiente de produção
# ROOT_PATH=/api
# REACT_APP_API_URL=/api

# Credenciais de E-mail (SMTP para recuperação de credenciais)
MAIL_USERNAME=seu_email@gmail.com
MAIL_PASSWORD=sua_senha_de_app
MAIL_FROM=seu_email@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
```
### 🚀 Como Executar o Projeto Localmente
## Pré-requisitos
Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

## Passo a Passo
1. Clone este repositório:
```Bash
git clone https://github.com/Marcelo-Gallo/TCC-PoC-POO-MVC.git
cd TCC-PoC-POO-MVC
```

2. Configure o .env:
Crie o arquivo .env na raiz do projeto contendo as variáveis listadas na seção anterior.

3. Inicie os containers:
Na raiz do projeto, execute o comando abaixo. O Docker se encarregará de baixar as imagens do Postgres, do Python e do Node, montando o ecossistema automaticamente:

```Bash
docker-compose up -d --build
```
4. Acesso ao Sistema:

- Frontend (Interface React): Acesse http://localhost:3000

- Backend (Swagger UI interativo): Acesse http://localhost:8000/docs

_💡 Nota: No primeiro acesso, o sistema executará um seed automático no banco de dados, criando a primeira conta de "Gestor Master" para que você possa fazer o login e explorar o módulo de Matchmaking._

### 📚 Referências Acadêmicas Destaque
- ETZKOWITZ, Henry; LEYDESDORFF, Loet. The Triple Helix: university-industry-government relations: a laboratory for knowledge based economic development.

- BAEZA-YATES, Ricardo; RIBEIRO-NETO, Berthier. Modern information retrieval.

### 👨‍💻 Autor
Marcelo Augusto Godoi Gallo <br/>
Bacharelado em Sistemas de Informação - IFSP <br/>
Orientador: Prof. Dr. Marcelo Luis Murari
