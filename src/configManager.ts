import { IConfig } from "./iConfig";
import { Config } from "./config";
import { ConfigKeys } from "./configKeys";
import { KVIdentityConfig } from "./keyVaultIndentityConfig";
import { KeyVaultSecret } from "@azure/keyvault-secrets";
import { KeyVaultCertificateWithPolicy } from "@azure/keyvault-certificates";
import { convertPFX } from "./certConverter";
import * as keyVaultUtility from "./keyVaultUtility";


export class ConfigManager{
    config: IConfig
    public constructor(_config?:IConfig){
        this.config=(_config==undefined?new Config():_config)
    }

    public async PopulateConfiguration(){
        this.setConfigVariables()
        this.setKVIdentityConfig()
        await this.SetCertificatesInfo().catch((error) => {
            console.log("Error while fetching Certs and populating Cert info :- \n")
            throw error;
        });
    }

    private setConfigVariables(){
        this.config.ConnectedServiceName=
        this.config.Intent= "PackageDistribution"
        this.config.ContentType= "Maven"
        this.config.PackageLocation="a:/D/Release/filefolder"
        this.config.Owners= "xyz@microsoft.com"
        this.config.Approvers= "abc@microsoft.com"
        this.config.ServiceEndpointUrl= "https://api.esrp.microsoft.com"
        this.config.MainPublisher= "ESRPRELPACMAN"
        this.config.DomainTenantId= "72f988bf-86f1-41af-91ab-2d7cd011db47"
        this.config.ContentOrigin= "azeus"
        this.config.ProductState= "new"
        this.config.Environment= "Developer"
        this.config.Audience= "Workflow.A_S_AV_PackageManager"

        if (this.config.ConnectedServiceName == 'Bad' || this.config.ConnectedServiceName == undefined) {

            throw new Error("Bad input was given for \n" + ConfigKeys?.ConnectedServiceName);
        }
    }

    private setKVIdentityConfig(){
        this.config.KVIdentityConfig= new KVIdentityConfig()
        if (this.config.Environment!=undefined && this.config.Environment== 'Developer'){
            this.config.KVIdentityConfig.ClientId= "1f4aeb8e-6298-435d-a918-e2f4c0d62089"
            this.config.KVIdentityConfig.ClientSecret= "x~c8Q~qu9Il16almyTeM8-WWjjdq.NPhORNW_au1"
            this.config.KVIdentityConfig.TenantId= "eb2b6278-b96d-4200-89a6-bcd387294884"
            this.config.KVIdentityConfig.KeyVaultName= "Keyvault-2-basic"
            this.config.KVIdentityConfig.AuthCertName= "Package-Maven"
            // this.config.KVIdentityConfig.SignCertName= "xyz"
        }
        else {
            console.log("Environment is undefined")
        }
    }

    private async SetCertificatesInfo(){
        const authSecretCertificate:KeyVaultSecret=await keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig!, this.config.KVIdentityConfig!.AuthCertName!)
        const authCertInfo = convertPFX(authSecretCertificate.value!)
        const authCertificate:KeyVaultCertificateWithPolicy= await keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig! , this.config.KVIdentityConfig!.AuthCertName!)
        
        var authCer= authCertificate.cer
        var encodedAuthThumbprint= authCertificate.properties.x509Thumbprint
        
        this.config.AuthCertThumbprint=Buffer.from(encodedAuthThumbprint!).toString("hex")
        this.config.AuthPrivateKey=authCertInfo.key
        this.config.AuthPublicCert=Buffer.from(authCer!).toString("base64")

        
        
        // const signSecretCertificate: KeyVaultSecret = await keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig!, this.config.KVIdentityConfig!.SignCertName!);
        // const signCertificate: KeyVaultCertificateWithPolicy = await keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig!,this.config.KVIdentityConfig!.SignCertName!);

        // const signCertInfo = convertPFX(signSecretCertificate.value!);

        // var signCer = signCertificate.cer;
        // var encodedSignThumbprint = signCertificate.properties.x509Thumbprint;

        // this.config.SignPrivateKey = signCertInfo.key
        // this.config.SignPublicCert = Buffer.from(signCer!).toString("base64");
        // this.config.SignCertThumbprint = Buffer.from(encodedSignThumbprint!).toString("hex");
        
    }

}