### Identificadores de requisição

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

### CREATE

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 1,
    movie: {
        // ... DADOS DO FILME A SER CRIADO
    },
    data: null, // Não precisa enviar
}
```

### FIND BY ID

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 2,
    movie: null, // Não precisa enviar
    data: "id_aqui",
}
```

### UPDATE

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

### DELETE

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 4,
    movie: null,  // Não precisa enviar
    data: "id_do_filme_a_ser_deletado",
}
```

### FIND BY ACTOR

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 5,
    movie: null,  // Não precisa enviar
    data: "nome_do_ator",
}
```

### FIND BY CATEGORY

Construa o objeto de `Request` da seguinte forma:

```ts
{
    request_id: 6,
    movie: null,  // Não precisa enviar
    data: "nome_da_categoria",
}
```
