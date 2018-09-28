import { InjectBinding } from "./InjectBinding";
import {InjectConst} from "./InjectConst";
import { Binding } from "../Bind/Binding";
/**
 * 注入工厂，负责从给定的构造函数创建对象
 * 可以创建单例
 */
export class InjectFactory{
    /**
     * 根据绑定状态和指定的参数创建或获取实例对象
     * @param binding 绑定状态
     * @param args 参数
     */
    public get(binding:InjectBinding,args : any[]):object{
        //检查绑定状态是否有效
        if (binding == null){
			throw new Error ("InjectorFactory cannot act on null binding");
        }
        //判断注入状态类型
        let bindingType : InjectConst.BindingType = binding.bindingType;
        //根据不同的类型创建
        switch (bindingType)
        {
            case InjectConst.BindingType.SINGLETON:
                return this.singletonOf (binding, args);
                break;
            case InjectConst.BindingType.VALUE:
                return this.valueOf (binding);
                break;
            default:
                break;
        }
        return this.instanceOf (binding, args);
    }
    // 生成一个新的实例
	protected instanceOf( binding : InjectBinding, args : any[]) : any
	{
		if (binding.value != null)
		{
			return this.createFromValue(binding.value, args);
		}
		let value : any = this.generateImplicit(binding.key, args);
		return this.createFromValue(value, args);
    }
    // Call the Activator to attempt instantiation the given object
	protected createFromValue(c : new(...args)=> any, args : any[]) : any
	{
		let instance = null;
		try
		{
			if (args == null || args.length == 0)
			{
				instance = new c();
			}
			else
			{
				instance = new c(args);
			}
		}
		catch
		{
			//No-op
        }
        //if(instance)console.info("[实例化]"+instance.constructor.name);
		return instance;
    }
    protected generateImplicit(key : any, args:any[]):any
    {
        //如果无法直接转换键值为构造函数
        if(!key)return null;
        //检查键值是否为构造函数
        if (Binding.isConstructor(key))
        {
            return this.createFromValue(key, args);
        }
        throw new Error ("InjectorFactory can't instantiate an Interface or Abstract Class. Class: " + key.ToString());
    }
    // Generate a Singleton instance
	protected singletonOf(binding : InjectBinding, args : any[])
	{
		if (binding.value != null)
		{
            let o = this.createFromValue (binding.value, args);
            if (o == null)
                return null;
            binding.setValue(o);
		}
		else
		{
			binding.setValue(this.generateImplicit(binding.key, args));
		}
		return binding.value;
    }
    protected valueOf(binding : InjectBinding)
    {
        return binding.value;
    }
}