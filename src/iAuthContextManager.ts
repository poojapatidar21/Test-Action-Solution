import { IConfig } from "./iConfig";

export interface IAuthenticationManager{
    accessToken?: string
    config?: IConfig
    setAccessToken():Promise<string| undefined>
}