import { IConfig } from "../Common/iConfig"; 
import { Config } from "../Common/config"; 
import { ConfigKeys } from "../Common/configKeys"; 
import { KVIdentityConfig } from "../Common/keyVaultIndentityConfig"; 
import { KeyVaultSecret } from "@azure/keyvault-secrets";
import { KeyVaultCertificateWithPolicy } from "@azure/keyvault-certificates";
import { convertPFX } from "../Common/certConverter";
import * as keyVaultUtility from '../Common/keyVaultUtility' 
import { ExceptionMessages } from "../Common/exceptionMessages"; 
import { Constant } from "../Common/constants";

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
            throw error;
        });
    }

    private setConfigVariables(){
       
        this.config.DomainTenantId = "72f988bf-86f1-41af-91ab-2d7cd011db47"
        this.config.ServiceEndpointUrl='https://api.esrp.microsoft.com'
        // this.config.AppInsightsLoggingKey = "33e01921-4d64-4f8c-a055-5bdaffd5e33d"
        this.config.MainPublisher = "ESRPRELTEST"
        this.config.Intent = "PackageDistribution"
        this.config.ContentType = "Maven"
        this.config.ContentOrigin = "azeus"
        this.config.ProductState = "new"
        this.config.Audience = "Workflow.A_S_AV_PackageManager"
        this.config.Environment = "Developer"
        this.config.PackageLocation = "src/Tasks/github.Release.Task/pacman-app-1.1"
        this.config.Owners = "xyz@microsoft.com"
        this.config.Approvers = "abc@microsoft.com"
        this.config.StatusPollingInterval = Constant.DelayBetweenEveryGetStatus
        this.config.ConnectedServiceName = "ReleaseServiceConnection"

        if (this.config.ConnectedServiceName == Constant.Bad || this.config.ConnectedServiceName == undefined) {

            throw new Error(ExceptionMessages.BadInputGivenFor + ConfigKeys?.ConnectedServiceName);
        }
    }

    private setKVIdentityConfig(){
        this.config.KVIdentityConfig= new KVIdentityConfig()
        
            this.config.KVIdentityConfig.TenantId= process.env['KVTENANTID']
            this.config.KVIdentityConfig.KeyVaultName= process.env['KVNAME']
            this.config.KVIdentityConfig.AuthCertName= process.env['AUTHCERTNAME']
            this.config.KVIdentityConfig.SignCertName= process.env['SIGNCERTNAME']
            this.config.KVIdentityConfig.ClientId= process.env["KVAUTHCLIENT"]
            this.config.KVIdentityConfig.ClientSecret= process.env["KVAUTHSECRET"]
       
        
        this.config.ClientId= this.config.KVIdentityConfig.SignCertName
    }

    private async SetCertificatesInfo(){
        const authSecretCertificate: KeyVaultSecret = await keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig!, this.config.KVIdentityConfig!.AuthCertName!);
        const authCertInfo = convertPFX(authSecretCertificate.value!);
        const authCertificate: KeyVaultCertificateWithPolicy = await keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig!,this.config.KVIdentityConfig!.AuthCertName!);

        var authCer = authCertificate.cer;
        var encodedAuthThumbprint = authCertificate.properties.x509Thumbprint;

       this.config.AuthCertThumbprint = Buffer.from(encodedAuthThumbprint!).toString("hex");
       this.config.AuthPublicCert = Buffer.from(authCer!).toString("base64");
       this.config.AuthPrivateKey = authCertInfo.key;
        
        
        const signSecretCertificate: KeyVaultSecret = await keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig!, this.config.KVIdentityConfig!.SignCertName!);
        const signCertificate: KeyVaultCertificateWithPolicy = await keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig!,this.config.KVIdentityConfig!.SignCertName!);

        const signCertInfo = convertPFX(signSecretCertificate.value!);

        var signCer = signCertificate.cer;
        var encodedSignThumbprint = signCertificate.properties.x509Thumbprint;

        this.config.SignPrivateKey = signCertInfo.key
        this.config.SignPublicCert = Buffer.from(signCer!).toString("base64");
        this.config.SignCertThumbprint = Buffer.from(encodedSignThumbprint!).toString("hex");
        
    }

}