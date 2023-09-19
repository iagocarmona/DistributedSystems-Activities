## Atividade 01 - Questão 02
---

### Como compilar
- **Server**: 
    - Entre na pasta `server`, executando `cd server`
    - Execute `javac server.java`

- **Cliente**: 
    - Entre na pasta `client`, executando `cd client`
    - Execute `javac client.java`

### Como executar
- **Server**: 
    - Entre na pasta `server`, executando `cd server`
    - Execute `java server.java`

- **Cliente**: 
    - Entre na pasta `client`, executando `cd client`
    - Execute `java client.java`

### Bibliotecas usadas
- java.net.*;
- java.io.*;
- java.security.MessageDigest;

### Exemplo de uso
- Como executar **ADDFILE**
    execute: `ADDFILE <nome_do_arquivo>`

- Como executar **DELETE**
    execute: `DELETE <nome_do_arquivo>`

- Como executar **GETFILELIST**
    execute: `GETFILELIST`

- Como executar **GETFILE**
    execute: `GETFILE <nome_do_arquivo>`
### Estruturas de pastas

#### Cliente
```
- client
    - downloads
        - teste.txt
        - teste2.txt
            ...
            ...
    - files
        - teste123.txt
        - teste4444.txt
            ...
            ...
    - client.java
```
- **downloads**: nesta pasta serão armazenados os arquivos quando o cliente executa o comando `GETFILE <nome_do_arquivo>`
- **files**: nesta pasta está os arquivos de onde o cliente lê para enviar para o servidor executando o comando `ADDFILE <nome_do_arquivo>` 
#### Server
```
- server
    - files
        - teste.txt
        - teste2.txt
        - teste3.txt
            ...
            ...
    - server.java
    - tcp.log

```
- **files**: nesta pasta será armazenado os arquivos que foram recebidos do `ADDFILE <nome_do_arquivo>` executado pelo cliente. 
- **tcp.log**: neste arquivo é salvo todos os logs do servidor.