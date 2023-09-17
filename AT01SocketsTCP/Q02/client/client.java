package AT01SocketsTCP.Q02.client;


/**
 * Descrição: Cliente para conexao TCP
 * Descricao: Envia uma informacao ao servidor e recebe confirmações ECHO.
 * 
 * Autor: Iago Ortega Carmona
 * 
 * Data de criação: 05/09/2023
 * Data última atualização: 15/09/2023
 */

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.nio.ByteOrder;
import java.util.List;
import java.util.Scanner;
import java.net.*;
import java.io.*;

public class client {

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

    public static int saveFile(String filename, String content) throws IOException {
        String defaultPath = System.getProperty("user.dir") + "/AT01SocketsTCP/Q02/downloads";
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
                break;
            case 4: // GETFILE
                break;
        }
    }
    
    public static void main(String args[]) {
        Socket s = null;
        Scanner reader = new Scanner(System.in);
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

                String command = arg[0];
                String filename = "";
                byte messageType = 1;

                ByteBuffer buffer = null;
                
                if (command.equalsIgnoreCase("ADDFILE")) {
                    filename = arg[1];
                    int fileSize = Integer.parseInt(arg[2]);

                    buffer = createHeader(messageType, (byte) 1, (byte) filename.length(), filename);
                    buffer.putInt(fileSize);
                    buffer.flip();

                    bytes = new byte[buffer.remaining()];
                    buffer.get(bytes); 

                    out.write(bytes);
                    out.flush();
                } else if (command.equalsIgnoreCase("DELETE")){
                    filename = arg[1];
                    
                    buffer = createHeader(messageType, (byte) 2, (byte) filename.length(), filename);

                    bytes = buffer.array();
                    int size = buffer.limit();
                    out.write(bytes, 0, size); 
                    out.flush();
                } else if (command.equalsIgnoreCase("GETFILESLIST")){
                    buffer = createHeader(messageType, (byte) 3, (byte) filename.length(), filename);

                    bytes = buffer.array();
                    int size = buffer.limit();
                    out.write(bytes, 0, size); 
                    out.flush();
                } else if (command.equalsIgnoreCase("GETFILE")){
                    filename = arg[1];
                
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

                buffer = ByteBuffer.wrap(bytes);
                buffer.order(ByteOrder.BIG_ENDIAN);
                byte responseMessageType = buffer.get(0);
                byte responseCommandId = buffer.get(1);
                byte responseStatusCode = buffer.get(2);

                int sizeOfContent = 0;
                switch (command) {
                    case "GETFILELIST":
                        bytes = new byte[1];
                        byte[] numberOfFilesInBytes = new byte[2];

                        for (int i = 0; i < 2; i++) {
                            in.read(bytes);
                            numberOfFilesInBytes[i] = bytes[0];
                        }

                        buffer = ByteBuffer.wrap(numberOfFilesInBytes);
                        buffer.order(ByteOrder.BIG_ENDIAN);
                        sizeOfContent = buffer.getShort();

                        List<String> fileList = new ArrayList<String>();

                        bytes = new byte[1];

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

                        for (String name : fileList) {
                            System.out.println(name);
                        }

                        break;
                    case "GETFILE":
                        in.read(bytes);
                        buffer = ByteBuffer.wrap(bytes);
                        buffer.order(ByteOrder.BIG_ENDIAN);
                        sizeOfContent = buffer.getInt();

                        System.out.println("sizeOfContent: " + sizeOfContent);

                        bytes = new byte[1];
                        byte[] contentByte = new byte[sizeOfContent];
                        for (int i = 0; i < sizeOfContent; i++) {
                            in.read(bytes);
                            byte b = bytes[0];
                            contentByte[i] = b;
                        }

                        String content = new String(contentByte);
                        System.out.println(content);
                        saveFile(filename, content);

                        break;
                    default:
                        printResponseStatusCode(responseCommandId, responseStatusCode, responseMessageType);
                        break;
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
