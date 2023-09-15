package AT01SocketsTCP.Q02.headers;

import java.io.*;

public class RequestPacket {
    private byte messageType;
    private byte commandIdentifier;
    private byte filenameSize;
    private String filename;

    public RequestPacket(byte messageType, byte commandIdentifier, byte filenameSize, String filename) {
        this.messageType = messageType;
        this.commandIdentifier = commandIdentifier;
        this.filenameSize = filenameSize;
        this.filename = filename;
    }

    public void writeToStream(DataOutputStream outputStream) throws IOException {
        outputStream.writeByte(messageType);
        outputStream.writeByte(commandIdentifier);
        outputStream.writeByte(filenameSize);
        outputStream.writeBytes(filename);
    }

    public static RequestPacket readFromStream(DataInputStream inputStream) throws IOException {
        byte messageType = inputStream.readByte();
        byte commandIdentifier = inputStream.readByte();
        byte filenameSize = inputStream.readByte();

        byte[] filenameBytes = new byte[filenameSize];
        inputStream.readFully(filenameBytes);
        String filename = new String(filenameBytes);

        return new RequestPacket(messageType, commandIdentifier, filenameSize, filename);
    }

    public byte getMessageType() {
        return messageType;
    }

    public byte getCommandIdentifier() {
        return commandIdentifier;
    }

    public byte getFilenameSize() {
        return filenameSize;
    }

    public String getFilename() {
        return filename;
    }
}