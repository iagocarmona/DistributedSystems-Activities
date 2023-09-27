package AT02SocketsUDP.Q01;

/**
 * ChatUDP: Servidor UDP
 * Descricao: Implementa um chat P2P utilizando o protocolo UDP
 * Autor: Iago Ortega Carmona
 * Data última modificação: 26/09/2023
 */

import java.net.*;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.io.*;

public class ChatUDP{
    public static void main(String args[]) throws InterruptedException{ 
        DatagramSocket dgramSocket = null;
        Scanner reader = new Scanner(System.in);
        try{
            System.out.print("Informe a porta de origem: ");
            int srcPort = reader.nextInt();

            dgramSocket = new DatagramSocket(srcPort);

            System.out.print("Informe a porta de destino: ");
            int dstPort = reader.nextInt();

            System.out.print("Informe seu nome de usuário: ");
            String nickname = reader.next();

            // Utiliza o endereço IP padrão (localhost) e a porta de destino informada
            InetAddress serverAddr = InetAddress.getByName("localhost");
            int serverPort = dstPort; 

            // Cria as threads de envio e recebimento de datagramas
            SendDatagramThread send = new SendDatagramThread(dgramSocket, serverAddr, serverPort, nickname);
            ReceiveDatagramThread receive = new ReceiveDatagramThread(dgramSocket, serverAddr, serverPort, nickname);

            // Inicia as threads
            send.start();
            receive.start();

            // Aguarda o término das threads
            send.join();
            reader.close();
           
        }catch (SocketException e){
            System.out.println("Socket: " + e.getMessage());
        }catch (IOException e) {
            System.out.println("IO: " + e.getMessage());
        } finally {
            dgramSocket.close();
        } //finally
    } //main
}//class

/**
 * SendDatagramThread: Thread para envio de datagramas
 */
class SendDatagramThread extends Thread {
    DatagramSocket dgramSocket;
    InetAddress serverAddr;
    int serverPort;
    String nickname;
    byte nicknameSize;

    // Construtor
    public SendDatagramThread(DatagramSocket dgramSocket, InetAddress serverAddr, int serverPort, String nickname) {
        this.dgramSocket = dgramSocket;
        this.serverAddr = serverAddr;
        this.serverPort = serverPort;
        this.nickname = nickname;
        this.nicknameSize = (byte) nickname.length();
    }

    // Cria o datagrama com a mensagem
    public ByteBuffer createHeader(byte messageType, byte nicknameSize, String nickname, byte messageSize, String message){
        ByteBuffer buffer = ByteBuffer.allocate(322);
        buffer.put(messageType);
        buffer.put(nicknameSize);
        buffer.put(nickname.getBytes());
        buffer.put(messageSize);
        buffer.put(message.getBytes());
        return buffer;
    }

    // Imprime a mensagem enviada
    void printMessage(String message, byte messageType) {
        switch (messageType) {
            case 1:
                System.out.println("Você" + " <Text>: " + message + "\n");
                break;
            case 2:
                System.out.println("Você" + " <Emoji>: " + message + "\n");
                break;
            case 3:
                System.out.println("Você" + " <URL>: " + message + "\n");
                break;
            case 4:
                System.out.println("Você" + " <ECHO>: " + message + "\n");
                break;
        }
    }

    // Mapeamento de códigos para emojis
    private static final Map<String, String> emojiMap = new HashMap<>();
    static {
        emojiMap.put(":1", ":)");
        emojiMap.put(":2", ":(");
        emojiMap.put(":3", ":D");
        emojiMap.put(":4", ":P");
        emojiMap.put(":5", ":O");
        emojiMap.put(":7", ":|");
    }

    public class MessageTypeResult {
        private byte messageType;
        private String newMessage;

        public MessageTypeResult(byte messageType, String newMessage) {
            this.messageType = messageType;
            this.newMessage = newMessage;
        }

        public byte getMessageType() {
            return messageType;
        }

        public String getNewMessage() {
            return newMessage;
        }
    }

    // Verifica o tipo da mensagem
    public MessageTypeResult getMessageType(String message) {
        byte messageType = 1;
        String newMessage = message;

        // Verifica se a mensagem é um emoji
        if (message.startsWith(":")) {
            // Verifica se o emoji existe no mapeamento
            if (emojiMap.containsKey(message)) {
                // Substitui o código pelo emoji
                newMessage = emojiMap.get(message);
                // Define o tipo da mensagem como emoji
                messageType = 2;
            } else {
                System.out.println("Emoji inválido");
                messageType = 0;
            }
        }

        // Verifica se a mensagem é uma URL
        if (message.startsWith("url")) {
            // Verifica se a URL é válida
            if (message.contains("http://") || 
                message.contains("https://") || 
                message.contains("ftp://") || 
                message.contains("ftps://") || 
                message.contains("sftp://") || 
                message.contains("ssh://") || 
                message.contains("file://")
            ) {
                // Define o tipo da mensagem como URL
                messageType = 3;
            } else {
                System.out.println("URL inválida");
                messageType = 0;
            }
        }
        
        // Verifica se a mensagem é um echo
        if (message.startsWith("echo")) {
            // Define o tipo da mensagem como echo
            messageType = 4;
        }

        return new MessageTypeResult(messageType, newMessage);
    }

    @Override
    public void run(){
        try {
            try (Scanner reader = new Scanner(System.in)) {
                while (true) {
                    String message = reader.nextLine();

                    // Chama o método getMessageType
                    MessageTypeResult result = getMessageType(message);

                    // Obtém os valores do resultado
                    byte messageType = result.getMessageType();
                    String newMessage = result.getNewMessage();

                    // Verifica se a mensagem é inválida
                    if (messageType == 0) {
                        // Ignore a mensagem inválida
                        continue;
                    }

                    // Cria o datagrama com a mensagem
                    ByteBuffer buffer = createHeader(messageType, nicknameSize, nickname, (byte) newMessage.length(), newMessage);

                    // Envia o datagrama ao servidor
                    DatagramPacket dgramPacket = new DatagramPacket(buffer.array(), buffer.array().length, serverAddr, serverPort);
                    dgramSocket.send(dgramPacket);

                    // Imprime a mensagem enviada
                    printMessage(newMessage, messageType);
                }
            }
        } catch (Exception e) {
            System.out.println("IOException: " + e.getMessage());
        } 
    }
}

/**
 * ReceiveDatagramThread: Thread para recebimento de datagramas
 */
class ReceiveDatagramThread extends Thread {
    DatagramSocket dgramSocket;
    InetAddress serverAddr;
    int serverPort;
    String myNickname;

    // Construtor
    public ReceiveDatagramThread(DatagramSocket dgramSocket, InetAddress serverAddr, int serverPort, String myNickname) {
        this.dgramSocket = dgramSocket;
        this.serverAddr = serverAddr;
        this.serverPort = serverPort;
        this.myNickname = myNickname;
    }

    // Extrai o nickname do datagrama
    public String getNickName(ByteBuffer buffer){
        byte nicknameSize = buffer.get();
        byte[] nicknameBytes = new byte[nicknameSize];
        buffer.get(nicknameBytes);
        return new String(nicknameBytes);
    }

    // Extrai a mensagem do datagrama
    public String getMessage(ByteBuffer buffer){
        byte messageSize = buffer.get();
        byte[] messageBytes = new byte[messageSize];
        buffer.get(messageBytes);
        return new String(messageBytes);
    }

    // Verifica o tipo da mensagem
    public byte getMessageType(ByteBuffer buffer){
        return buffer.get();
    }

    // Imprime a mensagem recebida
    void printMessage(String message, byte messageType, String nickname) {
        switch (messageType) {
            case 1:
                System.out.println("\n" + nickname + " <Text>: " + message + "\n");
                break;
            case 2:
                System.out.println("\n" + nickname + " <Emoji>: " + message + "\n");
                break;
            case 3:
                System.out.println("\n" + nickname + " <URL>: " + message + "\n");
                break;
            case 4:
                System.out.println("\n" + nickname + " <ECHO>: " + message + "\n");
                break;
            case 5:
                System.out.println("\n" + nickname + " <ECHO>: " + message + "\n");
                break;
        }
    }

    @Override
    public void run(){
        try {

            while (true) {
                // Cria o buffer para receber o datagrama
                ByteBuffer buffer = ByteBuffer.allocate(322);

                // Recebe o datagrama do servidor
                DatagramPacket dgramPacket = new DatagramPacket(buffer.array(), buffer.array().length);
                dgramSocket.receive(dgramPacket);

                // Extrai os dados do datagrama
                buffer = ByteBuffer.wrap(dgramPacket.getData());
                byte messageType = getMessageType(buffer);
                String nickname = getNickName(buffer);
                String message = getMessage(buffer);
                
                // Imprime a mensagem recebida
                printMessage(message, messageType, nickname);

                if (messageType == 4){
                    // Cria o datagrama com a mensagem
                    ByteBuffer echoBuffer = ByteBuffer.allocate(322);
                    echoBuffer.put((byte) 5);
                    echoBuffer.put((byte) nickname.length());
                    echoBuffer.put(nickname.getBytes());
                    echoBuffer.put((byte) message.length());
                    echoBuffer.put(message.getBytes());

                    // Envia o datagrama ao servidor
                    DatagramPacket echoPacket = new DatagramPacket(echoBuffer.array(), echoBuffer.array().length, serverAddr, serverPort);
                    dgramSocket.send(echoPacket);
                }
            }
        } catch (Exception e) {
            System.out.println("IOException: " + e.getMessage());
        } 
    }
}