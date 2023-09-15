package AT01SocketsTCP.Q02.client;

import java.net.*;
import java.io.*;

import AT01SocketsTCP.Q02.headers.RequestPacket;
import AT01SocketsTCP.Q02.headers.ResponsePacket;

public class client {

    public static void printResponseStatusCode(byte commandId, byte statusCode) {
        switch (commandId) {
            case 1: // ADDFILE
                if (statusCode == 2)
                    System.out.println("Erro ao tentar criar arquivo :(");
                else
                    System.out.println("Arquivo criado com sucesso :)");
                break;
            case 2: // DELETE
                if (statusCode == 2)
                    System.out.println("Erro ao tentar deletar arquivo :(");
                else
                    System.out.println("Arquivo deletar com sucesso :)");
                break;
            case 3: // GETFILESLIST
                break;
            case 4: // GETFILE
                break;
        }
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
    
    public static void main(String args[]) {
        Socket s = null;
        try {
            int serverPort = 7896;   /* especifica a porta */
            String ip = "localhost";
            s = new Socket(ip, serverPort);  /* conecta com o servidor */  

            /* cria objetos de leitura e escrita */
            DataInputStream in = new DataInputStream(s.getInputStream());
            DataOutputStream out = new DataOutputStream(s.getOutputStream());

            BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
            
            while (true) {
                String data = reader.readLine();   /* aguarda o envio de dados */
                String[] command = data.split(" ");

                String filename = "";
                byte messageType = 0x01;
                
                if (command[0].equalsIgnoreCase("ADDFILE")) {
                    filename = command[1];
                
                    // Crie o objeto RequestPacket
                    RequestPacket request = new RequestPacket(messageType, (byte) 0x01, (byte) filename.length(), filename);
                    request.writeToStream(out);
                    out.flush();
                } else if (command[0].equalsIgnoreCase("GETFILESLIST")){
                    // Crie o objeto RequestPacket
                    RequestPacket request = new RequestPacket(messageType, (byte) 0x02, (byte) filename.length(), filename);
                    request.writeToStream(out);
                    out.flush();
                } else if (command[0].equalsIgnoreCase("DELETE")){
                    filename = command[1];
                
                    // Crie o objeto RequestPacket
                    RequestPacket request = new RequestPacket(messageType, (byte) 0x03, (byte) filename.length(), filename);
                    request.writeToStream(out);
                    out.flush();
                } else if (command[0].equalsIgnoreCase("GETFILE")){
                    filename = command[1];
                
                    // Crie o objeto RequestPacket
                    RequestPacket request = new RequestPacket(messageType, (byte) 0x04, (byte) filename.length(), filename);
                    request.writeToStream(out);
                    out.flush();
                } else {
                    System.out.println("Comando inválido");
                }

                // Leia os bytes do inputStream e crie um ResponsePacket
                ResponsePacket response = ResponsePacket.readFromStream(in);

                // Agora você pode acessar os campos do ResponsePacket
                byte responseMessageType = response.getMessageType();
                byte responseCommandIdentifier = response.getCommandIdentifier();
                byte responseStatusCode = response.getStatusCode();


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
