CREATE TABLE gestor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    is_master BOOLEAN DEFAULT FALSE,
    primeiro_login BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE ator (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo_helice VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE demanda (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    ator_id INTEGER NOT NULL,
    area_cnpq VARCHAR(100) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_demanda_ator FOREIGN KEY (ator_id) REFERENCES ator(id) ON DELETE RESTRICT
);

CREATE TABLE expertise (
    id SERIAL PRIMARY KEY,
    area_conhecimento VARCHAR(255) NOT NULL,
    area_cnpq VARCHAR(100) NOT NULL,
    link_lattes VARCHAR(255),
    pesquisador_responsavel VARCHAR(255) NOT NULL,
    ator_id INTEGER NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_expertise_ator FOREIGN KEY (ator_id) REFERENCES ator(id) ON DELETE RESTRICT
);

CREATE TABLE portfolio_expertise (
    id SERIAL PRIMARY KEY,
    expertise_id INTEGER NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    ano_publicacao INTEGER NOT NULL,
    link_acesso VARCHAR(255),
    resumo TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_portfolio_expertise FOREIGN KEY (expertise_id) REFERENCES expertise(id) ON DELETE RESTRICT
);