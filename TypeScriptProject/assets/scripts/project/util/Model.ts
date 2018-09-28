import { IConstructorName } from "../../lib/framework/IocConst";

export class __IC_Model extends IConstructorName{
    public get constructorName(){
        return "IModel"
    }
}
export interface IModel{

}
/**
 * 数据模型类型枚举
 */
export enum ModelType{
    Main = "Main",

}