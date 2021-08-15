import { Github } from "./gh";
import { Octokit } from "@octokit/core"
import { blueBright, greenBright, redBright, yellowBright } from "chalk";

export class GithubGist {
    private client:Octokit;
    private github:Github;
    private token:string

    constructor(parameters:Array<string>) {
        this.github = new Github()
        this.token = this.github.getPersonalAccessToken()
        this.client = new Octokit({auth:this.token})

        const command:string | undefined = parameters[0]
        if(command == "reset") {
            this.github.reset()
            process.exit()
        } else {
            this.github.authenticate(this.client).then((value:any):void => {
                this.displayGists(this.client)
            }).catch((error:any) => {
                console.log(redBright(error))
                process.exit()
            })
        }
    }

    private displayGists = (client:Octokit):void => {
        const data = this.client.request("GET /gists")
        data.then((response:any):void => {
            const data = response.data
            const gists:Array<any> = Array.from(data).map((element:any):any => {
                return element.id
            })
            gists.forEach((element:any, index:number):void => {
                client.request('GET /gists/{gist_id}', {gist_id: element}).then((response:any):void => {
                    const title:string = response.data.description ? response.data.description : element
                    console.log(`${yellowBright(index)}: ${greenBright(title)}`)
                }).catch((error:any):void => {})
            })
        }).catch((error:any):void => {
            console.log(redBright(error))
            process.exit()
        })
    }
}