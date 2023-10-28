
### Como executar

1. Execute o seguinte comando: `yarn`
2. Execute o comando: `yarn build:proto`
3. Por fim, execute `yarn start`

### Bibliotecas usadas (descrever as não padrões)

- `google-protobuf`: biblioteca do protobuf
- `mongodb`: usada para se conectar ao mongodb
- `ts-protoc-gen`: compilador do protobuf para typescript
- `yup`: usada para validação

### Exemplos de uso

#### Identificadores de requisição

```ts
const OP = {
  CREATE: 1,
  FIND_BY_ID: 2,
  UPDATE: 3,
  DELETE: 4,
  FIND_BY_ACTOR: 5,
  FIND_BY_CATEGORY: 6,
};
```

#### CREATE

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 1,
    movie: {
        // ... DADOS DO FILME A SER CRIADO
    },
}
```

#### FIND BY ID

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 2,
    data: "id_aqui",
}
```

#### UPDATE

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 3,
     movie: {
        // ... NOVOS DADOS DO FILME
    },
    data: "id_do_filme_a_ser_atualizado",
}
```

#### DELETE

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 4,
    data: "id_do_filme_a_ser_deletado",
}
```

#### FIND BY ACTOR

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 5,
    data: "nome_do_ator",
}
```

#### FIND BY CATEGORY

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 6,
    data: "nome_da_categoria",
}
```
