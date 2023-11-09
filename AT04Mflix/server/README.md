# Guia de Execução

Siga estas etapas para executar o projeto:

### 1. Instale as Dependências

Para começar, certifique-se de que todas as dependências necessárias estejam instaladas. Execute o seguinte comando para instalar as dependências:

```bash
yarn
```

### 2. Compilação do Protocolo

Antes de executar o projeto, você precisa compilar o arquivo de protocolo. Execute o comando a seguir para compilar o arquivo `.proto`:

```bash
yarn build:proto
```

Isso irá gerar os arquivos TypeScript necessários a partir do arquivo de definição do protocolo.

### 3. Iniciar o Projeto

Agora que as dependências estão instaladas e o protocolo foi compilado, você pode iniciar o projeto. Use o seguinte comando:

```bash
yarn start
```

O projeto será iniciado e estará pronto para ser usado.

## Bibliotecas Utilizadas

Além das bibliotecas padrão, este projeto utiliza as seguintes bibliotecas não padrão:

- **google-protobuf**: Uma biblioteca para trabalhar com o protocolo Buffer (protobuf).
- **mongodb**: Usada para se conectar e interagir com o MongoDB, um banco de dados NoSQL.
- **ts-protoc-gen**: Compilador do protobuf para TypeScript.
- **yup**: Biblioteca para validação de dados em JavaScript/TypeScript.
- **@grpc/proto-loader**: Utilitário para carregar arquivos `.proto` em projetos gRPC.
- **dotenv**: Usada para carregar variáveis de ambiente do arquivo `.env`.
- **@grpc/grpc-js**: Biblioteca para gRPC em Node.js.
- **grpc-tools**: Ferramentas para desenvolver com gRPC em Node.js.

Lembre-se de instalar essas bibliotecas antes de executar o projeto.
