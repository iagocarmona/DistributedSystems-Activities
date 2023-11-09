// Descrição: Função responsável por processar o arquivo CSV e publicar as mensagens no RabbitMQ.
// Autor: Iago Ortega Carmona
// Data de Criação: 09/11/2023
// Data de Atualização: 09/11/2023

import * as fs from "fs";
const csv = require("csv-parser");

// Interface para a mensagem
export interface IMessage {
    text: string;
    name: string;
}

// Enum para os tópicos
interface ProcessCSVOptions {
    caminhoArquivo: string;
    callbackMessage: (topic: string, message: IMessage) => void;
    callbackFinish: () => void;
}

/**
 * Processa um arquivo CSV e invoca callbacks para cada mensagem e ao final do processamento.
 * @param {ProcessCSVOptions} options Opções para o processamento do arquivo CSV.
 * @returns {void} Nada.
 */
export const processarArquivoCSV = (options: ProcessCSVOptions) => {
    const { caminhoArquivo, callbackMessage, callbackFinish } = options;

    fs.createReadStream(caminhoArquivo)
        .pipe(csv())
        .on("data", (row: { text: string }) => {
            // Verificar se o campo 'text' contém palavras-chave associadas a voleibol ou futebol
            const textoTweet = row.text.toLowerCase(); // Converter para minúsculas para correspondência sem distinção entre maiúsculas e minúsculas

            if (contemPalavrasChaveVoleibol(textoTweet)) {
                callbackMessage("voleibol", {
                    text: textoTweet,
                    name: "voleibol",
                });
            } else if (contemPalavrasChaveFutebol(textoTweet)) {
                callbackMessage("futebol", {
                    text: textoTweet,
                    name: "futebol",
                });
            }
        })
        .on("end", () => {
            console.log("Processamento do arquivo CSV concluído.");
            // Chamar o callback de término do processamento
            callbackFinish();
        })
        .on("error", (error) => {
            console.error(`Erro ao processar o arquivo CSV: ${error.message}`);
        });
};

// Funções auxiliares para verificar a presença de palavras-chave => voleibol
const contemPalavrasChaveVoleibol = (texto: string): boolean => {
    const palavrasChaveVoleibol = ["voleibol", "vôlei", "volei", "vôlei"];
    return palavrasChaveVoleibol.some((palavra) => texto.includes(palavra));
};

// Funções auxiliares para verificar a presença de palavras-chave => futebol
const contemPalavrasChaveFutebol = (texto: string): boolean => {
    const palavrasChaveFutebol = ["futebol", "futbol", "futból", "futebol"];
    return palavrasChaveFutebol.some((palavra) => texto.includes(palavra));
};

