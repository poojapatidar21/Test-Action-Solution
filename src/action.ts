import * as core from "@actions/core"
import { ConfigManager } from "./configManager"

export async function run() {
    try{
        const ConnectedServiceName:string = core.getInput('ConnectedServiceName')
        console.log(ConnectedServiceName)
        
        var configManager= new ConfigManager()
        await configManager.PopulateConfiguration().then(()=>{
            console.log("Config Values Populated successfully.\n")
        }).catch((error:any)=>{
        console.log("Creation of the configManager.config instance failed. \n")
        throw error
        })
    

    } catch(error){
        console.log(error)
    }
    
}
run()