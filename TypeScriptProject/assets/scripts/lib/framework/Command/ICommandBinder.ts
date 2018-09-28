import { CommandBinding } from "./CommandBinding";
import { IBinding } from "../Bind/Binding";
import { Binder } from "../Bind/Binder";
import { IConstructorName } from "../IocConst";

export interface ICommandBinder{
    bind (key : any) : CommandBinding;
    getRawBinding():IBinding;
}
export class __IC_CommandBinder extends IConstructorName{
    static get constructorName(){return "ICommandBinder";}
}