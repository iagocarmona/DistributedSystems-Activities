import * as dotenv from "dotenv";
import grpc from "grpc";
import { ServerApiVersion, MongoClient, Collection, ObjectId } from "mongodb";
import {
    Request,
    Response,
    MongoMoviesService,
} from "./generated/movies_pb";
import { createMovieProtobuf } from "./utils/createMovieProtobuf";
import {
    requestCreateValidation,
    requestUpdateValidation,
    requestGetValidation,
    requestDeleteValidation,
} from "./validation";
import { ValidationError } from "yup";

dotenv.config();

// Configuração do MongoDB
const uri = process.env.MONGO_URI || "";
const database = process.env.DB_NAME || "sample_mflix";
const table = process.env.COLLECTION_NAME || "movies";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db;
let collections: Collection;

// Conectar ao MongoDB
async function connectMongo() {
    try {
        await client.connect();
        db = client.db(database);
        collections = db.collection(table);
    } catch (error) {
        console.log("error mongo", error);
    }
}

// Função para buscar filme por ID
async function getMovieById(call, callback) {
    const protoResponse = new Response();

    try {
        const data = call.request.getData();
        const request = call.request.toObject();
        requestGetValidation.validateSync(request);

        const query = { _id: new ObjectId(data) };
        const mongoMovie = await collections.findOne(query);

        if (!mongoMovie) {
            throw new Error(`Filme não encontrado com o ID ${data}`);
        }

        const protoMovie = createMovieProtobuf(mongoMovie);
        protoResponse.setMessage(`Filme encontrado com sucesso`);
        protoResponse.setSucess(true);
        protoResponse.addMovies(protoMovie);
    } catch (error) {
        if (error instanceof ValidationError) {
            protoResponse.setMessage(error.message);
            protoResponse.setSucess(false);
        } else {
            protoResponse.setMessage(`Erro na busca do filme com o ID ${data}`);
            protoResponse.setSucess(false);
        }
    } finally {
        callback(null, protoResponse);
    }
}

// Função para deletar filme por ID
async function deleteMovie(call, callback) {
    const protoResponse = new Response();
    const data = call.request.getData();

    try {
        const request = call.request.toObject();
        requestDeleteValidation.validateSync(request);

        const query = { _id: new ObjectId(data) };
        const result = await collections.deleteOne(query);

        if (!result || !result.deletedCount) throw new Error();

        protoResponse.setMessage(`Filme deletado com sucesso`);
        protoResponse.setSucess(true);
    } catch (error) {
        if (error instanceof ValidationError) {
            protoResponse.setMessage(error.message);
        } else {
            protoResponse.setMessage(
                `Erro na tentativa de deleção do filme com o ID ${data}`
            );
        }
        protoResponse.setSucess(false);
    } finally {
        callback(null, protoResponse);
    }
}

// Função para buscar todos os filmes
async function getAllMovies(call) {
    const protoResponse = new Response();
    try {
        const moviesMongo = await collections.find({}).toArray();

        for (const movie of moviesMongo) {
            const protoMovie = createMovieProtobuf(movie);
            protoResponse.addMovies(protoMovie);
        }
    } catch (error) {
        protoResponse.setMoviesList([]);
    } finally {
        call.write(protoResponse);
        call.end();
    }
}

// Função para criar um novo filme
async function createMovie(call, callback) {
    const protoResponse = new Response();
    const movie = call.request.getMovie();

    try {
        const data = call.request.toObject();
        requestCreateValidation.validateSync(data);

        const jsonMovie = movie?.toObject();
        let created = null;

        if (jsonMovie) {
            created = await collections.insertOne({
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
        }

        if (!created) {
            protoResponse.setMessage(`Erro na tentativa de criação do filme`);
            protoResponse.setSucess(false);
        } else {
            protoResponse.setMessage(`Filme criado com sucesso`);
            protoResponse.setSucess(true);
            if (movie) {
                movie.setId(String(created.insertedId));
                protoResponse.addMovies(movie);
            }
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            protoResponse.setMessage(error.message);
        } else {
            protoResponse.setMessage(`Erro na tentativa de criação do filme`);
        }

        protoResponse.setSucess(false);
    } finally {
        callback(null, protoResponse);
    }
}

// Função para buscar filmes por gênero
async function getMoviesByGenre(call) {
    const data = call.request.getData();
    const query = { genres: { $elemMatch: { $eq: data } } };
    const response = new Response();

    try {
        requestGetValidation.validateSync(call.request.toObject());

        const moviesMongo = await collections.find(query).toArray();

        for (const item of moviesMongo) {
            const protoMovie = createMovieProtobuf(item);
            response.addMovies(protoMovie);
        }

        if (moviesMongo.length === 0) {
            response.setMessage(`Nenhum filme encontrado com o gênero ${data}`);
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            response.setMessage(error.message);
        } else {
            response.setMessage(
                `Erro durante a busca pelo filme no banco de dados.`
            );
        }
        response.setSucess(false);
    } finally {
        call.write(response);
        call.end();
    }
}

// Função para buscar filmes por ator
async function getMoviesByActor(call) {
    const data = call.request.getData();
    const query = { cast: { $elemMatch: { $eq: data } } };

    const response = new Response();
    try {
        requestGetValidation.validateSync(call.request.toObject());

        const moviesMongo = await collections.find(query).toArray();

        for (const item of moviesMongo) {
            const protoMovie = createMovieProtobuf(item);
            response.addMovies(protoMovie);
        }

        if (moviesMongo.length === 0) {
            response.setMessage(`Nenhum filme encontrado com o ator ${data}`);
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            response.setMessage(error.message);
        } else {
            response.setMessage(
                `Erro durante a busca pelo filme no banco de dados.`
            );
        }

        response.setSucess(false);
    } finally {
        call.write(response);
        call.end();
    }
}

// Iniciar o servidor gRPC
connectMongo().then(() => {
    const maxMessageSize = 1024 * 1024 * 1024;
    const serverOptions = {
        "grpc.max_message_length": maxMessageSize,
        "grpc.max_receive_message_length": maxMessageSize,
        "grpc.max_send_message_length": maxMessageSize,
    };

    const server = new grpc.Server(serverOptions);
    server.addService(MongoMoviesService, {
        getMoviesById: getMovieById,
        createMovie: createMovie,
        deleteMovie: deleteMovie,
        updateMovie: myUpdateMovie,
        getAllMovies: getAllMovies,
        getMoviesByActor: getMoviesByActor,
        getMoviesByGenre: getMoviesByGenre,
    });

    server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
    server.start();
    console.log("Servidor iniciado em 0.0.0.0:50051");
});
