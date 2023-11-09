import { Collection, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { Request, Response } from "../generated/movies_pb";
import grpc from "grpc";
import {
    requestCreateValidation,
    requestDeleteValidation,
    requestGetValidation,
    requestUpdateValidation,
} from "../validation";
import { createMovieProtobuf } from "../utils/createMovieProtobuf";
import { ValidationError } from "yup";

// SERVIDOR MONGO
const uri = process.env.MONGO_URI ?? "";
const database = process.env.DB_NAME ?? "sample_mflix";
const table = process.env.COLLECTION_NAME ?? "movies";
let db;
let collections: Collection;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

export async function connectMongo() {
    try {
        await client.connect();
        db = client.db(database);
        collections = db.collection(table);
    } catch (error) {
        console.log("error mongo", error);
    }
}

export async function myGetMovieById(
    call: grpc.ServerUnaryCall<Request>,
    callback: grpc.sendUnaryData<Response>
) {
    const protoResponse = new Response();
    const data = call.request.getData();

    try {
        const request = call.request.toObject();
        requestGetValidation.validateSync(request);

        const query = { _id: new ObjectId(data) };
        const mongoMovie = await collections.findOne(query);

        if (!mongoMovie) throw new Error();

        const protoMovie = createMovieProtobuf(mongoMovie);
        protoResponse.setMessage(`Filme encontrado com sucesso`);
        protoResponse.setSucess(true);
        protoResponse.addMovies(protoMovie);
    } catch (error) {
        if (error instanceof ValidationError) {
            protoResponse.setMessage(error.message);
        } else {
            protoResponse.setMessage(`Erro na busca do filme com o id ${data}`);
        }
        protoResponse.setSucess(false);
    } finally {
        callback(null, protoResponse);
    }
}

export async function myDeleteMovie(
    call: grpc.ServerUnaryCall<Request>,
    callback: grpc.sendUnaryData<Response>
) {
    const protoResponse = new Response();
    const data = call.request.getData();

    try {
        const request = call.request.toObject();
        requestDeleteValidation.validateSync(request);

        const query = { _id: new ObjectId(data) };
        const result = await collections.deleteOne(query);

        if (!result?.deletedCount) throw new Error();

        protoResponse.setMessage(`Filme deletado com sucesso`);
        protoResponse.setSucess(true);
    } catch (error) {
        if (error instanceof ValidationError) {
            protoResponse.setMessage(error.message);
        } else {
            protoResponse.setMessage(
                `Erro na tentativa de deleção do filme com o id ${data}`
            );
        }
        protoResponse.setSucess(false);
    } finally {
        callback(null, protoResponse);
    }
}

export async function myGetAllMovies(
    call: grpc.ServerWritableStream<Request, Response>
) {
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

export async function myCreateMovie(
    call: grpc.ServerUnaryCall<Request>,
    callback: grpc.sendUnaryData<Response>
) {
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
                genres: jsonMovie.genresList.map((obj: any) => obj.name),
                runtime: jsonMovie.runtime,
                cast: jsonMovie.castList.map((obj: any) => obj.actor),
                num_mflix_comments: jsonMovie.numMflixComments,
                title: jsonMovie.title,
                fullplot: jsonMovie.fullplot,
                countries: jsonMovie.countriesList.map((obj: any) => obj.name),
                released: jsonMovie.released,
                directors: jsonMovie.directorsList.map((obj: any) => obj.name),
                rated: jsonMovie.rated,
                lastupdate: jsonMovie.lastupdated,
                year: jsonMovie.year,
                type: jsonMovie.type,
                writers: jsonMovie.writersList.map((obj: any) => obj.name),
                languages: jsonMovie.languagesList.map((obj: any) => obj.name),
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

export async function myGetMoviesByGenre(
    call: grpc.ServerWritableStream<Request, Response>
) {
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

export async function myGetMoviesByActor(
    call: grpc.ServerWritableStream<Request, Response>
) {
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

export async function myUpdateMovie(
    call: grpc.ServerUnaryCall<Request>,
    callback: grpc.sendUnaryData<Response>
) {
    const protoResponse = new Response();
    const idMovie = call.request.getData();
    const movie = call.request.getMovie();

    try {
        requestUpdateValidation.validateSync(call.request.toObject());

        const jsonMovie = movie?.toObject();
        const idObject = new ObjectId(idMovie);
        let response = null;

        if (jsonMovie) {
            response = await collections.updateOne(
                { _id: idObject },
                {
                    $set: {
                        plot: jsonMovie.plot,
                        genres: jsonMovie.genresList.map(
                            (obj: any) => obj.name
                        ),
                        runtime: jsonMovie.runtime,
                        cast: jsonMovie.castList.map((obj: any) => obj.actor),
                        num_mflix_comments: jsonMovie.numMflixComments,
                        title: jsonMovie.title,
                        fullplot: jsonMovie.fullplot,
                        countries: jsonMovie.countriesList.map(
                            (obj: any) => obj.name
                        ),
                        released: jsonMovie.released,
                        directors: jsonMovie.directorsList.map(
                            (obj: any) => obj.name
                        ),
                        rated: jsonMovie.rated,
                        lastupdate: jsonMovie.lastupdated,
                        year: jsonMovie.year,
                        type: jsonMovie.type,
                        writers: jsonMovie.writersList.map(
                            (obj: any) => obj.name
                        ),
                        languages: jsonMovie.languagesList.map(
                            (obj: any) => obj.name
                        ),
                    },
                }
            );
        }

        if (!response) {
            protoResponse.setMessage(
                `Erro na tentativa de atualização do filme com o id ${idObject}`
            );
            protoResponse.setSucess(false);
        } else {
            protoResponse.setMessage(`Filme atualizado com sucesso`);
            protoResponse.setSucess(true);
            protoResponse.addMovies(movie);
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            protoResponse.setMessage(error.message);
        } else {
            protoResponse.setMessage(
                `Erro na tentativa de atualização do filme com o id ${idMovie}`
            );
        }

        protoResponse.setSucess(false);
        protoResponse.setMoviesList([]);
    } finally {
        callback(null, protoResponse);
    }
}

