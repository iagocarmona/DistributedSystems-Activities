"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMovieProtobuf = void 0;
var movies_pb_1 = require("../generated/src/proto/movies_pb");
function createMovieProtobuf(movie) {
    var _a, _b, _c, _d, _e, _f;
    try {
        var protoMovie = new movies_pb_1.Movie();
        var protoGenres = (_a = movie.genres) === null || _a === void 0 ? void 0 : _a.map(function (value) {
            var genre = new movies_pb_1.Genre();
            genre.setName(value);
            return genre;
        });
        var protoCasts = (_b = movie.cast) === null || _b === void 0 ? void 0 : _b.map(function (value) {
            var cast = new movies_pb_1.Cast();
            cast.setActor(value);
            return cast;
        });
        var protoLanguages = (_c = movie.languages) === null || _c === void 0 ? void 0 : _c.map(function (value) {
            var language = new movies_pb_1.Language();
            language.setName(value);
            return language;
        });
        var protoDirectors = (_d = movie.directors) === null || _d === void 0 ? void 0 : _d.map(function (value) {
            var director = new movies_pb_1.Director();
            director.setName(value);
            return director;
        });
        var protoWriters = (_e = movie.writers) === null || _e === void 0 ? void 0 : _e.map(function (value) {
            var writer = new movies_pb_1.Writer();
            writer.setName(value);
            return writer;
        });
        var protoCountries = (_f = movie.countries) === null || _f === void 0 ? void 0 : _f.map(function (value) {
            var contry = new movies_pb_1.Country();
            contry.setName(value);
            return contry;
        });
        protoMovie.setId(String(movie._id));
        if (movie === null || movie === void 0 ? void 0 : movie.plot)
            protoMovie.setPlot(movie.plot);
        if (protoGenres)
            protoMovie.setGenresList(protoGenres);
        if (movie === null || movie === void 0 ? void 0 : movie.runtime)
            protoMovie.setRuntime(movie.runtime);
        if (protoCasts)
            protoMovie.setCastList(protoCasts);
        if (movie === null || movie === void 0 ? void 0 : movie.numMFlixComments)
            protoMovie.setNumMflixComments(movie.numMFlixComments);
        if (movie === null || movie === void 0 ? void 0 : movie.poster)
            protoMovie.setPoster(movie.poster);
        if (movie === null || movie === void 0 ? void 0 : movie.title)
            protoMovie.setTitle(movie.title);
        if (movie === null || movie === void 0 ? void 0 : movie.fullplot)
            protoMovie.setFullplot(movie.fullplot);
        if (protoLanguages)
            protoMovie.setLanguagesList(protoLanguages);
        if (movie === null || movie === void 0 ? void 0 : movie.released)
            protoMovie.setReleased(movie.released);
        if (protoDirectors)
            protoMovie.setDirectorsList(protoDirectors);
        if (protoWriters)
            protoMovie.setWritersList(protoWriters);
        if (movie === null || movie === void 0 ? void 0 : movie.lastupdated)
            protoMovie.setLastupdated(movie.lastupdated);
        if (movie === null || movie === void 0 ? void 0 : movie.year)
            protoMovie.setYear(movie.year);
        if (protoCountries)
            protoMovie.setCountriesList(protoCountries);
        if (movie === null || movie === void 0 ? void 0 : movie.type)
            protoMovie.setType(movie.type);
        if (movie === null || movie === void 0 ? void 0 : movie.rated)
            protoMovie.setRated(movie.rated);
        return protoMovie;
    }
    catch (error) {
        throw error;
    }
}
exports.createMovieProtobuf = createMovieProtobuf;
