
export class ListDirectories {
    private path:string
    private files?:Array<string>
    private parameters:Array<string>
    private showTitle:boolean

    private currentFileIndex:number = 0

    constructor(path:string, parameters:Array<string>, showTitle:boolean = true){
        this.path = path
        this.parameters = parameters
        this.showTitle = showTitle
    }
}