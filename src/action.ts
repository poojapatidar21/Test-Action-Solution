import core from "@actions/core"
export async function run(this:any) {
    try{
        const ConnectedServiceName:string = core.getInput('ConnectedServiceName')
        if (ConnectedServiceName == 'bad' || ConnectedServiceName==undefined){
            console.log("Invalid ConnecterServiceName")
            throw new Error( "Invalid ConnecterServiceName for"+ConnectedServiceName )
        }
        else{
            console.log(ConnectedServiceName)
        }


    } catch(error){
        console.log(error)
    }
    
}