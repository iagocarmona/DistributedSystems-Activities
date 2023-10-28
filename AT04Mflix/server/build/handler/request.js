"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketRequest = void 0;
var movies_pb_1 = require("../generated/src/proto/movies_pb");
var enums_1 = require("../utils/enums");
var validation_1 = require("../validation");
var movies_1 = require("../services/movies");
var collection;
var handleSocketRequest = function (socket, req) { return __awaiter(void 0, void 0, void 0, function () {
    var protoResponse, id, movie, data, response, _a, createdMovie, cast, genre, responseBytes, chunkSize, offset, sizeOfResponse, amountOfChunks, i, byteArray, endOfStreamMessage, error_1, responseBytes, chunkSize, offset, chunk;
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
                    case enums_1.OP.CREATE: return [3 /*break*/, 2];
                    case enums_1.OP.FIND_BY_ID: return [3 /*break*/, 7];
                    case enums_1.OP.UPDATE: return [3 /*break*/, 9];
                    case enums_1.OP.DELETE: return [3 /*break*/, 12];
                    case enums_1.OP.FIND_BY_ACTOR: return [3 /*break*/, 14];
                    case enums_1.OP.FIND_BY_CATEGORY: return [3 /*break*/, 16];
                }
                return [3 /*break*/, 18];
            case 2:
                validation_1.requestCreateValidation.validateSync(req.toObject());
                if (!movie) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, movies_1.createMovie)(collection, movie)];
            case 3:
                response = _b.sent();
                if (!!response) return [3 /*break*/, 4];
                protoResponse.setMessage("Erro na tentativa de cria\u00E7\u00E3o do filme");
                protoResponse.setSucess(false);
                return [3 /*break*/, 6];
            case 4:
                protoResponse.setMessage("Filme criado com sucesso");
                protoResponse.setSucess(true);
                return [4 /*yield*/, (0, movies_1.getMovieById)(collection, response)];
            case 5:
                createdMovie = _b.sent();
                if (createdMovie)
                    protoResponse.addMovies(createdMovie);
                _b.label = 6;
            case 6: return [3 /*break*/, 19];
            case 7: return [4 /*yield*/, (0, movies_1.getMovieById)(collection, data)];
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
                return [4 /*yield*/, (0, movies_1.updateMovie)(collection, data, movie)];
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
            case 12: return [4 /*yield*/, (0, movies_1.deleteMovie)(collection, data)];
            case 13:
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
                return [4 /*yield*/, (0, movies_1.getMoviesByActor)(collection, cast)];
            case 15:
                response = _b.sent();
                response.forEach(function (movie) { return protoResponse.addMovies(movie); });
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
                return [4 /*yield*/, (0, movies_1.getMoviesByGenre)(collection, genre)];
            case 17:
                response = _b.sent();
                response.forEach(function (movie) { return protoResponse.addMovies(movie); });
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
                console.log("mando end of stream");
                socket.write(endOfStreamMessage);
                return [3 /*break*/, 21];
            case 20:
                error_1 = _b.sent();
                console.log("error[handleSocketRequest]:", error_1);
                protoResponse.setMessage(JSON.stringify(error_1));
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
}); };
exports.handleSocketRequest = handleSocketRequest;
