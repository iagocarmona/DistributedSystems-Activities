# Instruções de Execução

Para executar o cliente, siga as etapas abaixo:

1. **Navegue até a pasta `client`**

   Use o terminal para navegar até a pasta `client` do seu projeto.

2. **Execute o Cliente**

   Execute o seguinte comando no terminal para iniciar o cliente:

   ```bash
   python3 client.py
   ```

   O cliente será iniciado e estará pronto para interagir com o servidor.

## Bibliotecas Utilizadas

O projeto utiliza as seguintes bibliotecas:

- **grpc**: Uma biblioteca para desenvolver serviços RPC (Remote Procedure Call) que se integram facilmente a aplicativos.
- **grpcio**: Esta é uma biblioteca Python para o gRPC. Ela oferece suporte à implementação e à utilização de serviços gRPC em Python.

- **grpcio-tools**: Ferramentas auxiliares para geração de código e compilação de arquivos `.proto` em Python.

- **protobuf**: O protocolo Buffer, ou protobuf, é uma metodologia eficiente para serialização de dados estruturados, amplamente utilizado em sistemas de comunicação.

## Geração de Arquivos

Para gerar os arquivos necessários, siga estas etapas:

1. **Navegue até a pasta `client`**

   Use o terminal para navegar até a pasta `client` do seu projeto.

2. **Execute o Comando de Geração**

   Execute o seguinte comando no terminal para gerar os arquivos a partir do arquivo de definição `.proto`:

   ```bash
   protoc -I=. --python_out=. ./generated/movies.proto
   ```

   Isso irá gerar os arquivos Python necessários para a comunicação com o servidor gRPC.
