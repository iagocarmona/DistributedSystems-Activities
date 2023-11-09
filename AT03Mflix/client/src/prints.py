def print_movies(movies):
    for movie in movies:
        print("\n\n\033[33m==========\033[34m", movie.title, "\033[33m==========\033[0m")
        print("\n\033[33mID: \033[35m", movie.id)
        print("\n\033[32mEnredo: \033[34m", movie.plot)

        print("\033[32mGêneros: \033[34m", end="")
        genres_list = [genre.name for genre in movie.genres]
        print(", ".join(genres_list))

        print("\033[32mDuração do filme: \033[34m", movie.runtime, " minutos")

        print("\033[32mElenco: \033[34m", end="")
        actors_list = [cast.actor for cast in movie.cast]
        print(", ".join(actors_list))

        print("\033[32mIdiomas: \033[34m", end="")
        languages_list = [language.name for language in movie.languages]
        print(", ".join(languages_list))

        print("\033[32mDiretores: \033[34m", end="")
        directors_list = [director.name for director in movie.directors]
        print(", ".join(directors_list))

        print("\033[32mEscritores: \033[34m", end="")
        writers_list = [writer.name for writer in movie.writers]
        print(", ".join(writers_list))

        print("\033[32mPaíses disponíveis: \033[34m", end="")
        countries_list = [country.name for country in movie.countries]
        print(", ".join(countries_list))

        print("\033[32mTipo do filme: \033[34m", movie.type)

        print("\033[32mClassificação: \033[34m", movie.rated)

        print("\n\033[32mEnredo completo: \033[34m", movie.fullplot)


def print_message(message):
    print("\n")
    print("-" * len(message))
    print(message)
    print("-" * len(message))
    print("\n")

def choose_option():
    print("\n\n\033[37m=============== Bem-vindo ao Sistema de Filmes ===============")
    print("Menu de opções:")
    print("-------------------------------------------------------------")
    print("\033[33m  \033[1m0\033[0m -> \033[0mEncerrar a execução")
    print("\033[32m  \033[1m1\033[0m -> \033[34mCriar um novo filme")
    print("\033[32m  \033[1m2\033[0m -> \033[34mProcurar filme por ID")
    print("\033[32m  \033[1m3\033[0m -> \033[34mAtualizar filme existente")
    print("\033[32m  \033[1m4\033[0m -> \033[31mDeletar um filme")
    print("\033[32m  \033[1m5\033[0m -> \033[34mEncontrar filmes por ator")
    print("\033[32m  \033[1m6\033[0m -> \033[34mEncontrar filmes por categoria")
    print("-------------------------------------------------------------\033[0m")

    option = int(input("\nSua opção: "))
    return option