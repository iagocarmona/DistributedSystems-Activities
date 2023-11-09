import {
    Cast,
    Country,
    Director,
    Genre,
    Language,
    Movie,
    Writer,
} from "../generated/movies_pb";

export function createFakeMovieInBytes() {
    const fakeProtoMovie = new Movie();

    const genre = new Genre();
    genre.setName("Genero teste 1");

    const cast = new Cast();
    cast.setActor("James Cameron");

    const country = new Country();
    country.setName("country");

    const director = new Director();
    director.setName("James Cameron Director");

    const language = new Language();
    language.setName("Portugues");

    const writer = new Writer();
    writer.setName("Edson Arantes do Nascimento");

    fakeProtoMovie.setPlot("plot");
    fakeProtoMovie.setGenresList([genre]);
    fakeProtoMovie.setRuntime(1);
    fakeProtoMovie.setCastList([cast]);
    fakeProtoMovie.setNumMflixComments(20);
    fakeProtoMovie.setTitle("Titulo");
    fakeProtoMovie.setFullplot("fullplot");
    fakeProtoMovie.setCountriesList([country]);
    fakeProtoMovie.setReleased("1893-05-09T00:00:00.000Z");
    fakeProtoMovie.setDirectorsList([director]);
    fakeProtoMovie.setRated("UNRATED");
    fakeProtoMovie.setLastupdated("2015-08-26 00:03:50.133000000");
    fakeProtoMovie.setYear("2023");
    fakeProtoMovie.setType("movie");
    fakeProtoMovie.setLanguagesList([language]);
    fakeProtoMovie.setWritersList([writer]);

    return fakeProtoMovie;
}
