import * as core from "@actions/core"
import http from 'http'
import { ConfigManager } from "./Core/configManager"
import { ExceptionMessages } from "./Common/exceptionMessages"
import { GatewayCaller } from "./Core/gaterwayCaller"
import {MSEssGatewayClientContractsOperationResponse} from './Common/api'
import { Constant } from "./Common/constants"

export async function run() {
    try{
        const ConnectedServiceName:string = core.getInput('ConnectedServiceName')
        console.log(ConnectedServiceName)
        
        var configManager= new ConfigManager()
        await configManager.PopulateConfiguration().then(()=>{
            console.log(Constant.ConfigPopulatingSuccess)
        }).catch((error:any)=>{
        console.log(ExceptionMessages.ConfigCreationFailed)
        throw error
        })

        var gatewayCommunicator=new GatewayCaller(configManager.config!)
        console.log(configManager.config!)
        let operationId=''
        await gatewayCommunicator.GatewayCalling().then((responseId:string)=>{
            operationId=responseId
        }).catch((error:any)=>{
            console.log(ExceptionMessages.GatewayCallingExecutionFailed)
            var finalError =new Error()
            try{
                let err=error as {response: http.IncomingMessage; body: MSEssGatewayClientContractsOperationResponse;}
                finalError=new Error(err.response.statusCode+'--'+err.response.statusMessage)

            }  catch(er){
                throw error
            }
            throw finalError
        })
    

    } catch(error){
        console.log(error)
    }
    
}
run()