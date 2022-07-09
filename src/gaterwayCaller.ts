import * as GatewayClient from './api'
import { AuthenticationManger } from "./authContextManager";
import { Constant } from './constants';
import { IAuthenticationManager } from "./iAuthContextManager";
import { IConfig } from "./iConfig";
import { IMessageCreator } from "./iMessageCreator";

export class GatewayCaller {
    config?: IConfig;
    authContext?: IAuthenticationManager
    messageCreator?:IMessageCreator

    public constructor(_config:IConfig, _authContext?:IAuthenticationManager, _messageCreator?:IMessageCreator){
        this.config=_config
        this.authContext=_authContext?_authContext:new AuthenticationManger(this.config)
        
    }
    private async FillAccessToken(){
        if (this.authContext?.accessToken==undefined){
            await this.authContext!.setAccessToken().catch((error:any)=>
            {   
                throw error
            })
        }
    }

    private async FetchContainerSas():Promise<URL>{
        await this.FillAccessToken().then()

        var oAuth = new GatewayClient.OAuth()
        oAuth.accessToken=this.authContext?.accessToken!

        var sessionApi = new  GatewayClient.SessionApi()
        sessionApi.setDefaultAuthentication(oAuth)
        sessionApi.basePath=this.config!.ServiceEndpointUrl!

        var request=new GatewayClient.MSEssGatewayClientContractsSessionRequestMessage
        request=await this.messageCreator!.PopulateSessionRequestMessage().then()
        console.log(Constant.GatewaySessionRequestMessageSend)

        var operationRespone=await sessionApi.sessionCreateSessionAsync(this.config!.ClientId!,'2',request)
        var sessionResponseShards=operationRespone?.body?.storageResult?.storageShards

        let containerSas= new URL(sessionResponseShards![0].shardLocation?.blobUrl as string)
        console.log(Constant.GatewaySessionsShardsReceived);
        return containerSas


    }
    public async GatewayCalling(): Promise<string>{
        await this.FillAccessToken().then()

        var containerSas=await this.FetchContainerSas().then()
        var oAuth=new GatewayClient.OAuth()
        oAuth.accessToken=this.authContext?.accessToken!

        var releaseApi= new GatewayClient.ReleaseApi()
        releaseApi.setDefaultAuthentication(oAuth)
        releaseApi.basePath=this.config!.ServiceEndpointUrl!

        var request= new GatewayClient.MSEssGatewayClientContractsReleaseRequestReleaseRequestMessage
        request = await this.messageCreator!.PopulateReleaseRequestMessage(containerSas).then()
        console.log(Constant.GatewayRequestMessage)
        request.version='2'

        var operationRespone=await releaseApi.releasePostRelease2Async(this.config!.ClientId!,'2',request)
        var operationId=operationRespone.body.operationId
        console.log(Constant.GatewayResponseMessage +operationId+'\n')

        return operationId!

        
        
    }
    
}