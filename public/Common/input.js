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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inputs = void 0;
const core = __importStar(require("@actions/core"));
class Inputs {
    constructor() {
        this.ConnectedServiceName = core.getInput('ConnectedServiceName');
        this.Intent = core.getInput('Intent');
        this.ContentType = core.getInput('ContentType');
        this.PackageLocation = core.getInput('PackageLocation');
        this.Owners = core.getInput('Owners');
        this.Approvers = core.getInput('Approvers');
        this.ServiceEndpointUrl = core.getInput('ServiceEndpointUrl');
        this.MainPublisher = core.getInput('MainPublisher');
        this.DomainTenantId = core.getInput('DomainTenantId');
        this.ContentOrigin = core.getInput('ContentOrigin');
        this.ProductState = core.getInput('ProductState');
        this.Audience = core.getInput('Audience');
    }
}
exports.Inputs = Inputs;
