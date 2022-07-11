import { IAuthenticationManager } from "./iAuthContextManager";
import { IConfig } from "./iConfig";
import Msal = require('@azure/msal-node');
import { ExceptionMessages } from "./exceptionMessages";
export class AuthenticationManger implements IAuthenticationManager{
    accessToken?: string
    config?:IConfig
    SNIPinningFlag?:string

    public constructor(_config:IConfig){
        this.config=_config
        this.accessToken=undefined
        this.SNIPinningFlag='true'
    }

    public async setAccessToken(): Promise<string | undefined> {
        var authorityHostUrl = 'https://login.microsoftonline.com'
        var tenant = this.config?.DomainTenantId
        var authorityUrl= authorityHostUrl+'/'+tenant
        var resourceUri = this.config!.ServiceEndpointUrl

        const clientConfig={
            auth:{
                clientId:this.config!.KVIdentityConfig!.ClientId!,
                authority:authorityUrl,
                ClientCertificate:{
                    thumbprint:this.config!.AuthCertThumbprint,
                    privateKey:this.config!.AuthPrivateKey,
                    x5c:this.SNIPinningFlag
                }
            }
        }
        console.log(clientConfig,'clientconfig output')

        const cca = new Msal.ConfidentialClientApplication(clientConfig)
        var gatewayScope=resourceUri+"/.default"
        const clientCredentialRequest={
            scopes:[gatewayScope]
        }
        await cca.acquireTokenByClientCredential(clientCredentialRequest).then((response)=>{
            this.accessToken=response?.accessToken!
        }).catch((error)=>{
            console.log(ExceptionMessages.TokenAcquiringError)
            throw error
        })
        return "success"
    }


}