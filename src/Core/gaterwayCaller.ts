import * as GatewayClient from '../Common/api'
import { AuthenticationManger } from "../Common/authContextManager";
import { Constant } from '../Common/constants';
import { IAuthenticationManager } from "../Common/iAuthContextManager";
import { IConfig } from "../Common/iConfig";
import { IMessageCreator } from "../Common/iMessageCreator";
import { MessageCreator } from '../Common/messageCreator';

export class GatewayCaller {
    config?: IConfig;
    authContext?: IAuthenticationManager
    messageCreator?:IMessageCreator

    public constructor(_config:IConfig, _authContext?:IAuthenticationManager, _messageCreator?:IMessageCreator){
        this.config=_config
        this.authContext=_authContext?_authContext:new AuthenticationManger(this.config)
        this.messageCreator=_messageCreator?_messageCreator: new MessageCreator(this.config)
    }
    private async FillAccessToken(){
        console.log('call fillaccesstoken')
        if (this.authContext?.accessToken==undefined){
            console.log('setting accesstoken')
            await this.authContext!.setAccessToken().catch((error:any)=>
            {   
                throw error
            })
            console.log("got accesstoken")
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