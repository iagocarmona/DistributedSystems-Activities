
### Como executar

1. Execute o seguinte comando: `yarn`
2. Execute o comando: `yarn build:proto`
3. Por fim, execute `yarn start`

### Bibliotecas usadas (descrever as não padrões)

- `google-protobuf`: biblioteca do protobuf
- `mongodb`: usada para se conectar ao mongodb
- `ts-protoc-gen`: compilador do protobuf para typescript
- `yup`: usada para validação
- `@grpc/proto-loader`: utilitario para carregar arquivos .proto
- `dotenv`: usar variaveis de ambiente
- `grpc`: biblioteca grpc node
- `grpc-tools`: ferramentas para desenvolver com grpc no node

### Exemplos de uso

Veja o arquivo `Insomnia_2023-05-13.json`

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
