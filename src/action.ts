import core from "@actions/core"
const ConnectedServiceName:string = core.getInput('ConnectedServiceName')
export async function run(ConnectedServiceName:string) {
    try{
        const ConnectedServic:string = core.getInput('ConnectedServiceName')
        console.log(ConnectedServic)
        if (ConnectedServiceName == '72f988bf-86f1-41af-91ab-2d7cd011db47' ){
            console.log("Valid ConnecterServiceName")
        }
        else{
            console.log("Invalid ConnecterServiceName"+ConnectedServiceName)
        }


    } catch(error){
        console.log(error)
    }
    
}