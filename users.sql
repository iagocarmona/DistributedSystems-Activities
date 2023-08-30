DROP TABLE IF EXISTS users;

-- Criação da tabela 'users'
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Inserção de dados na tabela 'users'
INSERT INTO users (nome, senha) VALUES ('Alice', 'senha123');
INSERT INTO users (nome, senha) VALUES ('Bob', 'qwerty');
INSERT INTO users (nome, senha) VALUES ('Carol', 'abc456');
INSERT INTO users (nome, senha) VALUES ('David', 'p@ssw0rd');
INSERT INTO users (nome, senha) VALUES ('Eve', 'ilovecats');
INSERT INTO users (nome, senha) VALUES ('iago', '123456');
