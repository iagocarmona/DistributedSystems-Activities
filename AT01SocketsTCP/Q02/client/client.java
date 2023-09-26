package AT01SocketsTCP.Q02.client;


/**
 * Descrição: Cliente para conexao TCP
 * Descricao: Envia uma informacao ao servidor e recebe confirmações ECHO e salva informações no arquivo tcp.log.
 * 
 * Autor: Iago Ortega Carmona
 * 
 * Data de criação: 05/09/2023
 * Data última atualização: 19/09/2023
 */

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.nio.ByteOrder;
import java.util.List;
import java.util.Scanner;
import java.net.*;
import java.io.*;

public class client {

    /**
     * Cria o header da requisição
     * @param messageType
     * @param commandId
     * @param filenameSize
     * @param filename
     * @return
     */
    public static ByteBuffer createHeader(byte messageType, byte commandId, byte filenameSize, String filename) {
        ByteBuffer header = ByteBuffer.allocate(259); 
        header.order(ByteOrder.BIG_ENDIAN);

        header.put(0, messageType);
        header.put(1, commandId);
        header.put(2, filenameSize);
        header.position(3);
        header.put(filename.getBytes());

        return header;
    }

    /**
     * Salva o arquivo no diretório downloads
     * @param filename
     * @param content
     * @return
     * @throws IOException
     */
    public static int saveFile(String filename, String content) throws IOException {
        String defaultPath = System.getProperty("user.dir") + "/downloads";
        File theDir = new File(defaultPath);
        if (!theDir.exists()) {
            theDir.mkdirs();
        }

        String path = defaultPath + "/" + filename;
        File file = new File(path);

        if (file.createNewFile()) {
            FileWriter writer = new FileWriter(path, true);
            BufferedWriter buffer = new BufferedWriter(writer);
            buffer.write(content);
            buffer.flush();
            buffer.close();

            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Imprime o status code da resposta
     * @param commandId
     * @param statusCode
     * @param messageType
     */
    public static void printResponseStatusCode(byte commandId, byte statusCode, byte messageType) {
        switch (commandId) {
            case 1: // ADDFILE
                if (statusCode == 2)
                    System.out.println("Erro ao tentar criar arquivo. Message type: " + messageType);
                else
                    System.out.println("Arquivo criado com sucesso!");
                break;
            case 2: // DELETE
                if (statusCode == 2)
                    System.out.println("Erro ao tentar deletar arquivo. Message type: " + messageType);
                else
                    System.out.println("Arquivo deletado com sucesso!");
                break;
            case 3: // GETFILESLIST
                if (statusCode == 2)
                    System.out.println("Erro ao tentar listar arquivos. Message type: " + messageType);
                else
                    System.out.println("Arquivos listados com sucesso!");
                break;
            case 4: // GETFILE
                if (statusCode == 2)
                    System.out.println("Erro ao tentar obter arquivo. Message type: " + messageType);
                else
                    System.out.println("Arquivo obtido com sucesso!");
                break;
        }
    }
    
    /**
     * Método principal
     * @param args
     */
    public static void main(String args[]) {
        Socket s = null;
        Scanner reader = new Scanner(System.in);

        String currentPath = System.getProperty("user.dir") + "/files";
        try {
            int serverPort = 7896;   /* especifica a porta */
            String ip = "localhost";
            s = new Socket(ip, serverPort);  /* conecta com o servidor */  

            /* cria objetos de leitura e escrita */
            DataInputStream in = new DataInputStream(s.getInputStream());
            DataOutputStream out = new DataOutputStream(s.getOutputStream());

            String keyboardBuffer = "";
            byte[] bytes = null;
            
            while (true) {
                keyboardBuffer = reader.nextLine();  /* aguarda o envio de dados */
                String[] arg = keyboardBuffer.split(" ");

                // Verificando se o comando é válido
                String command = arg[0];
                String filename = "";
                byte messageType = 1;

                ByteBuffer buffer = null;
                
                if (command.equalsIgnoreCase("ADDFILE")) {
                    filename = arg[1];

                    String path = currentPath + "/" + filename;
                    File file = new File(path);

                    // Verificando se o arquivo existe e obtendo conteúdo
                    System.out.println("Obtendo conteúdo do arquivo");
                    FileInputStream inputStream = new FileInputStream(file);
                    byte[] response = inputStream.readAllBytes();
                    inputStream.close();

                    int fileSize = response.length;

                    System.out.println("Tamanho do arquivo: " + fileSize + " bytes");

                    // Criando header de requisição
                    buffer = createHeader(messageType, (byte) 1, (byte) filename.length(), filename);
                    buffer.putInt(fileSize);
                    buffer.flip();

                    // Enviando header
                    bytes = new byte[buffer.remaining()];
                    buffer.get(bytes); 
                    out.write(bytes);
                    out.flush();

                    System.out.println("Enviando arquivo byte a byte");
                    for (int i = 0; i < fileSize; i++) {
                        out.write(response[i]);
                        out.flush();
                    }
                } else if (command.equalsIgnoreCase("DELETE")){
                    filename = arg[1];
                    
                    // Criando header de requisição
                    buffer = createHeader(messageType, (byte) 2, (byte) filename.length(), filename);

                    bytes = buffer.array();
                    int size = buffer.limit();
                    out.write(bytes, 0, size); 
                    out.flush();
                } else if (command.equalsIgnoreCase("GETFILESLIST")){
                    // Criando header de requisição
                    buffer = createHeader(messageType, (byte) 3, (byte) filename.length(), filename);

                    bytes = buffer.array();
                    int size = buffer.limit();
                    out.write(bytes, 0, size); 
                    out.flush();
                } else if (command.equalsIgnoreCase("GETFILE")){
                    filename = arg[1];
                
                    // Criando header de requisição
                    buffer = createHeader(messageType, (byte) 4, (byte) filename.length(), filename);

                    bytes = buffer.array();
                    int size = buffer.limit();
                    out.write(bytes, 0, size); 
                    out.flush();
                } else {
                    System.out.println("Comando inválido");
                }

                // Aguardando resposta do servidor
                in.read(bytes);

                // Lendo header de resposta
                buffer = ByteBuffer.wrap(bytes);
                buffer.order(ByteOrder.BIG_ENDIAN);
                byte responseMessageType = buffer.get(0);
                byte responseCommandId = buffer.get(1);
                byte responseStatusCode = buffer.get(2);

                // Verificando se o comando foi executado com sucesso
                if(responseStatusCode == 2) {
                    System.out.println("Erro ao executar comando ou não existe arquivos.");
                    continue;
                }

                int sizeOfContent = 0;

                // Lendo conteúdo da resposta
                if(command.equalsIgnoreCase("GETFILESLIST")){
                    bytes = new byte[1];
                    byte[] numberOfFilesInBytes = new byte[2];

                    // Lendo tamanho do conteúdo
                    for (int i = 0; i < 2; i++) {
                        in.read(bytes);
                        numberOfFilesInBytes[i] = bytes[0];
                    }

                    // Convertendo tamanho do conteúdo para short
                    buffer = ByteBuffer.wrap(numberOfFilesInBytes);
                    buffer.order(ByteOrder.BIG_ENDIAN);
                    sizeOfContent = buffer.getShort();

                    List<String> fileList = new ArrayList<String>();

                    bytes = new byte[1];

                    // Lendo conteúdo
                    for (int i = 0; i < sizeOfContent; i++) {
                        in.read(bytes);
                        byte filenameLength = bytes[0];
                        byte[] filenameNameInBytes = new byte[filenameLength];

                        for (int j = 0; j < filenameLength; j++) {
                            in.read(bytes);
                            filenameNameInBytes[j] = bytes[0];
                        }

                        String name = new String(filenameNameInBytes);
                        fileList.add(name);
                    }

                    System.out.printf("Quantidade de arquivos %d\n", fileList.size());

                    // Imprimindo conteúdo
                    for (String name : fileList) {
                        System.out.println(name);
                    }

                } else if (command.equalsIgnoreCase("GETFILE")){
                    in.read(bytes);
                    buffer = ByteBuffer.wrap(bytes);
                    buffer.order(ByteOrder.BIG_ENDIAN);
                    sizeOfContent = buffer.getInt();

                    System.out.println("sizeOfContent: " + sizeOfContent);

                    // Lendo conteúdo
                    bytes = new byte[1];
                    byte[] contentByte = new byte[sizeOfContent];
                    for (int i = 0; i < sizeOfContent; i++) {
                        in.read(bytes);
                        byte b = bytes[0];
                        contentByte[i] = b;
                    }

                    // Convertendo conteúdo para string
                    String content = new String(contentByte);
                    System.out.println(content);
                    int status = saveFile(filename, content);

                    if(status == 1)
                        System.out.println("Arquivo salvo com sucesso!");
                    else
                        System.out.println("Erro ao salvar arquivo.");

                } else {
                    // Imprimindo resposta
                    printResponseStatusCode(responseCommandId, responseStatusCode, responseMessageType);
                }
            }
        } catch (UnknownHostException e) {
            System.out.println("Socket:" + e.getMessage());
        } catch (EOFException e) {
            System.out.println("EOF:" + e.getMessage());
        } catch (IOException e) {
            System.out.println("leitura:" + e.getMessage());
        }
    }
}
