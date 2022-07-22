import * as core from '@actions/core'
import http = require('http') 
import { MSEssGatewayClientContractsOperationResponse, MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage } from "./Common/GatewayApiSpec/api" 
import { Constant } from "./Common/Configuration/constants" 
import { TrackingMessages } from "./Common/Logging/trackingMessages" 
import { ExceptionMessages } from "./Common/Exceptions/exceptionMessages" 
import { Validator } from "./Core/Validators/configValidators" 
import { GatewayCaller } from "./Core/Executers/gatewayCaller" 
import { ApplicationInsights } from './Common/Logging/applicationInsights' 
import { ConfigManager } from './Core/Managers/configManager' 

export async function run(this: any) {

    try {

        

        let appInsightsKey = Constant.AppInsightsLoggingKey 
        var applicationInsights = ApplicationInsights.CreateInstance(appInsightsKey) 
        
        var configManager = new ConfigManager() 
        await configManager.PopulateConfiguration().then(() => {

            console.log(Constant.ConfigPopulatingSuccess) 
            applicationInsights?.LogTrace(configManager.config!.RequestCorrelationId!, TrackingMessages.ConfigUpdateSuccess, TrackingMessages.ActionFile) 
        }).catch((error) => {

            console.log(ExceptionMessages.ConfigCreationFailed) 
            applicationInsights?.LogException(configManager.config!.RequestCorrelationId!, TrackingMessages.ConfigUpdateException, error, TrackingMessages.ActionFile) 
            throw error 
        }) 
            
        var validator = new Validator() 
        await validator.ValidateConfig(configManager.config!).then((response) => {

            if(response == true) {

                console.log(Constant.ConfigValidationSuccess) 
                applicationInsights?.LogTrace(configManager.config!.RequestCorrelationId!, TrackingMessages.ConfigValidationSuccess, TrackingMessages.ActionFile) 
            }
        }).catch((error) => {

            console.log(ExceptionMessages.ConfigValidationFailed) 
            applicationInsights?.LogException(configManager.config!.RequestCorrelationId!, TrackingMessages.ConfigValidationException, error, TrackingMessages.ActionFile) 
            throw error 
        }) 

        var gatewayCommunicator = new GatewayCaller(configManager.config!) 
        let operationId = "" 
        await gatewayCommunicator.GatewayCalling().then((responseId) => {

            operationId = responseId 
        }).catch ((error) => {

            console.log(ExceptionMessages.GatewayCallingExecutionFailed) 
            applicationInsights?.LogException(configManager.config!.RequestCorrelationId!, TrackingMessages.GatewayCallingExecutionException, error, TrackingMessages.ActionFile) 
            var finalError = new Error() 
            try {

                let err = error as { response: http.IncomingMessage;  body: MSEssGatewayClientContractsOperationResponse  } 
                finalError = new Error(err.response.statusCode + '--' + err.response.statusMessage) 
            }
            catch (er) {

                throw error 
            }
            throw finalError 
        }) 
        await gatewayCommunicator.GatewayPolling(operationId).then().catch((error) => {

            console.log(ExceptionMessages.GatewayPollingExecutionFailed) 
            applicationInsights?.LogException(configManager.config!.RequestCorrelationId!, TrackingMessages.GatewayPollingExecutionException, error, TrackingMessages.ActionFile) 
            var finalError = new Error() 
            try {

                let err = error as { response: http.IncomingMessage ; body: MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage } 
                finalError = new Error(err.response.statusCode + '--' + err.response.statusMessage) 
            }
            catch (er) {

                throw error 
            }
            throw finalError 
        }) 

        console.log(Constant.HappyPathSuccessExecutionMessage) 

    }
    catch (error) {

        console.log(ExceptionMessages.ExecutionFailed) 
        console.log('CorrelationId: ' + configManager!.config!.RequestCorrelationId) 
        try {

            let err = error as Error 
            console.log(err.message) 
        }
        catch (er) {

            console.log(error) 
        }
       core.setFailed( Constant.FailurePathExecutionMessage) 
    }
}

run() 
