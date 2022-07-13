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
const config_1 = require("../Common/config");
const keyVaultIndentityConfig_1 = require("../Common/keyVaultIndentityConfig");
const certConverter_1 = require("../Common/certConverter");
const keyVaultUtility = __importStar(require("../Common/keyVaultUtility"));
const exceptionMessages_1 = require("../Common/exceptionMessages");
const constants_1 = require("../Common/constants");
const core = __importStar(require("@actions/core"));
const input_1 = require("../Common/input");
class ConfigManager {
    constructor(_config, _input) {
        this.config = (_config == undefined ? new config_1.Config() : _config);
        this.input = (_input == undefined ? new input_1.Inputs() : _input);
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
        this.config.DomainTenantId = this.input.DomainTenantId;
        this.config.ServiceEndpointUrl = this.input.ServiceEndpointUrl;
        // this.config.AppInsightsLoggingKey = "33e01921-4d64-4f8c-a055-5bdaffd5e33d"
        this.config.MainPublisher = core.getInput('MainPublisher');
        this.config.Intent = core.getInput('Intent');
        this.config.ContentType = core.getInput('ContentType');
        this.config.ContentOrigin = core.getInput('ContentOrigin');
        this.config.ProductState = core.getInput('ProductState');
        this.config.Audience = core.getInput('Audience');
        this.config.Environment = "Developer";
        this.config.PackageLocation = core.getInput('PackageLocation');
        this.config.Owners = core.getInput('Owners');
        this.config.Approvers = core.getInput('Approvers');
        this.config.ConnectedServiceName = core.getInput('ConnectedServiceName');
        this.config.StatusPollingInterval = constants_1.Constant.DelayBetweenEveryGetStatus;
    }
    setKVIdentityConfig() {
        this.config.KVIdentityConfig = new keyVaultIndentityConfig_1.KVIdentityConfig();
        this.config.KVIdentityConfig.TenantId = process.env['KVTENANTID'];
        this.config.KVIdentityConfig.KeyVaultName = process.env['KVNAME'];
        this.config.KVIdentityConfig.AuthCertName = process.env['AUTHCERTNAME'];
        this.config.KVIdentityConfig.SignCertName = process.env['SIGNCERTNAME'];
        this.config.KVIdentityConfig.ClientId = process.env["KVAUTHCLIENT"];
        this.config.KVIdentityConfig.ClientSecret = process.env["KVAUTHSECRET"];
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
