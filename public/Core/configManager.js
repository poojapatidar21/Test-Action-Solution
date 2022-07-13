"use strict" 
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k 
    var desc = Object.getOwnPropertyDescriptor(m, k) 
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]  } } 
    }
    Object.defineProperty(o, k2, desc) 
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k 
    o[k2] = m[k] 
})) 
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v }) 
}) : function(o, v) {
    o["default"] = v 
}) 
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod 
    var result = {} 
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k) 
    __setModuleDefault(result, mod) 
    return result 
} 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value)  })  }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value))  } catch (e) { reject(e)  } }
        function rejected(value) { try { step(generator["throw"](value))  } catch (e) { reject(e)  } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)  }
        step((generator = generator.apply(thisArg, _arguments || [])).next()) 
    }) 
} 
Object.defineProperty(exports, "__esModule", { value: true }) 
exports.ConfigManager = void 0 
const config_1 = require("../Common/config") 
const configKeys_1 = require("../Common/configKeys") 
const keyVaultIndentityConfig_1 = require("../Common/keyVaultIndentityConfig") 
const certConverter_1 = require("../Common/certConverter") 
const keyVaultUtility = __importStar(require("../Common/keyVaultUtility")) 
const exceptionMessages_1 = require("../Common/exceptionMessages") 
const constants_1 = require("../Common/constants") 
class ConfigManager {
    constructor(_config) {
        this.config = (_config == undefined ? new config_1.Config() : _config) 
    }
    PopulateConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setConfigVariables() 
            this.setKVIdentityConfig() 
            yield this.SetCertificatesInfo().catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.CertPopulatingError) 
                throw error 
            }) 
        }) 
    }
    setConfigVariables() {
        this.config.DomainTenantId = "72f988bf-86f1-41af-91ab-2d7cd011db47" 
        this.config.ServiceEndpointUrl = 'https://api.esrp.microsoft.com' 
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
        this.config.StatusPollingInterval = constants_1.Constant.DelayBetweenEveryGetStatus 
        this.config.ConnectedServiceName = "ReleaseServiceConnection" 
        if (this.config.ConnectedServiceName == constants_1.Constant.Bad || this.config.ConnectedServiceName == undefined) {
            throw new Error(exceptionMessages_1.ExceptionMessages.BadInputGivenFor + (configKeys_1.ConfigKeys === null || configKeys_1.ConfigKeys === void 0 ? void 0 : configKeys_1.ConfigKeys.ConnectedServiceName)) 
        }
    }
    setKVIdentityConfig() {
        this.config.KVIdentityConfig = new keyVaultIndentityConfig_1.KVIdentityConfig() 
        if (this.config.Environment != undefined && this.config.Environment == 'Developer') {
            this.config.KVIdentityConfig.TenantId = "33e01921-4d64-4f8c-a055-5bdaffd5e33d" 
            this.config.KVIdentityConfig.KeyVaultName = "esrprelease-test-prod" 
            this.config.KVIdentityConfig.AuthCertName = "74cd0b2a-8473-475e-9bfd-445ec0847a84" 
            this.config.KVIdentityConfig.SignCertName = "74cd0b2a-8473-475e-9bfd-445ec0847a84" 
            this.config.KVIdentityConfig.ClientId = process.env["KVAUTHCLIENT"] 
            this.config.KVIdentityConfig.ClientSecret = process.env["KVAUTHSECRET"] 
        }
        else {
            console.log("Environment is undefined") 
        }
        this.config.ClientId = this.config.KVIdentityConfig.SignCertName 
    }
    SetCertificatesInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const authSecretCertificate = yield keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.AuthCertName) 
            const authCertInfo = (0, certConverter_1.convertPFX)(authSecretCertificate.value) 
            const authCertificate = yield keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.AuthCertName) 
            var authCer = authCertificate.cer 
            var encodedAuthThumbprint = authCertificate.properties.x509Thumbprint 
            this.config.AuthCertThumbprint = Buffer.from(encodedAuthThumbprint).toString("hex") 
            this.config.AuthPublicCert = Buffer.from(authCer).toString("base64") 
            this.config.AuthPrivateKey = authCertInfo.key 
            const signSecretCertificate = yield keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.SignCertName) 
            const signCertificate = yield keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.SignCertName) 
            const signCertInfo = (0, certConverter_1.convertPFX)(signSecretCertificate.value) 
            var signCer = signCertificate.cer 
            var encodedSignThumbprint = signCertificate.properties.x509Thumbprint 
            this.config.SignPrivateKey = signCertInfo.key 
            this.config.SignPublicCert = Buffer.from(signCer).toString("base64") 
            this.config.SignCertThumbprint = Buffer.from(encodedSignThumbprint).toString("hex") 
        }) 
    }
}
exports.ConfigManager = ConfigManager 
