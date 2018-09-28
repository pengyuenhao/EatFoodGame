import { IConstructorName } from "../../lib/framework/IocConst";

export class __IC_Util extends IConstructorName{
    public get constructorName(){
        return "IUtil";
    }
}
export interface IUtil{

}
/**
 * 工具类型枚举
 */
export enum UtilType{
    Main = "Main",
    Audio = "Audio",
    Touch = "Touch",
}