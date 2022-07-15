import { IConfig } from "../../Common/Configuration/iConfig" 

export interface IAuthenticationManager{
    accessToken?: string
    config?: IConfig
    setAccessToken():Promise<string| undefined>
}