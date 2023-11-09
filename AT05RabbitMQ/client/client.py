# Autor: Iago Ortega Carmona
# Descrição: Cliente que recebe mensagens de um tópico específico
# Data de Criação: 09/11/2023
# Data Ultima Atualização: 09/11/2023


import pika
import questionary
import json
from colorama import Fore, Style, init  # Importar init diretamente

# Inicializar o colorama
init()

# Função que será chamada quando uma mensagem for recebida


def callback(ch, method, properties, body):
    message = json.loads(body.decode())
    text = message['text']
    print(f'{Fore.GREEN}Mensagem recebida: {Fore.RESET}{text}')


# Conectar ao servidor RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters(
    'localhost', credentials=pika.PlainCredentials('iago', '123123')))
channel = connection.channel()

# Nome do exchange (tópico)
exchange = 'topic_logs'

# Declarar o exchange
channel.exchange_declare(exchange=exchange, exchange_type='topic')

# Opções de tópicos
topics = ['futebol', 'voleibol']

# Permitir que o usuário escolha entre futebol e voleibol usando questionary
choices = questionary.checkbox(
    "Quais tópicos você deseja receber informações?",
    choices=topics
).ask()

# Validar as escolhas do usuário
while not choices:
    print('Escolha inválida. Selecione pelo menos um tópico.')
    choices = questionary.checkbox(
        "Quais tópicos você deseja receber informações?",
        choices=topics
    ).ask()

# Criar uma fila temporária e vinculá-la aos tópicos escolhidos
result = channel.queue_declare(queue='', exclusive=True)
queue_name = result.method.queue

for choice in choices:
    channel.queue_bind(exchange=exchange, queue=queue_name, routing_key=choice)

print(
    f'Aguardando mensagens nos tópicos: {", ".join(choices)}. Pressione CTRL+C para sair.')

# Registrar a função de callback para receber mensagens
channel.basic_consume(
    queue=queue_name, on_message_callback=callback, auto_ack=True)

# Iniciar a escuta por mensagens
channel.start_consuming()
