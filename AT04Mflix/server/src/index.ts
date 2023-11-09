import * as dotenv from "dotenv";
dotenv.config();

import { MongoMoviesService } from "./generated/movies_grpc_pb";
import grpc from "grpc";
import {
    connectMongo,
    myCreateMovie,
    myDeleteMovie,
    myGetAllMovies,
    myGetMovieById,
    myGetMoviesByActor,
    myGetMoviesByGenre,
    myUpdateMovie,
} from "./repository/movies";

connectMongo().then(() => {
    const maxMessageSize = 1024 * 1024 * 1024;
    const serverOptions = {
        "grpc.max_message_length": maxMessageSize,
        "grpc.max_receive_message_length": maxMessageSize,
        "grpc.max_send_message_length": maxMessageSize,
    };
    const server = new grpc.Server(serverOptions);
    server.addService(MongoMoviesService, {
        getMoviesById: myGetMovieById,
        createMovie: myCreateMovie,
        deleteMovie: myDeleteMovie,
        updateMovie: myUpdateMovie,
        getAllMovies: myGetAllMovies,
        getMoviesByActor: myGetMoviesByActor,
        getMoviesByGenre: myGetMoviesByGenre,
    });

    server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
    server.start();
    console.log("Servidor iniciado em 0.0.0.0:50051");
});
