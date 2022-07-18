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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
const config_1 = require("../../Common/Configuration/config");
const configKeys_1 = require("../../Common/Configuration/configKeys");
const keyVaultIndentityConfig_1 = require("../../Common/Configuration/keyVaultIndentityConfig");
const certConverter_1 = require("../../Common/Utilities/certConverter");
const keyVaultUtility = __importStar(require("../../Common/Utilities/keyVaultUtility"));
const exceptionMessages_1 = require("../../Common/Exceptions/exceptionMessages");
const constants_1 = require("../../Common/Configuration/constants");
const tl = require("azure-pipelines-task-lib/task");
const path_1 = __importDefault(require("path"));
class ConfigManager {
    constructor(_config) {
        this.config = (_config == undefined ? new config_1.Config() : _config);
    }
    PopulateConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setConfigVariables();
            this.setKVIdentityConfig();
            yield this.SetCertificatesInfo().catch((error) => {
                console.log(exceptionMessages_1.ExceptionMessages.CertPopulatingError);
                throw error;
            });
        });
    }
    setConfigVariables() {
        this.config.DomainTenantId = tl.getInput(configKeys_1.ConfigKeys.DomainTenantId);
        this.config.ServiceEndpointUrl = tl.getInput(configKeys_1.ConfigKeys.ServiceEndpointUrl);
        this.config.AppInsightsLoggingKey = constants_1.Constant.AppInsightsLoggingKey;
        this.config.MainPublisher = tl.getInput(configKeys_1.ConfigKeys.MainPublisher);
        this.config.Intent = tl.getInput(configKeys_1.ConfigKeys.Intent);
        this.config.ContentType = tl.getInput(configKeys_1.ConfigKeys.ContentType);
        this.config.ContentOrigin = tl.getInput(configKeys_1.ConfigKeys.ContentOrigin);
        this.config.ProductState = tl.getInput(configKeys_1.ConfigKeys.ProductState);
        this.config.Audience = tl.getInput(configKeys_1.ConfigKeys.Audience);
        this.config.Environment = tl.getInput(configKeys_1.ConfigKeys.Environment);
        this.config.PackageLocation = tl.getInput(configKeys_1.ConfigKeys.PackageLocation);
        this.config.Owners = tl.getInput(configKeys_1.ConfigKeys.Owners);
        this.config.Approvers = tl.getInput(configKeys_1.ConfigKeys.Approvers);
        this.config.StatusPollingInterval = constants_1.Constant.DelayBetweenEveryGetStatus;
        tl.setResourcePath(path_1.default.join(__dirname, constants_1.Constant.TaskJsonDistanceFromManagerFolder));
        this.config.ConnectedServiceName = tl.getInput(configKeys_1.ConfigKeys.ConnectedServiceName, true);
        if (this.config.ConnectedServiceName == constants_1.Constant.Bad || this.config.ConnectedServiceName == undefined) {
            throw new Error(exceptionMessages_1.ExceptionMessages.BadInputGivenFor + (configKeys_1.ConfigKeys === null || configKeys_1.ConfigKeys === void 0 ? void 0 : configKeys_1.ConfigKeys.ConnectedServiceName));
        }
    }
    setKVIdentityConfig() {
        this.config.KVIdentityConfig = new keyVaultIndentityConfig_1.KVIdentityConfig();
        if (this.config.Environment != undefined && this.config.Environment == constants_1.Constant.Developer) {
            this.config.KVIdentityConfig.ClientId = tl.getInput(configKeys_1.ConfigKeys.KvClientId, true);
            this.config.KVIdentityConfig.TenantId = tl.getInput(configKeys_1.ConfigKeys.KvTenantId, true);
            this.config.KVIdentityConfig.KeyVaultName = tl.getInput(configKeys_1.ConfigKeys.KvKeyVaultName, true);
            this.config.KVIdentityConfig.AuthCertName = tl.getInput(configKeys_1.ConfigKeys.KvAuthCertName, true);
            this.config.KVIdentityConfig.SignCertName = tl.getInput(configKeys_1.ConfigKeys.KvSignCertName, true);
            this.config.KVIdentityConfig.ClientSecret = tl.getInput(configKeys_1.ConfigKeys.KvSecret, true);
        }
        else {
            try {
                this.config.KVIdentityConfig.ClientId = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName, configKeys_1.ConfigKeys.Username, true);
                this.config.KVIdentityConfig.ClientSecret = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName, configKeys_1.ConfigKeys.Password, true);
                this.config.KVIdentityConfig.TenantId = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName, configKeys_1.ConfigKeys.TenantId, true);
                this.config.KVIdentityConfig.KeyVaultName = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName, configKeys_1.ConfigKeys.KeyVaultName, true);
                this.config.KVIdentityConfig.AuthCertName = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName, configKeys_1.ConfigKeys.AuthCertName, true);
                this.config.KVIdentityConfig.SignCertName = tl.getEndpointAuthorizationParameter(this.config.ConnectedServiceName, configKeys_1.ConfigKeys.SignCertName, true);
            }
            catch (error) {
                console.log(exceptionMessages_1.ExceptionMessages.KVConfigSetUpError);
                throw error;
            }
        }
        this.config.ClientId = this.config.KVIdentityConfig.SignCertName;
    }
    SetCertificatesInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const authSecretCertificate = yield keyVaultUtility.FetchCertFromSecretClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.AuthCertName);
            const authCertInfo = (0, certConverter_1.convertPFX)(authSecretCertificate.value);
            const authCertificate = yield keyVaultUtility.FetchCertFromCertificateClient(this.config.KVIdentityConfig, this.config.KVIdentityConfig.AuthCertName);
            var authCer = authCertificate.cer;
            var encodedAuthThumbprint = authCertificate.properties.x509Thumbprint;
            this.config.AuthCertThumbprint = Buffer.from(encodedAuthThumbprint).toString("hex");
            this.config.AuthPublicCert = Buffer.from(authCer).toString("base64");
            this.config.AuthPrivateKey = authCertInfo.key;
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
