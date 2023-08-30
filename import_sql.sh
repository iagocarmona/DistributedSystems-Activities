#!/bin/bash

# Nome do contêiner MySQL
CONTAINER_NAME=db_sd

# Nome de usuário e senha do banco de dados
DB_USER=root
DB_PASSWORD=sd123

# Nome do banco de dados
DB_NAME=dbsd

# Caminho para o arquivo SQL a ser importado
SQL_FILE=users.sql

# Executa o dump do arquivo SQL para o contêiner MySQL
docker exec -i $CONTAINER_NAME sh -c "mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME" < $SQL_FILE
