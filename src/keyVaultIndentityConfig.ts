import { IKVIdentityConfig } from "./iKeyVaultIdentityConfig";

export class KVIdentityConfig implements IKVIdentityConfig {
    TenantId?: string;
    ClientId?: string;
    ClientSecret?: string;
    KeyVaultName?: string;
    AuthCertName?: string;
    SignCertName?: string;

    constructor() {
        this.TenantId=undefined
        this.ClientId=undefined
        this.ClientSecret=undefined
        this.KeyVaultName=undefined
        this.AuthCertName=undefined
        this.SignCertName=undefined
    }
}