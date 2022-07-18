import { IConfig } from "../../Common/Configuration/iConfig"  
import { Config } from "../../Common/Configuration/config"  
import { ConfigKeys } from "../../Common/Configuration/configKeys"  
import { KVIdentityConfig } from "../../Common/Configuration/keyVaultIndentityConfig"  
import { KeyVaultSecret } from "@azure/keyvault-secrets" 
import { KeyVaultCertificateWithPolicy } from "@azure/keyvault-certificates" 
import { convertPFX } from "../../Common/Utilities/certConverter" 
import * as keyVaultUtility from '../../Common/Utilities/keyVaultUtility' 
import { ExceptionMessages } from "../../Common/Exceptions/exceptionMessages"  
import { Constant } from "../../Common/Configuration/constants" 
import tl = require('azure-pipelines-task-lib/task');
import path from 'path'

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
       
        this.config.DomainTenantId = tl.getInput(ConfigKeys.DomainTenantId);
        this.config.ServiceEndpointUrl = tl.getInput(ConfigKeys.ServiceEndpointUrl);
        this.config.AppInsightsLoggingKey = Constant.AppInsightsLoggingKey;
        this.config.MainPublisher = tl.getInput(ConfigKeys.MainPublisher);
        this.config.Intent = tl.getInput(ConfigKeys.Intent);
        this.config.ContentType = tl.getInput(ConfigKeys.ContentType);
        this.config.ContentOrigin = tl.getInput(ConfigKeys.ContentOrigin);
        this.config.ProductState = tl.getInput(ConfigKeys.ProductState);
        this.config.Audience = tl.getInput(ConfigKeys.Audience);
        this.config.Environment = tl.getInput(ConfigKeys.Environment);
        this.config.PackageLocation = tl.getInput(ConfigKeys.PackageLocation);
        this.config.Owners = tl.getInput(ConfigKeys.Owners);
        this.config.Approvers = tl.getInput(ConfigKeys.Approvers);
        this.config.StatusPollingInterval = Constant.DelayBetweenEveryGetStatus;
        tl.setResourcePath(path.join(__dirname, Constant.TaskJsonDistanceFromManagerFolder));
        this.config.ConnectedServiceName = tl.getInput(ConfigKeys.ConnectedServiceName, true);
        if (this.config.ConnectedServiceName == Constant.Bad || this.config.ConnectedServiceName == undefined) {

            throw new Error(ExceptionMessages.BadInputGivenFor + ConfigKeys?.ConnectedServiceName);
        } 
    }

    private setKVIdentityConfig(){
        this.config.KVIdentityConfig= new KVIdentityConfig()
        
        if (this.config.Environment != undefined && this.config.Environment == Constant.Developer) {
            this.config.KVIdentityConfig.ClientId = tl.getInput(ConfigKeys.KvClientId, true);
            this.config.KVIdentityConfig.TenantId = tl.getInput(ConfigKeys.KvTenantId, true);
            this.config.KVIdentityConfig.KeyVaultName = tl.getInput(ConfigKeys.KvKeyVaultName, true);
            this.config.KVIdentityConfig.AuthCertName = tl.getInput(ConfigKeys.KvAuthCertName, true);
            this.config.KVIdentityConfig.SignCertName = tl.getInput(ConfigKeys.KvSignCertName, true);
            this.config.KVIdentityConfig.ClientSecret = tl.getInput(ConfigKeys.KvSecret, true);
        }
        else{
            try {

                this.config.KVIdentityConfig.ClientId = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName!, ConfigKeys.Username, true)!;
                this.config.KVIdentityConfig.ClientSecret = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName!, ConfigKeys.Password, true)!;
                this.config.KVIdentityConfig.TenantId = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName!, ConfigKeys.TenantId, true)!;
                this.config.KVIdentityConfig.KeyVaultName = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName!, ConfigKeys.KeyVaultName, true)!;
                this.config.KVIdentityConfig.AuthCertName = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName!, ConfigKeys.AuthCertName, true)!;
                this.config.KVIdentityConfig.SignCertName = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName!, ConfigKeys.SignCertName, true)!;

            }
            catch (error) {

                console.log(ExceptionMessages.KVConfigSetUpError);
                throw error;
            }
        }
        
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
