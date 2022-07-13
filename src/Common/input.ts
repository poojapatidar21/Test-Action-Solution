import * as core from "@actions/core"

export class Inputs{
    ConnectedServiceName: string =core.getInput('ConnectedServiceName')
    Intent: string =core.getInput('Intent')
    ContentType: string =core.getInput('ContentType')
    Audience: string =core.getInput('Audience')
    PackageLocation: string =core.getInput('PackageLocation')
    Owners?: string =core.getInput('Owners')
    Approvers?: string =core.getInput('Approvers')
    ContentOrigin:string=core.getInput('ContentOrigin')
    MainPublisher?: string =core.getInput('MainPublisher')
    ServiceEndpointUrl?: string =core.getInput('ServiceEndpointUrl')
    DomainTenantId?: string =core.getInput('DomainTenantId')
    ProductState?:string=core.getInput('ProductState')    
    
}