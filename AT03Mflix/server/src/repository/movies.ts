import { Collection, ObjectId } from "mongodb";
import { createMovieProtobuf } from "../utils/createMovieProtobuf";
import { Cast, Genre, Movie } from "../generated/src/proto/movies_pb";

/**
 * Busca um filme pelo id
 * @param collections
 * @param id
 * @returns
 */
export const getMovieById = async (collections: Collection, id: string) => {
    try {
        // Monta a query para buscar o filme pelo id
        const query = { _id: new ObjectId(id) };

        // Busca o filme no banco
        const mongoMovie = await collections.findOne(query);

        // Se não encontrar retorna null
        if (!mongoMovie) return null;

        // Cria o movie protobuf para a resposta
        const protoMovie = createMovieProtobuf(mongoMovie);

        // Retorna o movie protobuf
        return protoMovie;
    } catch (error) {
        return null;
    }
};

/**
 * Deleta um filme
 * @param collections
 * @param id
 * @returns
 */
export const deleteMovie = async (
    collections: Collection,
    id: string
): Promise<boolean> => {
    try {
        // Monta a query para deletar o filme pelo id
        const query = { _id: new ObjectId(id) };

        // Deleta o filme no banco
        const result = await collections.deleteOne(query);

        // Se não encontrar retorna null
        if (!result?.deletedCount) {
            return false;
        }

        // Retorna o movie protobuf
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Busca todos os filmes
 * @param collection
 * @returns
 */
export const getAllMovies = async (collection: Collection) => {
    try {
        // Busca todos os filmes no banco
        const moviesMongo = await collection.find({}).toArray();

        // Cria o array de movies protobuf para a resposta
        const protoMovies = moviesMongo.map((item) =>
            createMovieProtobuf(item)
        );

        // Retorna o array de movies protobuf
        return protoMovies;
    } catch (error) {
        return [];
    }
};

/**
 * Cria um filme
 * @param collection
 * @param movie
 * @returns
 */
export const createMovie = async (
    collection: Collection,
    movie: Movie
): Promise<string | null> => {
    try {
        // Converte o movie protobuf para json
        const jsonMovie = movie.toObject();

        // Insere o filme no banco
        const created = await collection.insertOne({
            plot: jsonMovie.plot,
            genres: jsonMovie.genresList.map((obj) => obj.name),
            runtime: jsonMovie.runtime,
            cast: jsonMovie.castList.map((obj) => obj.actor),
            num_mflix_comments: jsonMovie.numMflixComments,
            title: jsonMovie.title,
            fullplot: jsonMovie.fullplot,
            countries: jsonMovie.countriesList.map((obj) => obj.name),
            released: jsonMovie.released,
            directors: jsonMovie.directorsList.map((obj) => obj.name),
            rated: jsonMovie.rated,
            lastupdate: jsonMovie.lastupdated,
            year: jsonMovie.year,
            type: jsonMovie.type,
            writers: jsonMovie.writersList.map((obj) => obj.name),
            languages: jsonMovie.languagesList.map((obj) => obj.name),
        });

        // Se não conseguir inserir retorna null
        if (!created) return null;

        // Retorna o id do filme inserido
        return String(created.insertedId);
    } catch (error) {
        return null;
    }
};

/**
 * Busca filmes por genero
 * @param collection
 * @param genre
 * @returns
 */
export const getMoviesByGenre = async (
    collection: Collection,
    genre: Genre
) => {
    try {
        // Converte o genre protobuf para json
        const value = genre.getName();

        // Monta a query de buscar filmes que contem o genero repassado
        const query = { genres: { $elemMatch: { $eq: value } } };

        // Busca os filmes no banco
        const moviesMongo = await collection.find(query).toArray();

        // Cria o array de movies protobuf para a resposta
        const protoMovies = moviesMongo.map((item) =>
            createMovieProtobuf(item)
        );

        // Retorna o array de movies protobuf
        return protoMovies;
    } catch (error) {
        return [];
    }
};

/**
 * Busca filmes por ator
 * @param collection
 * @param cast
 * @returns
 */
export const getMoviesByActor = async (collection: Collection, cast: Cast) => {
    try {
        // Converte o cast protobuf para json
        const actor = cast.getActor();

        // Monta a query de buscar filmes que contem o ator repassado
        const query = { cast: { $elemMatch: { $eq: actor } } };

        // Busca os filmes no banco
        const moviesMongo = await collection.find(query).toArray();

        // Cria o array de movies protobuf para a resposta
        const protoMovies = moviesMongo.map((item) =>
            createMovieProtobuf(item)
        );

        // Retorna o array de movies protobuf
        return protoMovies;
    } catch (error) {
        return [];
    }
};

/**
 * Atualiza um filme
 * @param collection
 * @param id
 * @param movie
 * @returns
 */
export const updateMovie = async (
    collection: Collection,
    id: string,
    movie: Movie
) => {
    try {
        // Converte o movie protobuf para json
        const jsonMovie = movie.toObject();

        // Converte o id para ObjectId
        const idObject = new ObjectId(id);

        // Realiza a operação de update
        const { acknowledged } = await collection.updateOne(
            { _id: idObject },
            {
                $set: {
                    plot: jsonMovie.plot,
                    genres: jsonMovie.genresList.map((obj) => obj.name),
                    runtime: jsonMovie.runtime,
                    cast: jsonMovie.castList.map((obj) => obj.actor),
                    num_mflix_comments: jsonMovie.numMflixComments,
                    title: jsonMovie.title,
                    fullplot: jsonMovie.fullplot,
                    countries: jsonMovie.countriesList.map((obj) => obj.name),
                    released: jsonMovie.released,
                    directors: jsonMovie.directorsList.map((obj) => obj.name),
                    rated: jsonMovie.rated,
                    lastupdate: jsonMovie.lastupdated,
                    year: jsonMovie.year,
                    type: jsonMovie.type,
                    writers: jsonMovie.writersList.map((obj) => obj.name),
                    languages: jsonMovie.languagesList.map((obj) => obj.name),
                },
            }
        );

        // Retorna o resultado da operação
        return acknowledged;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

