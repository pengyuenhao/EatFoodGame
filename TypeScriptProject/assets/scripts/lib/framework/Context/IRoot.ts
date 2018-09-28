//namespace ioc{
import { IContext } from "./Context"
import { IConstructorName } from "../IocConst";
export class __IC_Root extends IConstructorName{
    get constructorName(){return "IRoot";}
}
export interface IRoot {
    context: IContext;
}
//}