import { Document, WithId } from "mongodb";
import {
    Cast,
    Country,
    Director,
    Genre,
    Language,
    Movie,
    Writer,
} from "../generated/movies_pb";

export function createMovieProtobuf(movie: WithId<Document>): Movie {
    try {
        const protoMovie = new Movie();

        const protoGenres = movie.genres?.map((value: string) => {
            const genre = new Genre();
            genre.setName(value);
            return genre;
        });

        const protoCasts = movie.cast?.map((value: string) => {
            const cast = new Cast();
            cast.setActor(value);
            return cast;
        });

        const protoLanguages = movie.languages?.map((value: string) => {
            const language = new Language();
            language.setName(value);
            return language;
        });

        const protoDirectors = movie.directors?.map((value: string) => {
            const director = new Director();
            director.setName(value);
            return director;
        });

        const protoWriters = movie.writers?.map((value: string) => {
            const writer = new Writer();
            writer.setName(value);
            return writer;
        });

        const protoCountries = movie.countries?.map((value: string) => {
            const contry = new Country();
            contry.setName(value);
            return contry;
        });

        protoMovie.setId(String(movie._id));
        if (movie?.plot) protoMovie.setPlot(movie.plot);
        if (protoGenres) protoMovie.setGenresList(protoGenres);
        if (movie?.runtime) protoMovie.setRuntime(movie.runtime);
        if (protoCasts) protoMovie.setCastList(protoCasts);
        if (movie?.numMFlixComments)
            protoMovie.setNumMflixComments(movie.numMFlixComments);
        if (movie?.poster) protoMovie.setPoster(movie.poster);
        if (movie?.title) protoMovie.setTitle(movie.title);
        if (movie?.fullplot) protoMovie.setFullplot(movie.fullplot);
        if (protoLanguages) protoMovie.setLanguagesList(protoLanguages);
        if (movie?.released) protoMovie.setReleased(movie.released);
        if (protoDirectors) protoMovie.setDirectorsList(protoDirectors);
        if (protoWriters) protoMovie.setWritersList(protoWriters);
        if (movie?.lastupdated) protoMovie.setLastupdated(movie.lastupdated);
        if (movie?.year) protoMovie.setYear(movie.year);
        if (protoCountries) protoMovie.setCountriesList(protoCountries);
        if (movie?.type) protoMovie.setType(movie.type);

        return protoMovie;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
