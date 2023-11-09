import grpc
from generated import movies_pb2_grpc

from prints import choose_option
from functions import create_movie, find_movie_by_id, update, delete, find_by_actor, find_by_category
from enums import CREATE_MOVIE_REQUEST_ID, FIND_MOVIE_BY_ID_REQUEST_ID, UPDATE_MOVIE_REQUEST_ID, DELETE_MOVIE_REQUEST_ID, FIND_MOVIE_BY_ACTOR_REQUEST_ID, FIND_MOVIE_BY_CATEGORY_REQUEST_ID, HOST, PORT

def connect():
    max_msg_length = 1024 * 1024 * 1024
    channel = grpc.insecure_channel("0.0.0.0:50051", options=[('grpc.max_message_length', max_msg_length),
                                         ('grpc.max_send_message_length', max_msg_length),
                                         ('grpc.max_receive_message_length', max_msg_length)])
    stub = movies_pb2_grpc.MongoMoviesStub(channel)

    return stub

def close(connection):
    connection.close()

def main():
    connection = connect()
    print("Estabelecendo conexão com o servidor...")

    choosen_option = choose_option()

    while (True):
        if choosen_option == CREATE_MOVIE_REQUEST_ID:
            create_movie(connection)

        elif choosen_option == FIND_MOVIE_BY_ID_REQUEST_ID:
            find_movie_by_id(connection)

        elif choosen_option == UPDATE_MOVIE_REQUEST_ID:
            update(connection)

        elif choosen_option == DELETE_MOVIE_REQUEST_ID:
            delete(connection)

        elif choosen_option == FIND_MOVIE_BY_ACTOR_REQUEST_ID:
            find_by_actor(connection)

        elif choosen_option == FIND_MOVIE_BY_CATEGORY_REQUEST_ID:
            find_by_category(connection)

        elif choosen_option == 0:
            print("\033[33mFinalizando conexão...")
            close(connection)
            break

        choosen_option = choose_option()

main()
