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
exports.updateMovie = exports.getMoviesByActor = exports.getMoviesByGenre = exports.createMovie = exports.getAllMovies = exports.deleteMovie = exports.getMovieById = void 0;
var mongodb_1 = require("mongodb");
var createMovieProtobuf_1 = require("../utils/createMovieProtobuf");
/**
 * Busca um filme pelo id
 * @param collections
 * @param id
 * @returns
 */
var getMovieById = function (collections, id) { return __awaiter(void 0, void 0, void 0, function () {
    var query, mongoMovie, protoMovie, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = { _id: new mongodb_1.ObjectId(id) };
                return [4 /*yield*/, collections.findOne(query)];
            case 1:
                mongoMovie = _a.sent();
                // Se não encontrar retorna null
                if (!mongoMovie)
                    return [2 /*return*/, null];
                protoMovie = (0, createMovieProtobuf_1.createMovieProtobuf)(mongoMovie);
                // Retorna o movie protobuf
                return [2 /*return*/, protoMovie];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMovieById = getMovieById;
/**
 * Deleta um filme
 * @param collections
 * @param id
 * @returns
 */
var deleteMovie = function (collections, id) { return __awaiter(void 0, void 0, void 0, function () {
    var query, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = { _id: new mongodb_1.ObjectId(id) };
                return [4 /*yield*/, collections.deleteOne(query)];
            case 1:
                result = _a.sent();
                // Se não encontrar retorna null
                if (!(result === null || result === void 0 ? void 0 : result.deletedCount)) {
                    return [2 /*return*/, false];
                }
                // Retorna o movie protobuf
                return [2 /*return*/, true];
            case 2:
                error_2 = _a.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteMovie = deleteMovie;
/**
 * Busca todos os filmes
 * @param collection
 * @returns
 */
var getAllMovies = function (collection) { return __awaiter(void 0, void 0, void 0, function () {
    var moviesMongo, protoMovies, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, collection.find({}).toArray()];
            case 1:
                moviesMongo = _a.sent();
                protoMovies = moviesMongo.map(function (item) {
                    return (0, createMovieProtobuf_1.createMovieProtobuf)(item);
                });
                // Retorna o array de movies protobuf
                return [2 /*return*/, protoMovies];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllMovies = getAllMovies;
/**
 * Cria um filme
 * @param collection
 * @param movie
 * @returns
 */
var createMovie = function (collection, movie) { return __awaiter(void 0, void 0, void 0, function () {
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
                // Se não conseguir inserir retorna null
                if (!created)
                    return [2 /*return*/, null];
                // Retorna o id do filme inserido
                return [2 /*return*/, String(created.insertedId)];
            case 2:
                error_4 = _a.sent();
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createMovie = createMovie;
/**
 * Busca filmes por genero
 * @param collection
 * @param genre
 * @returns
 */
var getMoviesByGenre = function (collection, genre) { return __awaiter(void 0, void 0, void 0, function () {
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
                protoMovies = moviesMongo.map(function (item) {
                    return (0, createMovieProtobuf_1.createMovieProtobuf)(item);
                });
                // Retorna o array de movies protobuf
                return [2 /*return*/, protoMovies];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMoviesByGenre = getMoviesByGenre;
/**
 * Busca filmes por ator
 * @param collection
 * @param cast
 * @returns
 */
var getMoviesByActor = function (collection, cast) { return __awaiter(void 0, void 0, void 0, function () {
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
                protoMovies = moviesMongo.map(function (item) {
                    return (0, createMovieProtobuf_1.createMovieProtobuf)(item);
                });
                // Retorna o array de movies protobuf
                return [2 /*return*/, protoMovies];
            case 2:
                error_6 = _a.sent();
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMoviesByActor = getMoviesByActor;
/**
 * Atualiza um filme
 * @param collection
 * @param id
 * @param movie
 * @returns
 */
var updateMovie = function (collection, id, movie) { return __awaiter(void 0, void 0, void 0, function () {
    var jsonMovie, idObject, acknowledged, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                jsonMovie = movie.toObject();
                idObject = new mongodb_1.ObjectId(id);
                return [4 /*yield*/, collection.updateOne({ _id: idObject }, {
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
            case 1:
                acknowledged = (_a.sent()).acknowledged;
                // Retorna o resultado da operação
                return [2 /*return*/, acknowledged];
            case 2:
                error_7 = _a.sent();
                console.log(error_7);
                throw error_7;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateMovie = updateMovie;
