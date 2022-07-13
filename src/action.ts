import http from 'http'
import { ConfigManager } from "./Core/configManager"
import { ExceptionMessages } from "./Common/exceptionMessages"
import { GatewayCaller } from "./Core/gaterwayCaller"
import {MSEssGatewayClientContractsOperationResponse, MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage} from './Common/api'
import { Constant } from "./Common/constants"
import * as core from "@actions/core";

export async function run() {
    try{
        const service:string =core.getInput('service')
        console.log("input value-",service)
        
        var configManager= new ConfigManager()
        console.log(configManager.config.ConnectedServiceName)
        await configManager.PopulateConfiguration().then(()=>{

            console.log(Constant.ConfigPopulatingSuccess)

        }).catch((error:any)=>{

        console.log(ExceptionMessages.ConfigCreationFailed)
        throw error
        })
        console.log(configManager.config!)
        var gatewayCommunicator=new GatewayCaller(configManager.config!)
        
        let operationId=''
        await gatewayCommunicator.GatewayCalling().then((responseId:string)=>{

            operationId=responseId
        }).catch((error:any)=>{

            console.log(ExceptionMessages.GatewayCallingExecutionFailed)
            var finalError =new Error()
            try{
                let err=error as {response: http.IncomingMessage  ;body: MSEssGatewayClientContractsOperationResponse }
                finalError=new Error(err.response.statusCode+'--'+err.response.statusMessage)

            }  catch(er){
                throw error
            }
            throw finalError
        })
        await gatewayCommunicator.GatewayPolling(operationId).then().catch((error: any) => {

            console.log(ExceptionMessages.GatewayPollingExecutionFailed) 
            var finalError = new Error() 
            try {

                let err = error as { response: http.IncomingMessage  ;body: MSEssGatewayClientContractsReleaseResponseReleaseDetailsMessage } 
                finalError = new Error(err.response.statusCode + '--' + err.response.statusMessage) 
            }
            catch (er) {

                throw error 
            }
            throw finalError 
        })
    

    } catch(error){
        console.log(ExceptionMessages.ExecutionFailed) 
        try {

            let err = error as Error 
            console.log(err.message) 
        }
        catch (er) {

            console.log(error) 
        }
    }
    
}
run()