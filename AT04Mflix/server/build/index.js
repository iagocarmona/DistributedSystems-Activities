"use strict";
// Servidor protobuf
// Descricao: Esta é o servidor que o cliente requisitará os dados referentes aos filmes
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Alunos: Jhonatan Guilherme de Oliveira Cunha
// Alunos: Jessé Pires Barbato Rocha
// Data de Início: 04/04/2023
// Data última atualização: 23/05/2023
var net_1 = __importDefault(require("net"));
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var movies_pb_1 = require("./generated/src/proto/movies_pb");
var mongodb_1 = require("mongodb");
var createMovieProtobuf_1 = require("./utils/createMovieProtobuf");
var validation_1 = require("./validation");
var OP = {
    'CREATE': 1,
    'FIND_BY_ID': 2,
    'UPDATE': 3,
    'DELETE': 4,
    'FIND_BY_ACTOR': 5,
    'FIND_BY_CATEGORY': 6,
};
// SERVIDOR MONGO
var uri = process.env.MONGO_URI || '';
var database = process.env.DB_NAME || "sample_mflix";
var table = process.env.COLLECTION_NAME || "movies";
var db;
var collection;
// SERVIDOR SOCKET
var port = 6666;
var server = new net_1.default.Server();
var client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
function getMovieById(collections, id) {
    return __awaiter(this, void 0, void 0, function () {
        var query, mongoMovie, protoMovie, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_1.ObjectId(id) };
                    return [4 /*yield*/, collections.findOne(query)];
                case 1:
                    mongoMovie = _a.sent();
                    if (!mongoMovie)
                        return [2 /*return*/, null];
                    protoMovie = (0, createMovieProtobuf_1.createMovieProtobuf)(mongoMovie);
                    return [2 /*return*/, protoMovie];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deleteMovie(collections, id) {
    return __awaiter(this, void 0, void 0, function () {
        var query, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = { _id: new mongodb_1.ObjectId(id) };
                    return [4 /*yield*/, collections.deleteOne(query)];
                case 1:
                    result = _a.sent();
                    if (!result || !result.deletedCount) {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
                case 2:
                    error_2 = _a.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getAllMovies(collection) {
    return __awaiter(this, void 0, void 0, function () {
        var moviesMongo, protoMovies, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, collection.find({}).toArray()];
                case 1:
                    moviesMongo = _a.sent();
                    protoMovies = moviesMongo.map(function (item) { return (0, createMovieProtobuf_1.createMovieProtobuf)(item); });
                    return [2 /*return*/, protoMovies];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createMovie(collection, movie) {
    return __awaiter(this, void 0, void 0, function () {
        var jsonMovie, created, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    jsonMovie = movie.toObject();
                    return [4 /*yield*/, collection.insertOne({
                            plot: jsonMovie.plot,
                            genres: jsonMovie.genresList.map(function (obj) { return obj.name; }),
                            runtime: jsonMovie.runtime,
                            cast: jsonMovie.castList.map(function (obj) { return obj.actor; }),
                            num_mflix_comments: jsonMovie.numMflixComments,
                            title: jsonMovie.title,
                            fullplot: jsonMovie.fullplot,
                            countries: jsonMovie.countriesList.map(function (obj) { return obj.name; }),
                            released: jsonMovie.released,
                            directors: jsonMovie.directorsList.map(function (obj) { return obj.name; }),
                            rated: jsonMovie.rated,
                            lastupdate: jsonMovie.lastupdated,
                            year: jsonMovie.year,
                            type: jsonMovie.type,
                            writers: jsonMovie.writersList.map(function (obj) { return obj.name; }),
                            languages: jsonMovie.languagesList.map(function (obj) { return obj.name; }),
                        })];
                case 1:
                    created = _a.sent();
                    if (!created)
                        return [2 /*return*/, null];
                    return [2 /*return*/, String(created.insertedId)];
                case 2:
                    error_4 = _a.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getMoviesByGenre(collection, genre) {
    return __awaiter(this, void 0, void 0, function () {
        var value, query, moviesMongo, protoMovies, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    value = genre.getName();
                    query = { genres: { $elemMatch: { $eq: value } } };
                    return [4 /*yield*/, collection.find(query).toArray()];
                case 1:
                    moviesMongo = _a.sent();
                    protoMovies = moviesMongo.map(function (item) { return (0, createMovieProtobuf_1.createMovieProtobuf)(item); });
                    return [2 /*return*/, protoMovies];
                case 2:
                    error_5 = _a.sent();
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getMoviesByActor(collection, cast) {
    return __awaiter(this, void 0, void 0, function () {
        var actor, query, moviesMongo, protoMovies, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    actor = cast.getActor();
                    query = { cast: { $elemMatch: { $eq: actor } } };
                    return [4 /*yield*/, collection.find(query).toArray()];
                case 1:
                    moviesMongo = _a.sent();
                    protoMovies = moviesMongo.map(function (item) { return (0, createMovieProtobuf_1.createMovieProtobuf)(item); });
                    return [2 /*return*/, protoMovies];
                case 2:
                    error_6 = _a.sent();
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function updateMovie(collection, id, movie) {
    return __awaiter(this, void 0, void 0, function () {
        var jsonMovie, idObject, acknowledged, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    jsonMovie = movie.toObject();
                    idObject = new mongodb_1.ObjectId(id);
                    return [4 /*yield*/, collection.updateOne({ _id: idObject }, { $set: {
                                plot: jsonMovie.plot,
                                genres: jsonMovie.genresList.map(function (obj) { return obj.name; }),
                                runtime: jsonMovie.runtime,
                                cast: jsonMovie.castList.map(function (obj) { return obj.actor; }),
                                num_mflix_comments: jsonMovie.numMflixComments,
                                title: jsonMovie.title,
                                fullplot: jsonMovie.fullplot,
                                countries: jsonMovie.countriesList.map(function (obj) { return obj.name; }),
                                released: jsonMovie.released,
                                directors: jsonMovie.directorsList.map(function (obj) { return obj.name; }),
                                rated: jsonMovie.rated,
                                lastupdate: jsonMovie.lastupdated,
                                year: jsonMovie.year,
                                type: jsonMovie.type,
                                writers: jsonMovie.writersList.map(function (obj) { return obj.name; }),
                                languages: jsonMovie.languagesList.map(function (obj) { return obj.name; }),
                            } })];
                case 1:
                    acknowledged = (_a.sent()).acknowledged;
                    return [2 /*return*/, acknowledged];
                case 2:
                    error_7 = _a.sent();
                    throw error_7;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function handleSocketRequest(socket, req) {
    return __awaiter(this, void 0, void 0, function () {
        var protoResponse, id, movie, data, response, _a, createdMovie, cast, genre, responseBytes, chunkSize, offset, sizeOfResponse, amountOfChunks, i, byteArray, endOfStreamMessage, error_8, responseBytes, chunkSize, offset, chunk;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    protoResponse = new movies_pb_1.Response();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 20, , 21]);
                    id = req.getRequestId();
                    movie = req.getMovie();
                    data = req.getData();
                    response = void 0;
                    protoResponse.setResponseId(id);
                    _a = id;
                    switch (_a) {
                        case OP.CREATE: return [3 /*break*/, 2];
                        case OP.FIND_BY_ID: return [3 /*break*/, 7];
                        case OP.UPDATE: return [3 /*break*/, 9];
                        case OP.DELETE: return [3 /*break*/, 12];
                        case OP.FIND_BY_ACTOR: return [3 /*break*/, 14];
                        case OP.FIND_BY_CATEGORY: return [3 /*break*/, 16];
                    }
                    return [3 /*break*/, 18];
                case 2:
                    validation_1.requestCreateValidation.validateSync(req.toObject());
                    if (!movie) return [3 /*break*/, 6];
                    return [4 /*yield*/, createMovie(collection, movie)];
                case 3:
                    response = _b.sent();
                    if (!!response) return [3 /*break*/, 4];
                    protoResponse.setMessage("Erro na tentativa de cria\u00E7\u00E3o do filme");
                    protoResponse.setSucess(false);
                    return [3 /*break*/, 6];
                case 4:
                    protoResponse.setMessage("Filme criado com sucesso");
                    protoResponse.setSucess(true);
                    return [4 /*yield*/, getMovieById(collection, response)];
                case 5:
                    createdMovie = _b.sent();
                    if (createdMovie)
                        protoResponse.addMovies(createdMovie);
                    _b.label = 6;
                case 6: return [3 /*break*/, 19];
                case 7: return [4 /*yield*/, getMovieById(collection, data)];
                case 8:
                    response = _b.sent();
                    if (!response) {
                        protoResponse.setMessage("Erro na busca do filme com o id ".concat(data));
                        protoResponse.setSucess(false);
                    }
                    else {
                        protoResponse.setMessage("Filme encontrado com sucesso");
                        protoResponse.setSucess(true);
                        protoResponse.addMovies(response);
                    }
                    return [3 /*break*/, 19];
                case 9:
                    if (!movie) return [3 /*break*/, 11];
                    return [4 /*yield*/, updateMovie(collection, data, movie)];
                case 10:
                    response = _b.sent();
                    if (!response) {
                        protoResponse.setMessage("Erro na tentativa de atualiza\u00E7\u00E3o do filme com o id ".concat(movie.getId()));
                        protoResponse.setSucess(false);
                    }
                    else {
                        protoResponse.setMessage("Filme atualizado com sucesso");
                        protoResponse.setSucess(true);
                        protoResponse.addMovies(movie);
                    }
                    _b.label = 11;
                case 11: return [3 /*break*/, 19];
                case 12: return [4 /*yield*/, deleteMovie(collection, data)];
                case 13:
                    // requestDeleteValidation.validateSync(req.toObject())
                    response = _b.sent();
                    if (!response) {
                        protoResponse.setMessage("Erro na tentativa de dele\u00E7\u00E3o do filme com o id ".concat(data));
                        protoResponse.setSucess(false);
                    }
                    else {
                        protoResponse.setMessage("Filme deletado com sucesso");
                        protoResponse.setSucess(true);
                    }
                    return [3 /*break*/, 19];
                case 14:
                    cast = new movies_pb_1.Cast();
                    cast.setActor(data);
                    return [4 /*yield*/, getMoviesByActor(collection, cast)];
                case 15:
                    response = _b.sent();
                    response.map(function (movie) { return protoResponse.addMovies(movie); });
                    if (!response.length) {
                        protoResponse.setMessage("Nenhum filme do ator ".concat(data, " foi encontrado"));
                        protoResponse.setSucess(false);
                    }
                    else {
                        protoResponse.setMessage("Busca conclu\u00EDda com sucesso");
                        protoResponse.setSucess(true);
                    }
                    return [3 /*break*/, 19];
                case 16:
                    genre = new movies_pb_1.Genre();
                    genre.setName(data);
                    return [4 /*yield*/, getMoviesByGenre(collection, genre)];
                case 17:
                    response = _b.sent();
                    response.map(function (movie) { return protoResponse.addMovies(movie); });
                    if (!response.length) {
                        protoResponse.setMessage("Nenhum filme da categoria ".concat(data, " foi encontrado"));
                        protoResponse.setSucess(false);
                    }
                    else {
                        protoResponse.setMessage("Busca conclu\u00EDda com sucesso");
                        protoResponse.setSucess(true);
                    }
                    return [3 /*break*/, 19];
                case 18:
                    protoResponse.setMessage("Identificador de requisi\u00E7\u00E3o inv\u00E1lido (".concat(id, ")"));
                    protoResponse.setSucess(false);
                    return [3 /*break*/, 19];
                case 19:
                    responseBytes = protoResponse.serializeBinary();
                    chunkSize = 4096;
                    offset = 0;
                    sizeOfResponse = responseBytes.length;
                    amountOfChunks = Number(Math.ceil(sizeOfResponse / chunkSize).toFixed(0));
                    i = 0;
                    while (1) {
                        if (offset > sizeOfResponse) {
                            offset = sizeOfResponse;
                        }
                        byteArray = new Uint8Array(4096);
                        byteArray.set(responseBytes.slice(offset, offset + chunkSize));
                        i += 1;
                        console.log('mandou chunk, "i', i, "offset", offset, "chunkSize", chunkSize, " chunk.length", byteArray.length);
                        socket.write(byteArray);
                        if (i === amountOfChunks) {
                            break;
                        }
                        else {
                            offset += chunkSize;
                        }
                    }
                    endOfStreamMessage = "END_OF_STREAM";
                    console.log('mando end of stream');
                    socket.write(endOfStreamMessage);
                    return [3 /*break*/, 21];
                case 20:
                    error_8 = _b.sent();
                    // if (error instanceof ValidationError) {
                    //   protoResponse.setMessage(error.message);
                    //   protoResponse.setSucess(false);
                    //   socket.write(protoResponse.serializeBinary());
                    // }
                    console.log('error[handleSocketRequest]:', error_8);
                    protoResponse.setMessage(JSON.stringify(error_8));
                    protoResponse.setSucess(false);
                    responseBytes = protoResponse.serializeBinary();
                    chunkSize = 4096;
                    for (offset = 0; offset < responseBytes.length; offset += chunkSize) {
                        chunk = responseBytes.slice(offset, offset + chunkSize);
                        socket.write(chunk);
                    }
                    return [3 /*break*/, 21];
                case 21: return [2 /*return*/];
            }
        });
    });
}
server.listen(port, function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Servidor socket TCP iniciado em http://localhost:".concat(port));
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    db = client.db(database);
                    collection = db.collection(table);
                    return [2 /*return*/];
            }
        });
    });
});
server.on('connection', function (socket) {
    console.log('Uma nova conexão foi estabelecida.');
    socket.on('data', function (chunk) {
        console.log('chunk', chunk);
        var req = movies_pb_1.Request.deserializeBinary(chunk);
        handleSocketRequest(socket, req);
    });
    socket.on('error', function (err) {
        console.log("Error: ".concat(err));
    });
});
