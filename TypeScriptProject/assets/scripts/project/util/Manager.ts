import { IConstructorName } from "../../lib/framework/IocConst";

export class __IC_Manager extends IConstructorName{
    public get constructorName(){
        return "IManager";
    }
}
export interface IManager{

}
/**
 * 管理器类型枚举
 */
export enum ManagerType{
    Resource = "Resource",

}