import * as core from '@actions/core'

async function run():Promise<void> {
    try {
        const ConnectedServiceName:string= core.getInput('ConnectedServiceName')
        console.log(ConnectedServiceName)

        const Intent:string= core.getInput('Intent')
        console.log(Intent)

        const ContentType:string= core.getInput('ContentType')
        console.log(ContentType)

        const PackageLocation:string= core.getInput('PackageLocation')
        console.log(PackageLocation)

        const Owners:string= core.getInput('Owners')
        console.log(Owners)

        const Approvers:string= core.getInput('Approvers')
        console.log(Approvers)

        const ServiceEndpointUrl:string= core.getInput('ServiceEndpointUrl')
        console.log(ServiceEndpointUrl)

        const MainPublisher:string= core.getInput('MainPublisher')
        console.log(MainPublisher)

        const DomainTenantId:string= core.getInput('DomainTenantId')
        console.log(DomainTenantId)

        const ContentOrigin:string= core.getInput('ContentOrigin')
        console.log(ContentOrigin)

        const ProductState:string= core.getInput('ProductState')
        console.log(ProductState)

        const Audience:string= core.getInput('Audience')
        console.log(Audience)


    } catch (error){
        if(error instanceof Error) core.setFailed(error.message)
    }
}

run()