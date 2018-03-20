declare class JSDictionary
{
    public datas:Object;

    public map(key:any, value:any):void;
    public unmap(key:any):void;
    public get(key:any):any;
    public has(key:any):boolean;
    public clear():void;
    public isEmpty():boolean;
    public forEach(callback:(key:any, value:any) => void):void;
    public length():number;

    public static getUID(key:any):any;
    public static hasKeys(obj:Object):boolean;
}

export default JSDictionary;