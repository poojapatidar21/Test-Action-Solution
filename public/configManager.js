"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const config_1 = require("./config");
const configKeys_1 = require("./configKeys");
const keyVaultIndentityConfig_1 = require("./keyVaultIndentityConfig");
const certConverter_1 = require("./certConverter");
const keyVaultUtility = __importStar(require("./keyVaultUtility"));
class ConfigManager {
    constructor(_config) {
        this.config = (_config == undefined ? new config_1.Config() : _config);
    }
    PopulateConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setConfigVariables();
            this.setKVIdentityConfig();
            yield this.SetCertificatesInfo().catch((error) => {
                console.log("Error while fetching Certs and populating Cert info :- \n");
                throw error;
            });
        });
    }
    setConfigVariables() {
        this.config.ConnectedServiceName =
            this.config.Intent = "PackageDistribution";
        this.config.ContentType = "Maven";
        this.config.PackageLocation = "a:/D/Release/filefolder";
        this.config.Owners = "xyz@microsoft.com";
        this.config.Approvers = "abc@microsoft.com";
        this.config.ServiceEndpointUrl = "https://api.esrp.microsoft.com";
        this.config.MainPublisher = "ESRPRELPACMAN";
        this.config.DomainTenantId = "72f988bf-86f1-41af-91ab-2d7cd011db47";
        this.config.ContentOrigin = "azeus";
        this.config.ProductState = "new";
        this.config.Environment = "Developer";
        this.config.Audience = "Workflow.A_S_AV_PackageManager";
        if (this.config.ConnectedServiceName == 'Bad' || this.config.ConnectedServiceName == undefined) {
            throw new Error("Bad input was given for \n" + (configKeys_1.ConfigKeys === null || configKeys_1.ConfigKeys === void 0 ? void 0 : configKeys_1.ConfigKeys.ConnectedServiceName));
        }
    }
    setKVIdentityConfig() {
        this.config.KVIdentityConfig = new keyVaultIndentityConfig_1.KVIdentityConfig();
        if (this.config.Environment != undefined && this.config.Environment == 'Developer') {
            this.config.KVIdentityConfig.ClientId = "1f4aeb8e-6298-435d-a918-e2f4c0d62089";
            this.config.KVIdentityConfig.ClientSecret = "x~c8Q~qu9Il16almyTeM8-WWjjdq.NPhORNW_au1";
            this.config.KVIdentityConfig.TenantId = "eb2b6278-b96d-4200-89a6-bcd387294884";
            this.config.KVIdentityConfig.KeyVaultName = "Keyvault-2-basic";
            this.config.KVIdentityConfig.AuthCertName = "ugm";
            this.config.KVIdentityConfig.SignCertName = "xyz";
        }
        else {
            console.log("Environment is undefined");
        }
    }
    SetCertificatesInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const authSecretCertificate = yield keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.AuthCertName);
            const authCertInfo = (0, certConverter_1.convertPFX)(authSecretCertificate.value);
            const authCertificate = yield keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.AuthCertName);
            var authCer = authCertificate.cer;
            var encodedAuthThumbprint = authCertificate.properties.x509Thumbprint;
            this.config.AuthCertThumbprint = Buffer.from(encodedAuthThumbprint).toString("hex");
            this.config.AuthPrivateKey = authCertInfo.key;
            this.config.AuthPublicCert = Buffer.from(authCer).toString("base64");
            const signSecretCertificate = yield keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.SignCertName);
            const signCertificate = yield keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.SignCertName);
            const signCertInfo = (0, certConverter_1.convertPFX)(signSecretCertificate.value);
            var signCer = signCertificate.cer;
            var encodedSignThumbprint = signCertificate.properties.x509Thumbprint;
            this.config.SignPrivateKey = signCertInfo.key;
            this.config.SignPublicCert = Buffer.from(signCer).toString("base64");
            this.config.SignCertThumbprint = Buffer.from(encodedSignThumbprint).toString("hex");
        });
    }
}
exports.ConfigManager = ConfigManager;
