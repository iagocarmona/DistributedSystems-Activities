## Como Executar

Para executar este projeto, siga os passos a seguir:

1. Execute o comando `yarn` para instalar as dependências do projeto.

2. Em seguida, execute o comando `yarn build:proto` para compilar os arquivos de definição do Protocol Buffers (protobuf).

3. Por fim, execute `yarn start` para iniciar a aplicação.

## Bibliotecas Utilizadas

Este projeto faz uso de várias bibliotecas não padrão para realizar suas funcionalidades. Aqui está uma descrição de algumas delas:

- `google-protobuf`: Esta biblioteca é usada para trabalhar com mensagens definidas em formato protobuf, que é um formato de serialização eficiente.

- `mongodb`: Utilizada para se conectar e interagir com um banco de dados MongoDB.

- `ts-protoc-gen`: Este é um compilador que traduz as definições do Protocol Buffers para código TypeScript, facilitando a integração com o projeto.

- `yup`: Usada para validação de dados, garantindo que os dados de entrada atendam aos requisitos esperados.

- `@grpc/proto-loader`: É um utilitário que ajuda a carregar arquivos .proto e a configurar os serviços gRPC.

- `dotenv`: Usada para carregar variáveis de ambiente, permitindo a configuração dinâmica do projeto.

- `grpc`: Uma biblioteca para comunicação gRPC no ambiente Node.js.

- `grpc-tools`: Ferramentas que auxiliam no desenvolvimento de serviços gRPC no Node.js.

#### createMovie

Construa o objeto de `Request` da seguinte forma:

```ts
{
    movie: {
        // ... DADOS DO FILME A SER CRIADO
    },
}
```

#### getMoviesById

Construa o objeto de `Request` da seguinte forma:

```ts
{
    data: "id_aqui",
}
```

#### updateMovie

Construa o objeto de `Request` da seguinte forma:

```ts
{
     movie: {
        // ... NOVOS DADOS DO FILME
    },
    data: "id_do_filme_a_ser_atualizado",
}
```

#### deleteMovie

Construa o objeto de `Request` da seguinte forma:

```ts
{
    data: "id_do_filme_a_ser_deletado",
}
```

#### getMoviesByActor

Construa o objeto de `Request` da seguinte forma:

```ts
{
    data: "nome_do_ator",
}
```

#### getMoviesByGenre

Construa o objeto de `Request` da seguinte forma:

```ts
{
    data: "nome_do_genero",
}
```
