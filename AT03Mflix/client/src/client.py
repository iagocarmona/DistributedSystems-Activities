'''
Client GRPC
Descrição: esta é a aplicação responsável por se comunicar com o backend para 
manipular os dados dos filmes no banco

Autores: Jessé Pires Barbato Rocha, Jhonatan Guilherme de Oliveira Cunha

Alunos: Jhonatan Guilherme de Oliveira Cunha, Jessé Pires Barbato Rocha

Data de Início: 18/04/2023
Data última atualização: 23/05/2023
'''

import grpc
from generated import movies_pb2_grpc

from generated.movies_pb2 import Request
from generated.movies_pb2 import Movie
from generated.movies_pb2 import Genre
from generated.movies_pb2 import Cast
from generated.movies_pb2 import Writer
from generated.movies_pb2 import Language
from generated.movies_pb2 import Writer
from generated.movies_pb2 import Country
from generated.movies_pb2 import Writer
from generated.movies_pb2 import Director

def connect():
    maxMsgLength = 1024 * 1024 * 1024
    channel = grpc.insecure_channel("0.0.0.0:50051", options=[('grpc.max_message_length', maxMsgLength),
                                         ('grpc.max_send_message_length', maxMsgLength),
                                         ('grpc.max_receive_message_length', maxMsgLength)])
    stub = movies_pb2_grpc.MongoMoviesStub(channel)

    return stub

def close(connection):
    connection.close()

# this function only prints the movies data, even if it's just one movie or a list
def print_movies(movies):
    for movie in movies:
        print("\n\n==========", movie.title, "==========")
        print("\nID: ", movie.id)
        print("\nEnredo: ", movie.plot)

        print("Gêneros: ", end="")
        genres_list = [genre.name for genre in movie.genres]
        print(", ".join(genres_list))

        print("Duração do filme: ", movie.runtime, " minutos")

        print("Elenco: ", end="")
        actors_list = [cast.actor for cast in movie.cast]
        print(", ".join(actors_list))

        print("Idiomas: ", end="")
        languages_list = [language.name for language in movie.languages]
        print(", ".join(languages_list))

        print("Diretores: ", end="")
        directors_list = [director.name for director in movie.directors]
        print(", ".join(directors_list))

        print("Escritores: ", end="")
        writers_list = [writer.name for writer in movie.writers]
        print(", ".join(writers_list))

        print("Países disponíveis: ", end="")
        countries_list = [country.name for country in movie.countries]
        print(", ".join(countries_list))

        print("Tipo do filme: ", movie.type)

        print("Classificação: ", movie.rated)

        print("\nEnredo completo: ", movie.fullplot)


# auxiliary function to print messages (to avoid code duplication)
def print_message(message):
    print("\n")
    print("-" * len(message))
    print(message)
    print("-" * len(message))
    print("\n")


def create_movie(connection):
    movie = Movie() # create a new movie 

    #get movie data
    movie.plot = input("Fale sobre a história do filme <string>: ")
    genres = input(
        "Informe os gêneros do filme separados por espaço <string>: ").split(" ")

    for genre in genres:
        new_genre = Genre()
        new_genre.name = genre
        movie.genres.append(new_genre)

    movie.runtime = int(input("Informe a duração do filme em minutos <number>: "))
    movie.rated = input("Informe a classificação do filme <string>: ")

    cast = input(
        "Informe os nomes dos atores que fazem parte do elenco <string>: ").split(" ")

    for actor in cast:
        new_actor = Cast()
        new_actor.actor = actor
        movie.cast.append(new_actor)

    movie.num_mflix_comments = int(
        input("Informe a quantidade de comentários <number>: "))
    movie.poster = input("Informe o link para a URL do poster filme <string>: ")
    movie.title = input("Informe o título do filme <string>: ")
    movie.fullplot = input("Informe a sinopse completa do filme <string>: ")

    movie.year = input("Informe o ano de criação do filme <string>: ")

    languages = input(
        "Informe os idiomas em que o filme está disponível <string>: ").split(" ")

    for language in languages:
        new_language = Language()
        new_language.name = language
        movie.languages.append(new_language)

    movie.released = input("Informe a data de lançamento <string>: ")

    directors = input("Informe os diretores do filme <string>: ").split(" ")

    for director in directors:
        new_director = Director()
        new_director.name = director
        movie.directors.append(new_director)

    writers = input("Informe os escritores do filme <string>: ").split(" ")

    for writer in writers:
        new_writer = Writer()
        new_writer.name = writer
        movie.writers.append(new_writer)

    countries = input(
        "Informe os países em que o filme está disponível <string>: ").split(" ")

    for country in countries:
        new_country = Country()
        new_country.name = country
        movie.countries.append(new_country)

    movie.type = input("Informe o tipo do filme <string>: ")

    # send request to create new movie
    request = Request(movie=movie)
    create_movie_response = connection.createMovie(request)

    print_message(create_movie_response.message)  


def find_movie_by_id(connection):
    movie_id = input("Informe o id do filme <string>: ") # get the movie id

    # send request to find movie
    request = Request(data=movie_id)
    find_movie_response = connection.getMoviesById(request)
    
    if len(find_movie_response.movies) == 0:
        print(f"Filme com id '{movie_id}' não encontrado")
    else:
        print_movies(find_movie_response.movies)


def update(connection):
    movie_id = input("Informe o id do filme <string>: ") # get movie id
    
    find_movie_request = Request(data=movie_id)
    founded_movie = connection.getMoviesById(find_movie_request) # get movie based on id

    if len(founded_movie.movies) == 0:
        print(f"Nenhum filme encontrado com o id '{movie_id}'")
        return

    # since the ids are unique, only one movie will be returned, so we get him in the first list position
    founded_movie = founded_movie.movies[0]

    # get data that will be updated
    update_message = "Informe os dados a serem atualizados (Caso deseje manter algum deles, basta não preencher o campo)"
    print_message(update_message)

    plot = input("Fale sobre a história do filme: ")
    founded_movie.plot = plot if plot.strip() != "" else founded_movie.plot

    genres = input(
        "Informe os gêneros do filme separados por espaço <string>: ").split(" ")

    if len(genres) > 0 and genres[0] != "":
        del founded_movie.genres[:]

        for genre in genres:
            new_genre = Genre()
            new_genre.name = genre
            founded_movie.genres.append(new_genre)

    runtime = input("Informe a duração do filme em minutos <number>: ")
    founded_movie.runtime = int(runtime) if runtime.strip() != "" else founded_movie.runtime

    rated = input("Informe a classificação do filme <string>: ")
    founded_movie.rated = rated if rated.strip() != "" else "-"

    cast = input(
        "Informe os nomes dos atores que fazem parte do elenco <string>: ").split(" ")

    if len(cast) > 0 and cast[0] != "":
        del founded_movie.cast[:]
        
        for actor in cast:
            new_actor = Cast()
            new_actor.actor = actor
            founded_movie.cast.append(new_actor)

    num_mflix_comments = input("Informe a quantidade de comentários <number>: ")
    founded_movie.num_mflix_comments = int(num_mflix_comments) if num_mflix_comments.strip() != "" else founded_movie.num_mflix_comments
    
    poster = input("Informe o link para a URL do poster filme <string>: ")
    founded_movie.poster = poster if poster != "" else "-"
    
    title = input("Informe o título do filme <string>: ")
    founded_movie.title = title if title.strip() != "" else founded_movie.title
    
    fullplot = input("Informe a sinopse completa do filme <string>: ")
    founded_movie.fullplot = fullplot if fullplot.strip() != "" else founded_movie.fullplot

    year = input("Informe o ano de criação do filme <string>: ")
    founded_movie.year = year if year.strip() != "" else founded_movie.year

    languages = input(
        "Informe os idiomas em que o filme está disponível <string>: ").split(" ")

    if len(languages) > 0 and languages[0] != "":
        del founded_movie.languages[:]

        for language in languages:
            new_language = Language()
            new_language.name = language
            founded_movie.languages.append(new_language)

    released = input("Informe a data de lançamento <string>: ")
    founded_movie.released = released if released.strip() != "" else founded_movie.released

    directors = input("Informe os diretores do filme <string>: ").split(" ")

    if len(directors) > 0 and directors[0] != "":
        del founded_movie.directors[:]

        for director in directors:
            new_director = Director()
            new_director.name = director
            founded_movie.directors.append(new_director)

    writers = input("Informe os escritores do filme <string>: ").split(" ")

    if len(writers) > 0 and writers[0] != "":
        del founded_movie.writers[:]

        for writer in writers:
            new_writer = Writer()
            new_writer.name = writer
            founded_movie.writers.append(new_writer)

    countries = input(
        "Informe os países em que o filme está disponível <string>: ").split(" ")

    if len(countries) > 0 and countries[0] != "":
        del founded_movie.countries[:]

        for country in countries:
            new_country = Country()
            new_country.name = country
            founded_movie.countries.append(new_country)

    movie_type = input("Informe o tipo do filme <string>: ")
    founded_movie.type = movie_type if movie_type.strip() != "" else founded_movie.type

    # send request to update movie data
    update_movie_request = Request(movie=founded_movie, data=movie_id)
    update_response = connection.updateMovie(update_movie_request)

    print_message(update_response.message)


def delete(connection):
    movie_id = input("Informe o id do filme a ser deletado <string>: ") # get movie id

    # send request to delete movie based on id
    delete_movie_request = Request(data=movie_id)
    delete_movie_response = connection.deleteMovie(delete_movie_request)

    print_message(delete_movie_response.message)
    

def find_by_actor(connection):
    actor_name = input("Informe o nome do ator <string>: ") # get actor name

    # send request to find movie based on actor name
    request = Request(data=actor_name)
    find_movie_by_actor_response = connection.getMoviesByActor(request)

    if len(find_movie_by_actor_response.movies) == 0:
        print(f"Nenhum filme encontrado com o ator '{actor_name}'")
    else:
        print_movies(find_movie_by_actor_response.movies)


def find_by_category(connection):
    category_name = input("Informe a categoria <string>: ") # get category name

    # send request to find movie based on category name
    request = Request(data=category_name)
    find_movie_by_category_response = connection.getMoviesByGenre(request)

    if len(find_movie_by_category_response.movies) == 0:
        print(f"Nenhum filme encontrado com a categoria '{category_name}'")
    else:
        print_movies(find_movie_by_category_response.movies)


# this function only shows the options that users have 
def choose_option():
    print("\n\n--------------------Escolha uma opção--------------------")
    print("0 -> Encerra a execução")
    print("1 -> criar um novo filme")
    print("2 -> Procurar pelo id do filme")
    print("3 -> Atualizar um filme existe")
    print("4 -> Deletar um filme")
    print("5 -> Encontrar filmes com base no ator")
    print("6 -> Encontrar filmes com base na categoria")
    print("---------------------------------------------------------")

    option = int(input("\nSua opção: "))

    return option


def main():
    # establishing connection with server
    connection = connect()
    print("Estabelecendo conexão com o servidor...")

    choosen_option = choose_option() # choosing the option

    # handle users option choose
    while (True):
        if choosen_option == 1:
            create_movie(connection)

        elif choosen_option == 2:
            find_movie_by_id(connection)

        elif choosen_option == 3:
            update(connection)

        elif choosen_option == 4:
            delete(connection)

        elif choosen_option == 5:
            find_by_actor(connection)

        elif choosen_option == 6:
            find_by_category(connection)

        elif choosen_option == 0:
            print("Finalizando conexão...")
            close(connection)
            break

        choosen_option = choose_option()


main()
