import Net, { Socket } from "net";
import * as dotenv from "dotenv";
import { Request } from "./generated/src/proto/movies_pb";

import { MongoClient, ServerApiVersion, Collection } from "mongodb";
import { handleSocketRequest } from "./service/request";

dotenv.config();

// SERVIDOR MONGO
const uri = process.env.MONGO_URI ?? "";
const database = process.env.DB_NAME ?? "sample_mflix";
const table = process.env.COLLECTION_NAME ?? "movies";

let db;
let collection: Collection;

// SERVIDOR SOCKET
const port = 6666;
const server = new Net.Server();

// Conecta o servidor mongo
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Conecta o servidor socket
server.listen(port, async function () {
    console.log(`Servidor socket TCP iniciado em http://localhost:${port}`);

    await client.connect();
    db = client.db(database);
    collection = db.collection(table);
});

// Trata as requisições recebidas pelo servidor socket
server.on("connection", function (socket: Socket) {
    console.log("Uma nova conexão foi estabelecida.");

    socket.on("data", function (chunk: Buffer) {
        console.log("chunk", chunk);
        const req = Request.deserializeBinary(chunk);
        handleSocketRequest(socket, req, collection);
    });

    socket.on("error", function (err: Error) {
        console.log(`Error: ${err}`);
    });
});
