package AT02SocketsUDP.Q02;

/**
 * Cliente
 * 
 * Classe que implementa o cliente do servidor de arquivos
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
import java.io.FileInputStream;
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.ByteBuffer;
import java.security.MessageDigest;
import java.util.Scanner;

public class Client {
     public static void main(String args[]) {
    try {
      int serverPort = 6666; // porta do servidor
      int clientPort = 6665; // porta do cliente

      /* cria um socket e mapeia a porta para aguardar conexao */
      // DatagramSocket dgramSocket = new DatagramSocket(serverPort);
      InetAddress serverAddr = InetAddress.getByName("127.0.0.1");
      DatagramSocket dgramSocket = new DatagramSocket(clientPort);

      /* cria um thread para atender a conexao */
      ClientThread c = new ClientThread(dgramSocket, serverAddr, serverPort);

      /* inicializa a thread */
      c.start();
      c.join();

    } catch (Exception e) {
      System.out.println("Listen socket:" + e.getMessage());
    } // catch
  } // main
}

class ClientThread extends Thread {
  DatagramSocket dgramSocket;
  InetAddress serverAddr;
  int serverPort;
  String currentPath;

    // construtor
    public ClientThread(DatagramSocket dgramSocket, InetAddress serverAddr, int serverPort) {
        try {
            this.dgramSocket = dgramSocket;
            this.serverAddr = serverAddr;
            this.serverPort = serverPort;

            this.currentPath = System.getProperty("user.dir");
        } catch (Exception e) {
        System.out.println("Listen socket:" + e.getMessage());
        }
    }

    /**
     * Envia um arquivo para o servidor
     * @param filename
     */
    void uploadFile(String filename){
        String path = this.currentPath + "/files/" + filename;

        File file = new File(path);
        if(!file.exists()){
            System.out.println("Arquivo não encontrado");
            return;
        }

        // cria o buffer com o protocolo
        ByteBuffer buffer = ByteBuffer.allocate(260);
        buffer.put((byte) filename.length());
        buffer.put(filename.getBytes());

        byte[] fileBytes = new byte[(int) file.length()];
        buffer.putInt(fileBytes.length);

        // cria o pacote com o buffer
        DatagramPacket request = new DatagramPacket(buffer.array(), buffer.array().length, this.serverAddr, this.serverPort);

        // lê o arquivo
        byte[] fileContent = new byte[(int) file.length()];


        // lê o arquivo
        try (FileInputStream fis = new FileInputStream(file)) {
            fis.read(fileContent);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // envia o protocolo para o servidor
        try {
            this.dgramSocket.send(request);

            // espera a resposta do servidor
            byte[] responseBuffer = new byte[1];
            DatagramPacket response = new DatagramPacket(responseBuffer, responseBuffer.length);
            this.dgramSocket.receive(response);

            // se o servidor não estiver pronto para receber o arquivo, encerra a conexão
            if(responseBuffer[0] != 1){
                System.out.println("Servidor não está pronto para receber o arquivo");
                return;
            }
        } catch (Exception e) {
            System.out.println("Listen socket:" + e.getMessage());
        }

        // envia o arquivo para o servidor a cada 1024 bytes 
        try {
            ByteBuffer newBuffer = ByteBuffer.allocate(1024);
            
            for (int i = 0; i < fileContent.length; i++) {
                newBuffer.put(fileContent[i]);

                // envia o buffer a cada 1024 bytes (incluindo o último pacote)
                if ((i + 1) % 1024 == 0 || i == fileContent.length - 1) {
                    DatagramPacket packet = new DatagramPacket(newBuffer.array(), newBuffer.position(), this.serverAddr, this.serverPort);
                    this.dgramSocket.send(packet);
                    newBuffer.clear();
                    System.out.println("Enviando arquivo: " + filename + " - " + (i + 1) + " bytes");
                }
            }

            // faz o checksum do arquivo em SHA-1
            MessageDigest md = MessageDigest.getInstance("SHA-1");
            byte[] checksum = md.digest(fileContent);

            // envia o checksum
            DatagramPacket packet = new DatagramPacket(checksum, checksum.length, this.serverAddr, this.serverPort);
            this.dgramSocket.send(packet);
        } catch (Exception e) {
            System.out.println("Listen socket:" + e.getMessage());
        }
    }   

  @Override
  public void run() {
    Scanner reader = new Scanner(System.in);
    try {
        String buffer = "";

        while (true) {
            buffer = reader.nextLine();

            String[] args = buffer.split(" ");

            switch (args[0]){
                case "UPLOAD":
                    if(args.length < 2){
                        System.out.println("Comando inválido");
                        break;
                    }

                    uploadFile(args[1]);
                    break;
                case "EXIT":
                    System.out.println("Encerrando conexão");
                    break;
                default:
                    System.out.println("Comando não encontrado");
                    break;
            }
        }

    } catch (Exception e) {
      System.out.println("Listen socket:" + e.getMessage());
    } finally {
        reader.close();
    }
  } // run
}
