### Como Executar

Para executar o cliente GRPC, siga os seguintes passos:

1. Navegue até a pasta `client` no seu terminal:

    ```bash
    cd client
    ```

2. Execute o arquivo `client.py` usando o Python 3:

    ```bash
    python3 client.py
    ```

Isso iniciará o cliente GRPC e permitirá que você interaja com o servidor para criar, atualizar, pesquisar e excluir informações sobre filmes no banco de dados.

### Bibliotecas Utilizadas

Este cliente GRPC utiliza as seguintes bibliotecas Python:

- `grpc`: Biblioteca principal do gRPC para comunicação entre cliente e servidor.
- `grpcio`: Biblioteca que fornece suporte básico para o gRPC.
- `grpcio-tools`: Ferramenta para gerar códigos gRPC a partir de arquivos de definição do Protocol Buffers (`.proto`).
- `protobuf`: Biblioteca que oferece suporte para estruturas de dados serializadas usando Protocol Buffers, que são usados na comunicação gRPC.

Certifique-se de que essas bibliotecas estejam instaladas em seu ambiente Python antes de executar o cliente. Você pode instalá-las usando o `pip`:

```bash
pip install grpcio grpcio-tools protobuf
```

Certifique-se também de que o servidor GRPC esteja em execução antes de iniciar o cliente para garantir uma conexão bem-sucedida.
