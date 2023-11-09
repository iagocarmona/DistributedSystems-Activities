"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var movies_grpc_pb_1 = require("./generated/movies_grpc_pb");
var grpc_1 = __importDefault(require("grpc"));
var movies_1 = require("./repository/movies");
(0, movies_1.connectMongo)().then(function () {
    var maxMessageSize = 1024 * 1024 * 1024;
    var serverOptions = {
        "grpc.max_message_length": maxMessageSize,
        "grpc.max_receive_message_length": maxMessageSize,
        "grpc.max_send_message_length": maxMessageSize,
    };
    var server = new grpc_1.default.Server(serverOptions);
    server.addService(movies_grpc_pb_1.MongoMoviesService, {
        getMoviesById: movies_1.myGetMovieById,
        createMovie: movies_1.myCreateMovie,
        deleteMovie: movies_1.myDeleteMovie,
        updateMovie: movies_1.myUpdateMovie,
        getAllMovies: movies_1.myGetAllMovies,
        getMoviesByActor: movies_1.myGetMoviesByActor,
        getMoviesByGenre: movies_1.myGetMoviesByGenre,
    });
    server.bind("0.0.0.0:50051", grpc_1.default.ServerCredentials.createInsecure());
    server.start();
    console.log("Servidor iniciado em 0.0.0.0:50051");
});
