import grpc
from generated import movies_pb2_grpc
from generated.movies_pb2 import Request, Movie, Genre, Cast, Writer, Language, Country, Director

def connect():
    max_msg_length = 1024 * 1024 * 1024
    channel = grpc.insecure_channel("0.0.0.0:50051", options=[('grpc.max_message_length', max_msg_length),
                                                            ('grpc.max_send_message_length', max_msg_length),
                                                            ('grpc.max_receive_message_length', max_msg_length)])
    stub = movies_pb2_grpc.MongoMoviesStub(channel)
    return stub

def print_movie(movie):
    print("\n==========", movie.title, "==========")
    print("ID:", movie.id)
    print("Enredo:", movie.plot)
    print("Gêneros:", ", ".join(genre.name for genre in movie.genres))
    print("Duração do filme:", movie.runtime, "minutos")
    print("Elenco:", ", ".join(cast.actor for cast in movie.cast))
    print("Idiomas:", ", ".join(language.name for language in movie.languages))
    print("Diretores:", ", ".join(director.name for director in movie.directors))
    print("Escritores:", ", ".join(writer.name for writer in movie.writers))
    print("Países disponíveis:", ", ".join(country.name for country in movie.countries))
    print("Tipo do filme:", movie.type)
    print("Classificação:", movie.rated)
    print("Enredo completo:", movie.fullplot)

def create_movie(connection):
    movie = Movie()

    movie.plot = input("Fale sobre a história do filme: ")
    genres = input("Informe os gêneros do filme separados por espaço: ").split()
    movie.genres.extend([Genre(name=genre) for genre in genres])
    movie.runtime = int(input("Informe a duração do filme em minutos: "))
    movie.rated = input("Informe a classificação do filme: ")
    cast = input("Informe os nomes dos atores que fazem parte do elenco: ").split()
    movie.cast.extend([Cast(actor=actor) for actor in cast])
    movie.num_mflix_comments = int(input("Informe a quantidade de comentários: "))
    movie.poster = input("Informe o link para a URL do poster do filme: ")
    movie.title = input("Informe o título do filme: ")
    movie.fullplot = input("Informe a sinopse completa do filme: ")
    movie.year = input("Informe o ano de criação do filme: ")
    languages = input("Informe os idiomas em que o filme está disponível: ").split()
    movie.languages.extend([Language(name=language) for language in languages])
    movie.released = input("Informe a data de lançamento: ")
    directors = input("Informe os diretores do filme: ").split()
    movie.directors.extend([Director(name=director) for director in directors])
    writers = input("Informe os escritores do filme: ").split()
    movie.writers.extend([Writer(name=writer) for writer in writers])
    countries = input("Informe os países em que o filme está disponível: ").split()
    movie.countries.extend([Country(name=country) for country in countries])
    movie.type = input("Informe o tipo do filme: ")

    request = Request(movie=movie)
    create_movie_response = connection.createMovie(request)
    print(create_movie_response.message)

def find_movie_by_id(connection):
    movie_id = input("Informe o ID do filme: ")
    request = Request(data=movie_id)
    find_movie_response = connection.getMoviesById(request)

    if find_movie_response.movies:
        for movie in find_movie_response.movies:
            print_movie(movie)
    else:
        print(f"Filme com o ID '{movie_id}' não encontrado")

def update(connection):
    movie_id = input("Informe o ID do filme a ser atualizado: ")
    request = Request(data=movie_id)
    find_movie_response = connection.getMoviesById(request)

    if find_movie_response.movies:
        movie = find_movie_response.movies[0]
        print_movie(movie)

        print("Informe os dados a serem atualizados (deixe em branco para manter os existentes):")
        movie.plot = input("Fale sobre a história do filme: ") or movie.plot
        genres = input("Informe os gêneros do filme separados por espaço: ").split()
        if genres:
            movie.genres.clear()
            movie.genres.extend([Genre(name=genre) for genre in genres])
        movie.runtime = int(input("Informe a duração do filme em minutos: ")) or movie.runtime
        movie.rated = input("Informe a classificação do filme: ") or movie.rated
        cast = input("Informe os nomes dos atores que fazem parte do elenco: ").split()
        if cast:
            movie.cast.clear()
            movie.cast.extend([Cast(actor=actor) for actor in cast])
        movie.num_mflix_comments = int(input("Informe a quantidade de comentários: ")) or movie.num_mflix_comments
        movie.poster = input("Informe o link para a URL do poster do filme: ") or movie.poster
        movie.title = input("Informe o título do filme: ") or movie.title
        movie.fullplot = input("Informe a sinopse completa do filme: ") or movie.fullplot
        movie.year = input("Informe o ano de criação do filme: ") or movie.year
        languages = input("Informe os idiomas em que o filme está disponível: ").split()
        if languages:
            movie.languages.clear()
            movie.languages.extend([Language(name=language) for language in languages])
        movie.released = input("Informe a data de lançamento: ") or movie.released
        directors = input("Informe os diretores do filme: ").split()
        if directors:
            movie.directors.clear()
            movie.directors.extend([Director(name=director) for director in directors])
        writers = input("Informe os escritores do filme: ").split()
        if writers:
            movie.writers.clear()
            movie.writers.extend([Writer(name=writer) for writer in writers])
        countries = input("Informe os países em que o filme está disponível: ").split()
        if countries:
            movie.countries.clear()
            movie.countries.extend([Country(name=country) for country in countries])
        movie.type = input("Informe o tipo do filme: ") or movie.type

        request = Request(movie=movie, data=movie_id)
        update_response = connection.updateMovie(request)
        print(update_response.message)
    else:
        print(f"Nenhum filme encontrado com o ID '{movie_id}'")

def delete(connection):
    movie_id = input("Informe o ID do filme a ser deletado: ")
    request = Request(data=movie_id)
    delete_movie_response = connection.deleteMovie(request)
    print(delete_movie_response.message)

def find_by_actor(connection):
    actor_name = input("Informe o nome do ator: ")
    request = Request(data=actor_name)
    find_movie_by_actor_response = connection.getMoviesByActor(request)

    if find_movie_by_actor_response.movies:
        for movie in find_movie_by_actor_response.movies:
            print_movie(movie)
    else:
        print(f"Nenhum filme encontrado com o ator '{actor_name}'")

def find_by_category(connection):
    category_name = input("Informe a categoria: ")
    request = Request(data=category_name)
    find_movie_by_category_response = connection.getMoviesByGenre(request)

    if find_movie_by_category_response.movies:
        for movie in find_movie_by_category_response.movies:
            print_movie(movie)
    else:
        print(f"Nenhum filme encontrado com a categoria '{category_name}'")

def main():
    connection = connect()
    print("Estabelecendo conexão com o servidor...")
    
    while True:
        option = choose_option()
        if option == 1:
            create_movie(connection)
        elif option == 2:
            find_movie_by_id(connection)
        elif option == 3:
            update(connection)
        elif option == 4:
            delete(connection)
        elif option == 5:
            find_by_actor(connection)
        elif option == 6:
            find_by_category(connection)
        elif option == 0:
            print("Finalizando conexão...")
            close(connection)
            break

def choose_option():
    print("\n\n-------------------- Escolha uma opção --------------------")
    print("0 -> Encerrar a execução")
    print("1 -> Criar um novo filme")
    print("2 -> Procurar um filme pelo ID")
    print("3 -> Atualizar um filme existente")
    print("4 -> Deletar um filme")
    print("5 -> Encontrar filmes por ator")
    print("6 -> Encontrar filmes por categoria")
    print("------------------------------------------------------------")

    return int(input("Sua opção: "))

if __name__ == "__main__":
    main()
