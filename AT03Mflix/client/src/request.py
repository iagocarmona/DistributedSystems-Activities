from generated.movies_pb2 import Request
from generated.movies_pb2 import Response

def send_request(connection, request_id, movie, data):
    request = Request()
    request.request_id = request_id
    
    if movie is not None:
        if request_id == 1 or request_id == 3:
            request.movie.CopyFrom(movie)
        else:
            request.movies.CopyFrom(movie)

    if data is not None:
        request.data = data

    request_bytes = request.SerializeToString()

    connection.sendall(request_bytes) 

    response = b""
    buffer_size = 4096

    while True:
        data = connection.recv(buffer_size)

        if data == b"END_OF_STREAM":
            break

        response += data

    response_message = Response()
    response_message.ParseFromString(response)

    return response_message