import * as core from "@actions/core";
import { IConfig } from "./iConfig";

export class Inputs{
    ConnectedServiceName?: string 
    Intent?: string 
    ContentType?: string 
    ContentOrigin?: string 
    Audience?: string 
    PackageLocation?: string 
    Owners?: string 
    Approvers?: string 
    MainPublisher?: string  
    ServiceEndpointUrl?: string 
    StatusPollingInterval?: number 
    Environment?: string 
    RequestCorrelationId?: string 
    DomainTenantId?: string 
    ProductState?:string

    constructor(){
    
    this.ConnectedServiceName=core.getInput('ConnectedServiceName')
    this.Intent=core.getInput('Intent')
    this.ContentType=core.getInput('ContentType')
    this.PackageLocation=core.getInput('PackageLocation')
    this.Owners=core.getInput('Owners')
    this.Approvers=core.getInput('Approvers')
    this.ServiceEndpointUrl=core.getInput('ServiceEndpointUrl')
    this.MainPublisher=core.getInput('MainPublisher')
    this.DomainTenantId=core.getInput('DomainTenantId')
    this.ContentOrigin=core.getInput('ContentOrigin')
    this.ProductState=core.getInput('ProductState')
    this.Audience=core.getInput('Audience')
    }
    
}