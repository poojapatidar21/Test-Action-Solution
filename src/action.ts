import core from "@actions/core"
export async function run(this:any) {
    try{
        const ConnectedServiceName:string = '72f988bf-86f1-41af-91ab-2d7cd011db47'
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