"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grpc_js_1 = require("@grpc/grpc-js");
var language_pb_1 = require("../proto/com/language/v1/language_pb");
var hello_service_pb_1 = require("../proto/services/hello/v1/hello_service_pb");
var hello_service_grpc_pb_1 = require("../proto/services/hello/v1/hello_service_grpc_pb");
var greet = function (call, callback) {
    var response = new hello_service_pb_1.GreetResponse();
    switch (call.request.getLanguageCode()) {
        case language_pb_1.Language.Code.CODE_FA:
            response.setGreeting("\u0633\u0644\u0627\u0645\u060C ".concat(call.request.getName()));
            break;
        case language_pb_1.Language.Code.CODE_UNSPECIFIED:
        case language_pb_1.Language.Code.CODE_EN:
        default:
            response.setGreeting("Hello, ".concat(call.request.getName()));
    }
    callback(null, response);
};
var server = new grpc_js_1.Server();
server.addService(hello_service_grpc_pb_1.HelloServiceService, { greet: greet });
server.bindAsync('0.0.0.0:4000', grpc_js_1.ServerCredentials.createInsecure(), function () {
    server.start();
    console.log('server is running on 0.0.0.0:4000');
});
