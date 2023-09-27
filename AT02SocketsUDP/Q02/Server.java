package AT02SocketsUDP.Q02;

/**
 * Server
 * 
 * Servidor que recebe um arquivo do cliente
 * 
 * Autor: Iago Ortega Carmona
 * 
 * A requisição ao servidor é feita através de um comando digitado pelo usuário
 * UPLOAD <nome do arquivo> - Envia um arquivo para o servidor
 * 
 * Primeiro é enviado o seguinte protocolo:
 *  - tamanho do nome do arquivo [1 btye]
 *  - nome do arquivo [255 bytes]
 *  - tamanho do arquivo [4 bytes]
 * 
 * O cliente aguarda uma resposta de recebimento do servidor de 1 byte
 * e depois envia o arquivo a cada 256 bytes para o servidor
 * 
 * Após finalizar o envio do arquivo, o cliente envia o checksum da requisição
 *  - checksum [8 bytes]
 * 
 * O servidor recebe o checksum e calcula o checksum do arquivo recebido, se for válido, o arquivo é salvo
 * 
 * Data última atualização: 26/09/2023
 */

import java.io.File;
import java.io.FileOutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.security.MessageDigest;
import java.util.Arrays;

public class Server {
      public static void main(String args[]) {
        try {
            int serverPort = 6666; // porta do servidor

            /* cria um socket e mapeia a porta para aguardar conexao */
            DatagramSocket dgramSocket = new DatagramSocket(serverPort);

            /* cria um thread para atender a conexao */
            ServerThread server = new ServerThread(dgramSocket);

            /* inicializa a thread */
            server.start();
            server.join();

        } catch (Exception e) {
            System.out.println("Listen socket:" + e.getMessage());
        } // catch
    } // main
}

class ServerThread extends Thread {
    DatagramSocket dgramSocket;
    String currentPath;

    public ServerThread(DatagramSocket dgramSocket) {
        try {
            this.dgramSocket = dgramSocket;

            // cria um diretorio para o servidor
            File theDir = new File("/uploads");
            if(!theDir.exists()) theDir.mkdirs();

            // define o diretorio atual do servidor
            this.currentPath = System.getProperty("user.dir") + "/uploads/";
        } catch (Exception e) {
            System.out.println("Listen socket:" + e.getMessage());
        }
    }

    @Override
    public void run() {
        try {
            byte[] buffer;
            DatagramPacket reply;
            while (true) {  
                buffer = new byte[260];
                reply = new DatagramPacket(buffer, buffer.length);

                // recebe a requisição do cliente
                dgramSocket.receive(reply);

                ByteBuffer header = ByteBuffer.wrap(buffer);
                header.order(ByteOrder.BIG_ENDIAN);

                // tamanho do nome do arquivo
                int filenameLength = header.get();

                // nome do arquivo
                byte[] filenameBytes = new byte[filenameLength];
                header.get(filenameBytes);
                String filename = new String(filenameBytes);

                // tamanho do arquivo
                int fileLength = header.getInt();

                System.out.println("Recebendo arquivo: " + filename + " - " + fileLength + " bytes");

                // enviar resposta de recebimento
                buffer = new byte[1];
                buffer[0] = 1;
                reply = new DatagramPacket(buffer, buffer.length, reply.getAddress(), reply.getPort());
                dgramSocket.send(reply);

                // Recebe o arquivo
                byte[] fileData = new byte[fileLength];
                int bytesRead;
                byte[] fileBuffer = new byte[1024];

                int offset = 0;
                while (fileLength > 0) {
                    buffer = new byte[Math.min(fileLength, fileBuffer.length)];
                    System.out.println("buff size: " + Math.min(fileLength, fileBuffer.length));
                    reply = new DatagramPacket(buffer, buffer.length);
                    dgramSocket.receive(reply);
                    bytesRead = reply.getLength();
                    System.arraycopy(reply.getData(), 0, fileData, offset, bytesRead);
                    offset += bytesRead;
                    fileLength -= bytesRead;

                    System.out.println("Recebido: " + bytesRead + " bytes");
                }

                // recebe o checksum
                buffer = new byte[20];
                reply = new DatagramPacket(buffer, buffer.length);
                dgramSocket.receive(reply);
                byte[] receivedChecksum = reply.getData();
                
                // calcula o checksum do arquivo
                MessageDigest md = MessageDigest.getInstance("SHA-1");
                byte[] calculatedChecksum = md.digest(fileData);

                System.out.println("Checksum recebido: " + new String(receivedChecksum));
                System.out.println("Checksum calculado: " + new String(calculatedChecksum));

                // Check if the received checksum matches the calculated checksum
                if (Arrays.equals(receivedChecksum, calculatedChecksum)) {
                    // The file was received correctly
                    FileOutputStream fileOutputStream = new FileOutputStream(this.currentPath + filename);
                    fileOutputStream.write(fileData);
                    fileOutputStream.close();
                    System.out.println("Arquivo recebido e salvo com sucesso: " + filename);
                } else {
                    // The file is corrupted
                    System.out.println("Arquivo corrompido: " + filename);
                }
            }
        } catch (Exception e) {
            System.out.println("Listen socket:" + e.getMessage());
        } // catch
    } // run
}
