// Descrição: Código-fonte principal do servidor. Responsável por publicar as mensagens no RabbitMQ e classificá-las em tópicos. ['voleibol', 'futebol']
// Autor: Iago Ortega Carmona
// Data de Criação: 09/11/2023
// Data de Atualização: 09/11/2023

import * as amqp from "amqplib";
import { processarArquivoCSV } from "./utils/processCSV";

// Interface para a mensagem
export interface IMessage {
    text: string;
    name: string;
}

// Enum para os tópicos
enum Topic {
    Futebol = "futebol",
    Voleibol = "voleibol",
}

/**
 * Publica uma mensagem no RabbitMQ com base nos dados de um arquivo CSV.
 * @returns {Promise<void>} Uma Promise vazia.
 */
async function publishMessageRabbitMQ(): Promise<void> {
    try {
        const connection = await amqp.connect(
            "amqp://iago:123123@localhost:5672"
        );
        const channel = await connection.createChannel();

        // Função que será invocada quando uma mensagem for classificada
        const callbackMessage = async (topic: Topic, message: IMessage) => {
            try {
                const exchange = "topic_logs";
                const msg = Buffer.from(JSON.stringify(message));

                channel.assertExchange(exchange, "topic", {
                    durable: false,
                });

                channel.publish(exchange, topic, msg);

                console.log(
                    `Mensagem publicada com sucesso na fila: ${topic}.`
                );
            } catch (error) {
                console.error("Erro ao publicar mensagem:", error);
            }
        };

        // Função que será invocada quando terminar de processar o CSV
        const callbackFinish = async () => {
            console.log("Acabou de processar todos os tweets.");
            // Fechar a conexão e o channel após o processamento do CSV
            await channel.close();
            await connection.close();
        };

        // Caminho do arquivo CSV
        const caminhoArquivoCSV = "tweets.csv";

        // Chamar a função para processar o arquivo CSV
        processarArquivoCSV({
            caminhoArquivo: caminhoArquivoCSV,
            callbackMessage,
            callbackFinish,
        });
    } catch (error) {
        console.log(error.message);
    }
}

// Chamar a função para publicar a mensagem no RabbitMQ
publishMessageRabbitMQ();

