"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processarArquivoCSV = void 0;
var fs = __importStar(require("fs"));
var csv = require("csv-parser");
var processarArquivoCSV = function (options) {
    var caminhoArquivo = options.caminhoArquivo, callbackMessage = options.callbackMessage, callbackFinish = options.callbackFinish;
    fs.createReadStream(caminhoArquivo)
        .pipe(csv())
        .on("data", function (row) {
        var textoTweet = row.text.toLowerCase();
        if (contemPalavrasChaveVoleibol(textoTweet)) {
            callbackMessage("voleibol", {
                text: textoTweet,
                name: "voleibol",
            });
        }
        else if (contemPalavrasChaveFutebol(textoTweet)) {
            callbackMessage("futebol", {
                text: textoTweet,
                name: "futebol",
            });
        }
    })
        .on("end", function () {
        console.log("Processamento do arquivo CSV concluído.");
        callbackFinish();
    })
        .on("error", function (error) {
        console.error("Erro ao processar o arquivo CSV: ".concat(error.message));
    });
};
exports.processarArquivoCSV = processarArquivoCSV;
var contemPalavrasChaveVoleibol = function (texto) {
    var palavrasChaveVoleibol = ["voleibol", "vôlei", "volei", "vôlei"];
    return palavrasChaveVoleibol.some(function (palavra) { return texto.includes(palavra); });
};
var contemPalavrasChaveFutebol = function (texto) {
    var palavrasChaveFutebol = ["futebol", "futbol", "futból", "futebol"];
    return palavrasChaveFutebol.some(function (palavra) { return texto.includes(palavra); });
};
//# sourceMappingURL=processCSV.js.map