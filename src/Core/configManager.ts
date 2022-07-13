import { IConfig } from "../Common/iConfig"  
import { Config } from "../Common/config"  
import { ConfigKeys } from "../Common/configKeys"  
import { KVIdentityConfig } from "../Common/keyVaultIndentityConfig"  
import { KeyVaultSecret } from "@azure/keyvault-secrets" 
import { KeyVaultCertificateWithPolicy } from "@azure/keyvault-certificates" 
import { convertPFX } from "../Common/certConverter" 
import * as keyVaultUtility from '../Common/keyVaultUtility' 
import { ExceptionMessages } from "../Common/exceptionMessages"  
import { Constant } from "../Common/constants" 
import * as core from '@actions/core'

export class ConfigManager{
    config: IConfig
    public constructor(_config?:IConfig){
        this.config=(_config==undefined?new Config():_config)
    }

    public async PopulateConfiguration(){
        this.setConfigVariables()
        this.setKVIdentityConfig()
        await this.SetCertificatesInfo().catch((error) => {
            console.log(ExceptionMessages.CertPopulatingError)
            throw error 
        }) 
    }

    private setConfigVariables(){
       
        this.config.DomainTenantId = core.getInput('DomainTenantId')
        this.config.ServiceEndpointUrl=core.getInput('ServiceEndpointUrl')
        // this.config.AppInsightsLoggingKey = "33e01921-4d64-4f8c-a055-5bdaffd5e33d"
        this.config.MainPublisher = core.getInput('MainPublisher')
        this.config.Intent = core.getInput('Intent')
        this.config.ContentType = core.getInput('ContentType')
        this.config.ContentOrigin = core.getInput('ContentOrigin')
        this.config.ProductState = core.getInput('ProductState')
        this.config.Audience = core.getInput('Audience')
        this.config.Environment = "Developer"
        this.config.PackageLocation = core.getInput('PackageLocation')
        this.config.Owners = core.getInput('Owners')
        this.config.Approvers = core.getInput('Approvers')
        this.config.ConnectedServiceName=core.getInput('ConnectedServiceName')
        this.config.StatusPollingInterval = Constant.DelayBetweenEveryGetStatus
        
    }

    private setKVIdentityConfig(){
        this.config.KVIdentityConfig= new KVIdentityConfig()
        
            this.config.KVIdentityConfig.TenantId= process.env['KVTENANTID']
            this.config.KVIdentityConfig.KeyVaultName= process.env['KVNAME']
            this.config.KVIdentityConfig.AuthCertName= process.env['AUTHCERTNAME']
            this.config.KVIdentityConfig.SignCertName= process.env['SIGNCERTNAME']
            this.config.KVIdentityConfig.ClientId= process.env["KVAUTHCLIENT"]
            this.config.KVIdentityConfig.ClientSecret= process.env["KVAUTHSECRET"]
       
        console.log(this.config.KVIdentityConfig.ClientId)
        console.log(this.config.KVIdentityConfig.ClientSecret)
        this.config.ClientId= this.config.KVIdentityConfig.SignCertName
    }

    private async SetCertificatesInfo(){
        const authSecretCertificate: KeyVaultSecret = await keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig!, this.config.KVIdentityConfig!.AuthCertName!) 
        const authCertInfo = convertPFX(authSecretCertificate.value!) 
        const authCertificate: KeyVaultCertificateWithPolicy = await keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig!,this.config.KVIdentityConfig!.AuthCertName!) 

        var authCer = authCertificate.cer 
        var encodedAuthThumbprint = authCertificate.properties.x509Thumbprint 

       this.config.AuthCertThumbprint = Buffer.from(encodedAuthThumbprint!).toString("hex") 
       this.config.AuthPublicCert = Buffer.from(authCer!).toString("base64") 
       this.config.AuthPrivateKey = authCertInfo.key 
        
        
        const signSecretCertificate: KeyVaultSecret = await keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig!, this.config.KVIdentityConfig!.SignCertName!) 
        const signCertificate: KeyVaultCertificateWithPolicy = await keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig!,this.config.KVIdentityConfig!.SignCertName!) 

        const signCertInfo = convertPFX(signSecretCertificate.value!) 

        var signCer = signCertificate.cer 
        var encodedSignThumbprint = signCertificate.properties.x509Thumbprint 

        this.config.SignPrivateKey = signCertInfo.key
        this.config.SignPublicCert = Buffer.from(signCer!).toString("base64") 
        this.config.SignCertThumbprint = Buffer.from(encodedSignThumbprint!).toString("hex") 
        
    }

}
