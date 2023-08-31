import java.net.*;
import java.io.*;

public class server {
    public static void main (String args[]) {
        try {
            int serverPort = 7896; // porta do servidor
            ServerSocket listenSocket = new ServerSocket(serverPort);
            
            while (true) {
                System.out.println("Servidor aguardando conexão ...");
                Socket clientSocket = listenSocket.accept();
                
                System.out.println("Cliente conectado ... Criando thread ...");
                new Connection(clientSocket);
            }
            
        } catch (IOException e) {
            System.out.println("Listen socket: " + e.getMessage());
        }
    }

    static class Connection extends Thread {
        DataInputStream in;
        DataOutputStream out;
        Socket clientSocket;

        public Connection(Socket aClientSocket) {
            try {
                clientSocket = aClientSocket;
                in = new DataInputStream(clientSocket.getInputStream());
                out = new DataOutputStream(clientSocket.getOutputStream());
                this.start();  /* inicializa a thread */
            } catch (IOException e) {
                System.out.println("Connection: " + e.getMessage());
            }
        }

        public void run() {
            try {
                while (true) {
                    String data = in.readUTF();   /* aguarda o envio de dados */
                    System.out.println("Cliente disse: " + data);

                    if (data.equalsIgnoreCase("EXIT")) {
                        break; // Encerrar a conexão se o cliente enviar "EXIT"
                    }

                    // Envie uma resposta de volta para o cliente
                    String response = "Recebido: " + data;
                    out.writeUTF(response);
                }

                System.out.println("Cliente desconectado.");
                in.close();
                out.close();
                clientSocket.close();
            } catch (EOFException e) {
                System.out.println("EOF: " + e.getMessage());
            } catch (IOException e) {
                System.out.println("Erro de leitura: " + e.getMessage());
            }
        }
    }
}
