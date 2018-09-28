import { IConstructorName } from "../IocConst";

//namespace ioc {
export interface IBinding {
    name: any;
    key: any;
    value: any;
    bind(k:any):IBinding;
    to(v:any):IBinding;
    toName(n:any):IBinding;
}
export class __IC_Binding extends IConstructorName{
    get constructorName(){return "IBinding";}
}
export class Binding implements IBinding {
    protected _key: any;
    protected _value: any;
    protected _name: any;
    protected _resolver: any;

    public get key() {
        return this._key;
    }
    public get value() {
        return this._value;
    }
    public get name() {
        return this._name;
    }

    constructor(resolver: any) {
        this._resolver = resolver;

        this._key = null;
        this._value = null;
        this._name = null;
    }

    /**
     * 绑定标志到键值，返回此时的绑定状态。
     * @param key 标志值，可以是需要执行的全局信号名称或枚举
     */
    bind(key) :IBinding{
        this._key = Binding.checkAbstract(key);
        return this;
    }
    /**
     * 从正在绑定状态映射到实例，返回此时的绑定状态。
     * @param value 绑定映射的值
     */
    to(value):IBinding {
        this._value = value;
        if (this._resolver != null)
            this._resolver(this);
        return this;
    }

    /**
     * 实例的别名，用于区分不同的实例，返回此时的绑定状态。
     * @param name 实例的别名
     */
    toName(name):IBinding {
        this._name = name;
        if (this._resolver != null)
            this._resolver(this);
        return this;
    }
    //判断是否为构造函数
    public get isKeyConstructor():boolean{
        return Binding.isConstructor(this._key);
    }
    //判断是否为构造函数
    public get isValueConstructor():boolean{
        return Binding.isConstructor(this._value);
    }
    public static isConstructor(value : object):boolean{
        //如果不是一个函数则绝对不是构造函数
        if(typeof value !== "function"){
            return false;
        }
        //如果不能直接获取原型则不是构造函数
        if(!value.prototype){
            return false;
        }
        return true;
    }
    public static checkAbstract(key){
        //检查被绑定的对象是否为虚类
        let constructorName;
        if(key.constructorName){
            constructorName = key.constructorName;
            //console.info("[转化虚拟类]"+ constructorName);
        }else{
            constructorName = key;
            //console.info("[非虚拟类]"+ constructorName.constructor.name);
        }
        return constructorName;
    }
}
//}