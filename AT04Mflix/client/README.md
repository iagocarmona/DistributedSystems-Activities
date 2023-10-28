### Como executar

  - navegue até a pasta `client`

  - no terminal, execute `python3 client.py`

### Bibliotecas utilizadas

  - grpc
  - grpcio
  - grpcio-tools
  - protobuf

### Como gerar os arquivos

  - navegue até a pasta `client`
  
  - no terminal, execute o comando `protoc -I=. --python_out=. ./generated/movies.proto`
