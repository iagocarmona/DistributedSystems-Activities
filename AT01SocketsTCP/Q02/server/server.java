package AT01SocketsTCP.Q02.server;

import java.net.*;
import java.util.logging.FileHandler;
import java.util.logging.SimpleFormatter;
import java.io.*;

import java.util.logging.*;

import AT01SocketsTCP.Q02.headers.RequestPacket;
// import AT01SocketsTCP.Q02.headers.ResponsePacket;

public class server {
    public static void main (String args[]) {
        try {
            int serverPort = 7896; // porta do servidor
            try (ServerSocket listenSocket = new ServerSocket(serverPort)) {
                while (true) {
                    System.out.println("Servidor aguardando conexão ...");
                    Socket clientSocket = listenSocket.accept();
                    
                    System.out.println("Cliente conectado ... Criando thread ...");
                    new Connection(clientSocket);
                }
            }

        } catch (IOException e) {
            System.out.println("Listen socket: " + e.getMessage());
        }
    }

    static class Connection extends Thread {
        DataInputStream in;
        DataOutputStream out;
        Socket clientSocket;

        private static final Logger logger = Logger.getLogger("tcp");

        public Connection(Socket aClientSocket) {
            try {
                FileHandler fileHandler = new FileHandler("./AT01SocketsTCP/Q02/tcp.log");
                fileHandler.setFormatter(new SimpleFormatter());
                logger.addHandler(fileHandler);

                clientSocket = aClientSocket;
                in = new DataInputStream(clientSocket.getInputStream());
                out = new DataOutputStream(clientSocket.getOutputStream());
                this.start();  /* inicializa a thread */
            } catch (IOException e) {
                System.out.println("Connection: " + e.getMessage());
            }
        }

        public static String getCommandByByte(byte commandId) {
            switch (commandId) {
                case 1:
                    return "ADDFILE";
                case 2:
                    return "DELETE";
                case 3:
                    return "GETFILELIST";
                case 4:
                    return "GETFILE";
                default:
                    return "UNKNOWN";
            }
        }

        public void run() {
            try {
                while (true) {
                    int dataSize = in.readInt();
                    byte[] dataBytes = new byte[dataSize];

                    ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(dataBytes);
                    DataInputStream dataInputStream = new DataInputStream(byteArrayInputStream);
                    RequestPacket request = RequestPacket.readFromStream(dataInputStream);

                    // String filename = request.getFilename();
                    byte commandIdentifier = request.getCommandIdentifier();
                    String command = getCommandByByte(commandIdentifier);
                    
                    if (command.equalsIgnoreCase("ADDFILE")) {

                    } else if (command.equalsIgnoreCase("DELETE")) {

                    } else if (command.equalsIgnoreCase("GETFILELIST")){

                    } else if (command.equalsIgnoreCase("GETFILE")) {

                    } else {
                        out.writeUTF("Comando inválido.");
                    }
                }

                // System.out.println("Cliente desconectado.");
                // in.close();
                // out.close();
                // clientSocket.close();
            } catch (EOFException e) {
                System.out.println("EOF: " + e.getMessage());
            } catch (IOException e) {
                System.out.println("Erro de leitura: " + e.getMessage());
            }
        }
    }
}
