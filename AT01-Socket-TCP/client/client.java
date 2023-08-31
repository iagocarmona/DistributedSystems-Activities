import java.net.*;
import java.io.*;

public class client {
    public static void main(String args[]) {
        Socket s = null;
        try {
            int serverPort = 7896;   /* especifica a porta */
            String ip = "localhost";
            s = new Socket(ip, serverPort);  /* conecta com o servidor */  

            /* cria objetos de leitura e escrita */
            DataInputStream in = new DataInputStream(s.getInputStream());
            DataOutputStream out = new DataOutputStream(s.getOutputStream());

            // Mantém a conexão ativa até enviar a mensagem "exit"
            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            String message;
            
            while (true) {
                message = reader.readLine();
                out.writeUTF(message);  // envia a mensagem para o servidor

                if (message.equalsIgnoreCase("exit")) {
                    break;  // Sai do loop se a mensagem for "exit"
                }

                String response = in.readUTF();  // aguarda resposta do servidor
                System.out.println("Resposta do servidor: " + response);
            }

            in.close();
            out.close();
            s.close();  // finaliza a conexão
        } catch (UnknownHostException e) {
            System.out.println("Socket:" + e.getMessage());
        } catch (EOFException e) {
            System.out.println("EOF:" + e.getMessage());
        } catch (IOException e) {
            System.out.println("leitura:" + e.getMessage());
        }
    }
}
