package AT01SocketsTCP.Q01.server;

/**
 * Descrição: Servidor para conexao TCP
 * Descricao: Recebe uma informacao do cliente e envia confirmações UTF-8.
 * 
 * Autor: Iago Ortega Carmona
 * 
 * Data de criação: 06/09/2023
 * Data última atualização: 19/09/2023
 */

import java.net.*;
import java.io.*;

import java.security.MessageDigest;

public class server {
    public static server.User[] users;

    /**
     * Descrição: main para conexao TCP
     * @param args
     */
    public static void main (String args[]) {
        try {
            users = new server.User[] {
                new server.User("admin", "admin"),
                new server.User("user", "user")
            };

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

    /**
     * Descrição: Connection para conexao TCP
     * Descricao: Classe para tratar as conexões com os clientes.
     * 
     * Autor: Iago Ortega Carmona
     * 
     * Data de criação: 06/09/2023
     * Data última atualização: 19/09/2023
     */
    static class Connection extends Thread {
        DataInputStream in;
        DataOutputStream out;
        Socket clientSocket;

        /**
         * Descrição: Connection para conexao TCP
         * @param aClientSocket
         */
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

        /**
         * Descrição: run para conexao TCP
         */
        public void run() {
            try {
                boolean isUserAuthenticated = false;
                while (true) {
                    String data = in.readUTF();   /* aguarda o envio de dados */
                    String[] command = data.split(" ");
                    
                    // Verifique se o usuário está autenticado
                    if (command[0].equalsIgnoreCase("connect")) {
                        String[] credentials = command[1].split(",");

                        // Verifique se o usuário existe
                        for (User user : users) {
                            // Verifique se as credenciais são válidas
                            if (user.authenticate(credentials[0], credentials[1])) {
                                isUserAuthenticated = true;
                                break;
                            }
                        }

                        // Envie a resposta para o cliente
                        if (isUserAuthenticated) {
                            out.writeUTF("SUCCESS");
                        } else {
                            out.writeUTF("ERROR");
                        }
                    } else if (command[0].equalsIgnoreCase("pwd")) { // Verifique se o comando é "pwd"
                        // Verifique se o usuário está autenticado
                        if (!isUserAuthenticated) {
                            out.writeUTF("NOT_AUTHENTICATED");
                            continue;  
                        }

                        out.writeUTF(System.getProperty("user.dir"));
                    } else if (command[0].equalsIgnoreCase("chdir")){ // Verifique se o comando é "chdir"

                        // Verifique se o usuário está autenticado
                        if (!isUserAuthenticated) {
                            out.writeUTF("NOT_AUTHENTICATED");
                            continue;  
                        }
                        String path = command[1];

                        // Verifique se o caminho é ".." para voltar um diretório
                        if (path.equals("..")) {
                            File currentDir = new File(System.getProperty("user.dir"));
                            String parentDir = currentDir.getParent();
                            // Verifique se o diretório pai existe
                            if (parentDir != null) {
                                System.setProperty("user.dir", parentDir);
                                out.writeUTF("SUCCESS");
                            } else {
                                out.writeUTF("ERROR");
                            }
                        } else {
                            // Construa o caminho absoluto com base no diretório atual
                            File file = new File(System.getProperty("user.dir"), path);

                            if (file.exists()) {
                                // Verifique se o arquivo/diretório existe
                                System.setProperty("user.dir", file.getAbsolutePath());
                                out.writeUTF("SUCCESS");
                            } else {
                                out.writeUTF("ERROR");
                            }
                        }
                    } else if (command[0].equalsIgnoreCase("getfiles")) { // Verifique se o comando é "getfiles"
                        if (!isUserAuthenticated) {
                            out.writeUTF("NOT_AUTHENTICATED");
                            continue;  
                        }
                        // Obtenha a lista de arquivos do diretório atual
                        File currentDir = new File(System.getProperty("user.dir"));
                        File[] files = currentDir.listFiles();

                        // Percorra a lista de arquivos e adicione apenas os arquivos
                        String filesList = "";
                        Integer filesCount = 0;

                        for (File file : files) {
                            if (file.isFile()){
                                filesList += file.getName() + "\n";
                                filesCount++;
                            }
                        }

                        out.writeUTF(filesCount + "\n" + filesList);
                    } else if (command[0].equalsIgnoreCase("getdirs")) { // Verifique se o comando é "getdirs"
                        if (!isUserAuthenticated) {
                            out.writeUTF("NOT_AUTHENTICATED");
                            continue;  
                        }

                        // Obtenha a lista de arquivos do diretório atual
                        File currentDir = new File(System.getProperty("user.dir"));
                        File[] files = currentDir.listFiles();


                        // Percorra a lista de arquivos e adicione apenas os diretórios
                        String filesList = "";
                        Integer dirsCount = 0;
                        for (File file : files) {
                            if (file.isDirectory()) {
                                filesList += file.getName() + "\n";
                                dirsCount++;
                            }
                        }

                        out.writeUTF(dirsCount + "\n" + filesList);
                    } else if (command[0].equalsIgnoreCase("exit")) {
                        break;
                    } else {
                        out.writeUTF("Comando inválido.");
                    }
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

    /**
     * Descrição: User para conexao TCP
     * Descricao: Classe para armazenar os dados do usuário.
     * 
     * Autor: Iago Ortega Carmona
     * 
     * Data de criação: 06/09/2023
     * Data última atualização: 18/09/2023
     */

    static class User {
        String name;
        String password;
        
        public User(String name, String password) {
            this.name = name;
            this.password = this.convertSHA512(password);
        }

        public boolean authenticate(String name, String password) {
            return this.name.equals(name) && this.password.equals(this.convertSHA512(password));
        }

        public String getName() {
            return this.name;
        }

        public String getPassword() {
            return this.password;
        }

        public String convertSHA512(String password){
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-512");
                byte[] hash = digest.digest(password.getBytes("UTF-8"));
                StringBuilder hexString = new StringBuilder();

                for (int i = 0; i < hash.length; i++) {
                    String hex = Integer.toHexString(0xff & hash[i]);
                    if(hex.length() == 1) hexString.append('0');
                    hexString.append(hex);
                }

                return hexString.toString();
            } catch(Exception ex){
                throw new RuntimeException(ex);
            }
        }
    }
}
