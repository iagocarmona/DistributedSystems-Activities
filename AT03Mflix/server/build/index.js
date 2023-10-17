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
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var movies_pb_1 = require("./generated/movies_pb");
var mongodb_1 = require("mongodb");
var createMovieProtobuf_1 = require("./utils/createMovieProtobuf");
var validation_1 = require("./validation");
var yup_1 = require("yup");
var grpc_1 = __importDefault(require("grpc"));
var movies_grpc_pb_1 = require("./generated/movies_grpc_pb");
// SERVIDOR MONGO
var uri = process.env.MONGO_URI || "";
var database = process.env.DB_NAME || "sample_mflix";
var table = process.env.COLLECTION_NAME || "movies";
var db;
var collections;
var client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
function connectMongo() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    db = client.db(database);
                    collections = db.collection(table);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log("error mongo", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function myGetMovieById(call, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var protoResponse, data, request, query, mongoMovie, protoMovie, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    protoResponse = new movies_pb_1.Response();
                    data = call.request.getData();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    request = call.request.toObject();
                    validation_1.requestGetValidation.validateSync(request);
                    query = { _id: new mongodb_1.ObjectId(data) };
                    return [4 /*yield*/, collections.findOne(query)];
                case 2:
                    mongoMovie = _a.sent();
                    if (!mongoMovie)
                        throw new Error();
                    protoMovie = (0, createMovieProtobuf_1.createMovieProtobuf)(mongoMovie);
                    protoResponse.setMessage("Filme encontrado com sucesso");
                    protoResponse.setSucess(true);
                    protoResponse.addMovies(protoMovie);
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    if (error_2 instanceof yup_1.ValidationError) {
                        protoResponse.setMessage(error_2.message);
                    }
                    else {
                        protoResponse.setMessage("Erro na busca do filme com o id ".concat(data));
                    }
                    protoResponse.setSucess(false);
                    return [3 /*break*/, 5];
                case 4:
                    callback(null, protoResponse);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function myDeleteMovie(call, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var protoResponse, data, request, query, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    protoResponse = new movies_pb_1.Response();
                    data = call.request.getData();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    request = call.request.toObject();
                    validation_1.requestDeleteValidation.validateSync(request);
                    query = { _id: new mongodb_1.ObjectId(data) };
                    return [4 /*yield*/, collections.deleteOne(query)];
                case 2:
                    result = _a.sent();
                    if (!result || !result.deletedCount)
                        throw new Error();
                    protoResponse.setMessage("Filme deletado com sucesso");
                    protoResponse.setSucess(true);
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    if (error_3 instanceof yup_1.ValidationError) {
                        protoResponse.setMessage(error_3.message);
                    }
                    else {
                        protoResponse.setMessage("Erro na tentativa de dele\u00E7\u00E3o do filme com o id ".concat(data));
                    }
                    protoResponse.setSucess(false);
                    return [3 /*break*/, 5];
                case 4:
                    callback(null, protoResponse);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function myGetAllMovies(call) {
    return __awaiter(this, void 0, void 0, function () {
        var protoResponse, moviesMongo, _i, moviesMongo_1, movie, protoMovie, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    protoResponse = new movies_pb_1.Response();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, collections.find({}).toArray()];
                case 2:
                    moviesMongo = _a.sent();
                    for (_i = 0, moviesMongo_1 = moviesMongo; _i < moviesMongo_1.length; _i++) {
                        movie = moviesMongo_1[_i];
                        protoMovie = (0, createMovieProtobuf_1.createMovieProtobuf)(movie);
                        protoResponse.addMovies(protoMovie);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    protoResponse.setMoviesList([]);
                    return [3 /*break*/, 5];
                case 4:
                    call.write(protoResponse);
                    call.end();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function myCreateMovie(call, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var protoResponse, movie, data, jsonMovie, created, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    protoResponse = new movies_pb_1.Response();
                    movie = call.request.getMovie();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    data = call.request.toObject();
                    validation_1.requestCreateValidation.validateSync(data);
                    jsonMovie = movie === null || movie === void 0 ? void 0 : movie.toObject();
                    created = null;
                    if (!jsonMovie) return [3 /*break*/, 3];
                    return [4 /*yield*/, collections.insertOne({
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
                case 2:
                    created = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!created) {
                        protoResponse.setMessage("Erro na tentativa de cria\u00E7\u00E3o do filme");
                        protoResponse.setSucess(false);
                    }
                    else {
                        protoResponse.setMessage("Filme criado com sucesso");
                        protoResponse.setSucess(true);
                        if (movie) {
                            movie.setId(String(created.insertedId));
                            protoResponse.addMovies(movie);
                        }
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_5 = _a.sent();
                    if (error_5 instanceof yup_1.ValidationError) {
                        protoResponse.setMessage(error_5.message);
                    }
                    else {
                        protoResponse.setMessage("Erro na tentativa de cria\u00E7\u00E3o do filme");
                    }
                    protoResponse.setSucess(false);
                    return [3 /*break*/, 6];
                case 5:
                    callback(null, protoResponse);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function myGetMoviesByGenre(call) {
    return __awaiter(this, void 0, void 0, function () {
        var data, query, response, moviesMongo, _i, moviesMongo_2, item, protoMovie, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = call.request.getData();
                    query = { genres: { $elemMatch: { $eq: data } } };
                    response = new movies_pb_1.Response();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    validation_1.requestGetValidation.validateSync(call.request.toObject());
                    return [4 /*yield*/, collections.find(query).toArray()];
                case 2:
                    moviesMongo = _a.sent();
                    for (_i = 0, moviesMongo_2 = moviesMongo; _i < moviesMongo_2.length; _i++) {
                        item = moviesMongo_2[_i];
                        protoMovie = (0, createMovieProtobuf_1.createMovieProtobuf)(item);
                        response.addMovies(protoMovie);
                    }
                    if (moviesMongo.length === 0) {
                        response.setMessage("Nenhum filme encontrado com o g\u00EAnero ".concat(data));
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_6 = _a.sent();
                    if (error_6 instanceof yup_1.ValidationError) {
                        response.setMessage(error_6.message);
                    }
                    else {
                        response.setMessage("Erro durante a busca pelo filme no banco de dados.");
                    }
                    response.setSucess(false);
                    return [3 /*break*/, 5];
                case 4:
                    call.write(response);
                    call.end();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function myGetMoviesByActor(call) {
    return __awaiter(this, void 0, void 0, function () {
        var data, query, response, moviesMongo, _i, moviesMongo_3, item, protoMovie, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = call.request.getData();
                    query = { cast: { $elemMatch: { $eq: data } } };
                    response = new movies_pb_1.Response();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    validation_1.requestGetValidation.validateSync(call.request.toObject());
                    return [4 /*yield*/, collections.find(query).toArray()];
                case 2:
                    moviesMongo = _a.sent();
                    for (_i = 0, moviesMongo_3 = moviesMongo; _i < moviesMongo_3.length; _i++) {
                        item = moviesMongo_3[_i];
                        protoMovie = (0, createMovieProtobuf_1.createMovieProtobuf)(item);
                        response.addMovies(protoMovie);
                    }
                    if (moviesMongo.length === 0) {
                        response.setMessage("Nenhum filme encontrado com o ator ".concat(data));
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_7 = _a.sent();
                    if (error_7 instanceof yup_1.ValidationError) {
                        response.setMessage(error_7.message);
                    }
                    else {
                        response.setMessage("Erro durante a busca pelo filme no banco de dados.");
                    }
                    response.setSucess(false);
                    return [3 /*break*/, 5];
                case 4:
                    call.write(response);
                    call.end();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function myUpdateMovie(call, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var protoResponse, idMovie, movie, jsonMovie, idObject, response, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    protoResponse = new movies_pb_1.Response();
                    idMovie = call.request.getData();
                    movie = call.request.getMovie();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    validation_1.requestUpdateValidation.validateSync(call.request.toObject());
                    jsonMovie = movie === null || movie === void 0 ? void 0 : movie.toObject();
                    idObject = new mongodb_1.ObjectId(idMovie);
                    response = null;
                    if (!jsonMovie) return [3 /*break*/, 3];
                    return [4 /*yield*/, collections.updateOne({ _id: idObject }, {
                            $set: {
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
                            },
                        })];
                case 2:
                    response = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!response) {
                        protoResponse.setMessage("Erro na tentativa de atualiza\u00E7\u00E3o do filme com o id ".concat(idObject));
                        protoResponse.setSucess(false);
                    }
                    else {
                        protoResponse.setMessage("Filme atualizado com sucesso");
                        protoResponse.setSucess(true);
                        protoResponse.addMovies(movie);
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_8 = _a.sent();
                    if (error_8 instanceof yup_1.ValidationError) {
                        protoResponse.setMessage(error_8.message);
                    }
                    else {
                        protoResponse.setMessage("Erro na tentativa de atualiza\u00E7\u00E3o do filme com o id ".concat(idMovie));
                    }
                    protoResponse.setSucess(false);
                    protoResponse.setMoviesList([]);
                    return [3 /*break*/, 6];
                case 5:
                    callback(null, protoResponse);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
connectMongo().then(function () {
    var maxMessageSize = 1024 * 1024 * 1024;
    var serverOptions = {
        "grpc.max_message_length": maxMessageSize,
        "grpc.max_receive_message_length": maxMessageSize,
        "grpc.max_send_message_length": maxMessageSize,
    };
    var server = new grpc_1.default.Server(serverOptions);
    server.addService(movies_grpc_pb_1.MongoMoviesService, {
        getMoviesById: myGetMovieById,
        createMovie: myCreateMovie,
        deleteMovie: myDeleteMovie,
        updateMovie: myUpdateMovie,
        getAllMovies: myGetAllMovies,
        getMoviesByActor: myGetMoviesByActor,
        getMoviesByGenre: myGetMoviesByGenre, //ok
    });
    server.bind("0.0.0.0:50051", grpc_1.default.ServerCredentials.createInsecure());
    server.start();
    console.log("Servidor iniciado em 0.0.0.0:50051");
});
