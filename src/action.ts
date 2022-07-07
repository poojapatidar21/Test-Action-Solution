import core from "@actions/core"

export async function run() {
    try{
        const ConnectedServiceName:string = core.getInput('ConnectedServiceName')
        console.log(ConnectedServiceName)
        
    } catch (error){
        if(error instanceof Error) core.setFailed(error.message)
    }
    
}
run()