package AT01SocketsTCP.Q02.headers;

import java.io.*;

public class ResponsePacket {
    private byte messageType;
    private byte commandIdentifier;
    private byte statusCode;

    public ResponsePacket(byte messageType, byte commandIdentifier, byte statusCode) {
        this.messageType = messageType;
        this.commandIdentifier = commandIdentifier;
        this.statusCode = statusCode;
    }

    public void writeToStream(DataOutputStream outputStream) throws IOException {
        outputStream.writeByte(messageType);
        outputStream.writeByte(commandIdentifier);
        outputStream.writeByte(statusCode);
    }

    public static ResponsePacket readFromStream(DataInputStream inputStream) throws IOException {
        byte messageType = inputStream.readByte();
        byte commandIdentifier = inputStream.readByte();
        byte statusCode = inputStream.readByte();

        return new ResponsePacket(messageType, commandIdentifier, statusCode);
    }

    public byte getMessageType() {
        return messageType;
    }

    public byte getCommandIdentifier() {
        return commandIdentifier;
    }

    public byte getStatusCode() {
        return statusCode;
    }
}