import * as core from "@actions/core"

export async function run() {
    try{
        const ConnectedServiceName:string = core.getInput('ConnectedServiceName')
        console.log(ConnectedServiceName)
        if (ConnectedServiceName === '72f988bf-86f1-41af-91ab-2d7cd011db47' ){
            console.log("Valid ConnecterServiceName")
        }
        else{
            console.log("Invalid ConnecterServiceName"+ConnectedServiceName)
        }


    } catch(error){
        console.log(error)
    }
    
}
run()