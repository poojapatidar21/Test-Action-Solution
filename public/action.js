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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const configManager_1 = require("./Core/configManager");
const exceptionMessages_1 = require("./Common/exceptionMessages");
const gaterwayCaller_1 = require("./Core/gaterwayCaller");
const constants_1 = require("./Common/constants");
const core = __importStar(require("@actions/core"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var configManager = new configManager_1.ConfigManager();
            yield configManager.PopulateConfiguration().then(() => {
                console.log(constants_1.Constant.ConfigPopulatingSuccess);
            }).catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.ConfigCreationFailed);
                throw error;
            });
            var gatewayCommunicator = new gaterwayCaller_1.GatewayCaller(configManager.config);
            let operationId = '';
            yield gatewayCommunicator.GatewayCalling().then((responseId) => {
                operationId = responseId;
            }).catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.GatewayCallingExecutionFailed);
                var finalError = new Error();
                try {
                    let err = error;
                    finalError = new Error(err.response.statusCode + '--' + err.response.statusMessage);
                }
                catch (er) {
                    throw error;
                }
                throw finalError;
            });
            yield gatewayCommunicator.GatewayPolling(operationId).then().catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.GatewayPollingExecutionFailed);
                var finalError = new Error();
                try {
                    let err = error;
                    finalError = new Error(err.response.statusCode + '--' + err.response.statusMessage);
                }
                catch (er) {
                    throw error;
                }
                throw finalError;
            });
        }
        catch (error) {
            console.log(exceptionMessages_1.ExceptionMessages.ExecutionFailed);
            try {
                let err = error;
                console.log(err.message);
            }
            catch (er) {
                console.log(error);
            }
            core.setFailed(error.messages);
        }
    });
}
exports.run = run;
run();
