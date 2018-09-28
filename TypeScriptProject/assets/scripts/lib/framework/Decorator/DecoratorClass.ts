import { DecoratorClassBinding } from "./DecoratorClassBinding";
/**
 * 存储装饰器获取的信息
 */
export class DecoratorClass{
    //注入列表
    private _list : DecoratorClassBinding[];
    public get list(){
        return this._list;
    }
    public set list(value : DecoratorClassBinding[]){
        this._list = value;
    }
}