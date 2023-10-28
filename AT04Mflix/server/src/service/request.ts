import {
    Cast,
    Genre,
    Movie,
    Request,
    Response,
} from "../generated/src/proto/movies_pb";

import { Socket } from "net";
import { requestCreateValidation } from "../validation";
import { Collection } from "mongodb";

// Importa as funções do repositório
import {
    createMovie,
    deleteMovie,
    getMovieById,
    getMoviesByActor,
    getMoviesByGenre,
    updateMovie,
} from "../repository/movies";

// Identificadores das operações
const OP = {
    CREATE: 1,
    FIND_BY_ID: 2,
    UPDATE: 3,
    DELETE: 4,
    FIND_BY_ACTOR: 5,
    FIND_BY_CATEGORY: 6,
};

/**
 * Trata as requisições recebidas pelo servidor socket
 * @param socket
 * @param req
 * @param collection
 */
export const handleSocketRequest = async (
    socket: Socket,
    req: Request,
    collection: Collection
) => {
    // Cria a resposta
    const protoResponse = new Response();

    // Tenta executar a requisição
    try {
        // Extrai os dados da requisição
        const id: number = req.getRequestId();
        const movie: Movie | undefined = req.getMovie();
        const data: string = req.getData();

        // Cria a variável de resposta
        let response;
        protoResponse.setResponseId(id);

        // Com base no id da requisição encaminha para a função correta
        switch (id) {
            case OP.CREATE:
                // Valida a requisição
                requestCreateValidation.validateSync(req.toObject());

                // Cria o filme
                if (movie) {
                    // Cria o filme no banco
                    response = await createMovie(collection, movie);

                    // Se não encontrar retorna null se não retorna o filme criado
                    if (!response) {
                        protoResponse.setMessage(
                            `Erro na tentativa de criação do filme`
                        );
                        protoResponse.setSucess(false);
                    } else {
                        protoResponse.setMessage(`Filme criado com sucesso`);
                        protoResponse.setSucess(true);
                        const createdMovie = await getMovieById(
                            collection,
                            response
                        );
                        if (createdMovie) protoResponse.addMovies(createdMovie);
                    }
                }

                break;
            case OP.FIND_BY_ID:
                // Busca o filme pelo id
                response = await getMovieById(collection, data);

                // Se não encontrar retorna null se não retorna o filme
                if (!response) {
                    protoResponse.setMessage(
                        `Erro na busca do filme com o id ${data}`
                    );
                    protoResponse.setSucess(false);
                } else {
                    protoResponse.setMessage(`Filme encontrado com sucesso`);
                    protoResponse.setSucess(true);
                    protoResponse.addMovies(response);
                }

                break;
            case OP.UPDATE:
                if (movie) {
                    // Atualiza o filme no banco
                    response = await updateMovie(collection, data, movie);

                    // Se não encontrar retorna null se não retorna o filme atualizado
                    if (!response) {
                        protoResponse.setMessage(
                            `Erro na tentativa de atualização do filme com o id ${movie.getId()}`
                        );
                        protoResponse.setSucess(false);
                    } else {
                        protoResponse.setMessage(
                            `Filme atualizado com sucesso`
                        );
                        protoResponse.setSucess(true);
                        protoResponse.addMovies(movie);
                    }
                }
                break;
            case OP.DELETE:
                // Deleta o filme no banco
                response = await deleteMovie(collection, data);

                // Se não encontrar retorna null se não retorna o filme deletado
                if (!response) {
                    protoResponse.setMessage(
                        `Erro na tentativa de deleção do filme com o id ${data}`
                    );
                    protoResponse.setSucess(false);
                } else {
                    protoResponse.setMessage(`Filme deletado com sucesso`);
                    protoResponse.setSucess(true);
                }

                break;
            case OP.FIND_BY_ACTOR:
                // Busca o filme pelo ator
                const cast = new Cast();
                cast.setActor(data);

                // Busca o filme no banco
                response = await getMoviesByActor(collection, cast);

                // Adiciona os filmes na resposta
                response.forEach((movie) => protoResponse.addMovies(movie));

                // Se não encontrar retorna null se não retorna o filme
                if (!response.length) {
                    protoResponse.setMessage(
                        `Nenhum filme do ator ${data} foi encontrado`
                    );
                    protoResponse.setSucess(false);
                } else {
                    protoResponse.setMessage(`Busca concluída com sucesso`);
                    protoResponse.setSucess(true);
                }

                break;
            case OP.FIND_BY_CATEGORY:
                // Busca o filme pela categoria
                const genre = new Genre();
                genre.setName(data);

                // Busca o filme no banco
                response = await getMoviesByGenre(collection, genre);

                // Adiciona os filmes na resposta
                response.forEach((movie) => protoResponse.addMovies(movie));

                // Se não encontrar retorna null se não retorna o filme
                if (!response.length) {
                    protoResponse.setMessage(
                        `Nenhum filme da categoria ${data} foi encontrado`
                    );
                    protoResponse.setSucess(false);
                } else {
                    protoResponse.setMessage(`Busca concluída com sucesso`);
                    protoResponse.setSucess(true);
                }
                break;
            default:
                protoResponse.setMessage(
                    `Identificador de requisição inválido (${id})`
                );
                protoResponse.setSucess(false);
                break;
        }

        // Envia a resposta
        const responseBytes = protoResponse.serializeBinary();
        const chunkSize = 4096;
        let offset = 0;

        // Envia a resposta em chunks
        const sizeOfResponse = responseBytes.length;
        const amountOfChunks = Number(
            Math.ceil(sizeOfResponse / chunkSize).toFixed(0)
        );
        let i = 0;

        // Envia os chunks
        while (1) {
            // Se o offset for maior que o tamanho da resposta, seta o offset para o tamanho da resposta
            if (offset > sizeOfResponse) {
                offset = sizeOfResponse;
            }

            // Cria o chunk
            const byteArray = new Uint8Array(4096);
            byteArray.set(responseBytes.slice(offset, offset + chunkSize));

            // Envia o chunk
            i += 1;
            console.log(
                'mandou chunk, "i',
                i,
                "offset",
                offset,
                "chunkSize",
                chunkSize,
                " chunk.length",
                byteArray.length
            );

            // Envia o chunk
            socket.write(byteArray);

            // Se o offset for igual ao tamanho da resposta, sai do loop
            if (i === amountOfChunks) {
                break;
            } else {
                offset += chunkSize;
            }
        }

        // Envia o end of stream
        const endOfStreamMessage = "END_OF_STREAM";
        console.log("mando end of stream");

        // Envia o end of stream
        socket.write(endOfStreamMessage);
    } catch (error) {
        console.log("error[handleSocketRequest]:", error);
        protoResponse.setMessage(JSON.stringify(error));
        protoResponse.setSucess(false);

        // Envia a resposta
        const responseBytes = protoResponse.serializeBinary();
        const chunkSize = 4096;

        // Envia a resposta em chunks
        for (
            let offset = 0;
            offset < responseBytes.length;
            offset += chunkSize
        ) {
            const chunk = responseBytes.slice(offset, offset + chunkSize);
            socket.write(chunk);
        }
    }
};

