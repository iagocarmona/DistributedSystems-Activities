// GENERATED CODE -- DO NOT EDIT!
'use strict';
var grpc = require('grpc');
var movies_pb = require('./movies_pb.js');
function serialize_mongomovies_Request(arg) {
    if (!(arg instanceof movies_pb.Request)) {
        throw new Error('Expected argument of type mongomovies.Request');
    }
    return Buffer.from(arg.serializeBinary());
}
function deserialize_mongomovies_Request(buffer_arg) {
    return movies_pb.Request.deserializeBinary(new Uint8Array(buffer_arg));
}
function serialize_mongomovies_Response(arg) {
    if (!(arg instanceof movies_pb.Response)) {
        throw new Error('Expected argument of type mongomovies.Response');
    }
    return Buffer.from(arg.serializeBinary());
}
function deserialize_mongomovies_Response(buffer_arg) {
    return movies_pb.Response.deserializeBinary(new Uint8Array(buffer_arg));
}
// serviço
var MongoMoviesService = exports.MongoMoviesService = {
    getMoviesById: {
        path: '/mongomovies.MongoMovies/getMoviesById',
        requestStream: false,
        responseStream: false,
        requestType: movies_pb.Request,
        responseType: movies_pb.Response,
        requestSerialize: serialize_mongomovies_Request,
        requestDeserialize: deserialize_mongomovies_Request,
        responseSerialize: serialize_mongomovies_Response,
        responseDeserialize: deserialize_mongomovies_Response,
    },
    deleteMovie: {
        path: '/mongomovies.MongoMovies/deleteMovie',
        requestStream: false,
        responseStream: false,
        requestType: movies_pb.Request,
        responseType: movies_pb.Response,
        requestSerialize: serialize_mongomovies_Request,
        requestDeserialize: deserialize_mongomovies_Request,
        responseSerialize: serialize_mongomovies_Response,
        responseDeserialize: deserialize_mongomovies_Response,
    },
    getAllMovies: {
        path: '/mongomovies.MongoMovies/getAllMovies',
        requestStream: false,
        responseStream: true,
        requestType: movies_pb.Request,
        responseType: movies_pb.Response,
        requestSerialize: serialize_mongomovies_Request,
        requestDeserialize: deserialize_mongomovies_Request,
        responseSerialize: serialize_mongomovies_Response,
        responseDeserialize: deserialize_mongomovies_Response,
    },
    createMovie: {
        path: '/mongomovies.MongoMovies/createMovie',
        requestStream: false,
        responseStream: false,
        requestType: movies_pb.Request,
        responseType: movies_pb.Response,
        requestSerialize: serialize_mongomovies_Request,
        requestDeserialize: deserialize_mongomovies_Request,
        responseSerialize: serialize_mongomovies_Response,
        responseDeserialize: deserialize_mongomovies_Response,
    },
    updateMovie: {
        path: '/mongomovies.MongoMovies/updateMovie',
        requestStream: false,
        responseStream: false,
        requestType: movies_pb.Request,
        responseType: movies_pb.Response,
        requestSerialize: serialize_mongomovies_Request,
        requestDeserialize: deserialize_mongomovies_Request,
        responseSerialize: serialize_mongomovies_Response,
        responseDeserialize: deserialize_mongomovies_Response,
    },
    getMoviesByGenre: {
        path: '/mongomovies.MongoMovies/getMoviesByGenre',
        requestStream: false,
        responseStream: true,
        requestType: movies_pb.Request,
        responseType: movies_pb.Response,
        requestSerialize: serialize_mongomovies_Request,
        requestDeserialize: deserialize_mongomovies_Request,
        responseSerialize: serialize_mongomovies_Response,
        responseDeserialize: deserialize_mongomovies_Response,
    },
    getMoviesByActor: {
        path: '/mongomovies.MongoMovies/getMoviesByActor',
        requestStream: false,
        responseStream: true,
        requestType: movies_pb.Request,
        responseType: movies_pb.Response,
        requestSerialize: serialize_mongomovies_Request,
        requestDeserialize: deserialize_mongomovies_Request,
        responseSerialize: serialize_mongomovies_Response,
        responseDeserialize: deserialize_mongomovies_Response,
    },
};
exports.MongoMoviesClient = grpc.makeGenericClientConstructor(MongoMoviesService);
