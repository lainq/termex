import axios, { AxiosResponse } from 'axios'
import { greenBright, grey, yellowBright } from 'chalk'
import inquirer from 'inquirer'
import marked from 'marked'
import TerminalRenderer from 'marked-terminal'
import { VERSION } from '../index'
import { getUserPreference } from './settings'

interface GithubReleaseAssets {
    url: string,
    id: number,
    name: string,
    size: number,
    browser_download_url: string
}

interface GithubRelease {
    url: string,
    id: number, 
    tag_name: string,
    name: string,
    assets:Array<GithubReleaseAssets>,
    body: string;
}

export class AutoUpdate {
    private readonly userUpdatePreferences:Map<string, any> = getUserPreference(['getBetaUpdates', 'autoUpdateTermex'])
    
    public isUpdateAvailable() {
        axios.get("https://api.github.com/repos/pranavbaburaj/termex/releases").then((response:AxiosResponse<any>):void => {
            const latestVersion:GithubRelease = response.data[0] as GithubRelease
            const { tag_name, name, body } = latestVersion
            if(tag_name == VERSION){
                return
            }
            marked.setOptions({ renderer: new TerminalRenderer() });
            console.log(greenBright(`Update:${tag_name}`))
            console.log(yellowBright(name))
            console.log(marked(body))

            if(!this.userUpdatePreferences.get("autoUpdateTermex")){
                inquirer.prompt({
                    type: "confirm",
                    message: "New version found. Update?",
                    default: 'y'
                }).then((response:any):void => {
                    // TODO: Implement user permission
                    console.log(response)
                }).catch((exception:any) => {})
            }

        }).catch((exception:any):void => {
            // console.log(redBright(exception))
        })
    }
}

const update = new AutoUpdate().isUpdateAvailable()