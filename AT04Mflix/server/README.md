# Instruções de Execução

Siga estas etapas para executar o projeto com sucesso:

1. **Instale as Dependências**

   Execute o seguinte comando para instalar todas as dependências necessárias:

   ```
   yarn
   ```

2. **Compile os Arquivos .proto**

   Execute o comando abaixo para compilar os arquivos `.proto`:

   ```
   yarn build:proto
   ```

   Isso é necessário para gerar os arquivos TypeScript a partir das definições protobuf.

3. **Inicie o Servidor**

   Agora, você pode iniciar o servidor executando o seguinte comando:

   ```
   yarn start
   ```

   O servidor estará em execução e pronto para processar solicitações.

## Bibliotecas Utilizadas

Aqui estão algumas das bibliotecas não padrão utilizadas neste projeto:

- **google-protobuf**: Esta é uma biblioteca que fornece suporte para trabalhar com mensagens protobuf em JavaScript/TypeScript. É usada para serialização e desserialização de dados.
- **mongodb**: Utilizada para estabelecer conexões com o MongoDB, um banco de dados NoSQL amplamente utilizado.

- **ts-protoc-gen**: É um compilador do protobuf para TypeScript. Ele é responsável por gerar código TypeScript a partir das definições protobuf, facilitando a manipulação de mensagens.

- **yup**: Essa biblioteca é usada para validação de dados. É útil para garantir que os dados de entrada atendam aos requisitos específicos antes de serem processados.

- **dotenv**: Esta biblioteca é usada para carregar variáveis de ambiente a partir de um arquivo `.env`, o que ajuda a manter as configurações sensíveis fora do código-fonte.

Certifique-se de que todas essas bibliotecas estejam instaladas para garantir o funcionamento adequado do projeto.
