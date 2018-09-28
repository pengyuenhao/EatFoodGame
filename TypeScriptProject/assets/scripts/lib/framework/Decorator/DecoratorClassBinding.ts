import { Binding } from "../Bind/Binding";

export class DecoratorClassBinding extends Binding{
    protected _property: any;
    public get property(){
        return this._property;
    }
    
    /**
     * 从正在绑定状态映射到属性，返回此时的绑定状态。
     * @param property 绑定映射的值
     */
    toProperty(property : any):DecoratorClassBinding {
        this._property = property;
        if (this._resolver != null)
            this._resolver(this);
        return this;
    }
    //重写绑定到值
    to(value : any):DecoratorClassBinding{
        return super.to(value) as DecoratorClassBinding;
    }
    //重写绑定别名
    toName(name : any) : DecoratorClassBinding{
        return super.toName(name) as DecoratorClassBinding;
    }
}