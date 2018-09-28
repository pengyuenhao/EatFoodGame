import { Binding } from "../Bind/Binding";
import {InjectConst} from "./InjectConst";

export class InjectBinding extends Binding{
    protected _isUnbind : boolean = false;
    //默认绑定状态
    protected _bindingType: InjectConst.BindingType = InjectConst.BindingType.DEFAULT;
    //默认自动注入
    protected _isInject: boolean = true;
    //参数
    protected _args: any;
/*     //键值是否为构造函数
    protected _isKeyConstructor = false;
    //值是否为构造函数
    protected _isValueConstructor = false; */

/*     public get isKeyConstructor(){
        return this._isKeyConstructor;
    }
    public get isValueConstructor(){
        return this._isValueConstructor;
    } */
    public get isInject(){
        return this._isInject;
    }
    //参数列表
    public get args() {
        return this._args;
    }
    public get bindingType(){
        return this._bindingType;
    }
    public get isUnbind(){
        return this._isUnbind;
    }
    /**
     * 参数列表
     */
    public toArgs(){
        this._args = arguments;
        if (this._resolver != null){
            this._resolver(this);
        }
        return this;
    }
    /**
     * 设置为单例模式时，每次都会得到相同的实例
     */
	public toSingleton(): InjectBinding
	{
		//如果已经存在一个值了, 那么这次映射就被视为多余的
		if (this._bindingType === InjectConst.BindingType.VALUE){
            return this;
        }
        //设定为单例注入
        this._bindingType = InjectConst.BindingType.SINGLETON;
		if (this._resolver != null){
			this._resolver (this);
		}
		return this;
    }
    /**
     * 设置为解绑时，调用解绑方法将会解绑所有被标记的绑定状态
     */
    public unBind(): InjectBinding{
        this._isUnbind = true;
        return this;
    }
    public toValue(value : any) : InjectBinding{
        this._bindingType = InjectConst.BindingType.VALUE;
        this.setValue(value);
        return this;
    }
    public setValue(o : any) : InjectBinding
    {
        this.to(o);
        return this;
    }
    public toInject( value : boolean) : InjectBinding
    {
        this._isInject = value;
        return this;
    }
    //重写基类的赋值函数
    public to(value : any) : InjectBinding{
        return super.to(value) as InjectBinding;
    }
    public toName(name : any) : InjectBinding{
        return super.toName(name) as InjectBinding;
    }
}