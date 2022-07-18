"use strict";
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
const tl = require("azure-pipelines-task-lib/task");
const constants_1 = require("./Common/Configuration/constants");
const trackingMessages_1 = require("./Common/Logging/trackingMessages");
const exceptionMessages_1 = require("./Common/Exceptions/exceptionMessages");
const configValidators_1 = require("./Core/Validators/configValidators");
const gaterwayCaller_1 = require("./Core/Executers/gaterwayCaller");
const applicationInsights_1 = require("./Common/Logging/applicationInsights");
const configManager_1 = require("./Core/Managers/configManager");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let appInsightsKey = constants_1.Constant.AppInsightsLoggingKey;
            var applicationInsights = applicationInsights_1.ApplicationInsights.CreateInstance(appInsightsKey);
            var configManager = new configManager_1.ConfigManager();
            yield configManager.PopulateConfiguration().then(() => {
                console.log(constants_1.Constant.ConfigPopulatingSuccess);
                applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogTrace(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.ConfigUpdateSuccess, trackingMessages_1.TrackingMessages.ActionFile);
            }).catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.ConfigCreationFailed);
                applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogException(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.ConfigUpdateException, error, trackingMessages_1.TrackingMessages.ActionFile);
                throw error;
            });
            var validator = new configValidators_1.Validator();
            yield validator.ValidateConfig(configManager.config).then((response) => {
                if (response == true) {
                    console.log(constants_1.Constant.ConfigValidationSuccess);
                    applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogTrace(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.ConfigValidationSuccess, trackingMessages_1.TrackingMessages.ActionFile);
                }
            }).catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.ConfigValidationFailed);
                applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogException(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.ConfigValidationException, error, trackingMessages_1.TrackingMessages.ActionFile);
                throw error;
            });
            var gatewayCommunicator = new gaterwayCaller_1.GatewayCaller(configManager.config);
            let operationId = "";
            yield gatewayCommunicator.GatewayCalling().then((responseId) => {
                operationId = responseId;
            }).catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.GatewayCallingExecutionFailed);
                applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogException(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.GatewayCallingExecutionException, error, trackingMessages_1.TrackingMessages.ActionFile);
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
                applicationInsights === null || applicationInsights === void 0 ? void 0 : applicationInsights.LogException(configManager.config.RequestCorrelationId, trackingMessages_1.TrackingMessages.GatewayPollingExecutionException, error, trackingMessages_1.TrackingMessages.ActionFile);
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
            tl.setResult(tl.TaskResult.Succeeded, constants_1.Constant.HappyPathSuccessExecutionMessage, true);
        }
        catch (error) {
            console.log(exceptionMessages_1.ExceptionMessages.ExecutionFailed);
            console.log('CorrelationId: ' + configManager.config.RequestCorrelationId);
            try {
                let err = error;
                console.log(err.message);
            }
            catch (er) {
                console.log(error);
            }
            tl.setResult(tl.TaskResult.Failed, constants_1.Constant.FailurePathExecutionMessage, true);
        }
    });
}
exports.run = run;
run();
