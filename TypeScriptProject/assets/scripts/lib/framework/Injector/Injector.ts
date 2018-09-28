import { InjectFactory } from "./InjectFactory"
import { InjectBinder } from "./InjectBinder";
import { InjectBinding } from "./InjectBinding";
import { InjectConst} from "./InjectConst";
import { DecoratorClass } from "../Decorator/DecoratorClass";
import { DecoratorClassBinder } from "../Decorator/DecoratorClassBinder";
import { Binding } from "../Bind/Binding";

export class Injector{
    public factory : InjectFactory;
    public binder : InjectBinder;
    public injectClassBinder : DecoratorClassBinder;

    constructor(){
        this.factory = new InjectFactory();
    }
    public uninject(target)
    {
        if(!this.binder||!target)throw new Error("Attempt to inject into Injector without a Binder or null instance");
        //排除一些不能被注入的类型
        let type : any = typeof target;
        if (type === "string" || type === "boolean"||type === "number" ||type === "symbol"||type === "undefined" || type === "function")
        {
            return target;
        }
        //获取注入类
        let injectClass : DecoratorClass = this.injectClassBinder.get(target);
        this.decoratorUnInject (target, injectClass);
    }
    private decoratorUnInject(target : any, injectClass : DecoratorClass){
        let that = this;
        //遍历注入类
        injectClass.list.forEach((binding)=>{
            //尝试获绑定状态
            let injectBinding = that.binder.getBinding(binding.value,binding.name);
            //不能注入一个未绑定的值
            if(injectBinding){
                //将注入值赋给目标对象
                target[binding.property] = null;
            }
        })
    }
    //实例化对象
    public instantiate(binding : InjectBinding,tryInjectHere : boolean) : object{
        //检查是否具备注入条件
        if(!this.binder||!this.factory)throw new Error("Attempt to instantiate from Injector without a Binder or inject into Injector without a Factory");
        //构造函数
        let constructor = null;
        //实例对象
        let instance : object = null;
        //检查绑定状态的值是否为构造函数
        if (binding.isValueConstructor){
            //传入构造函数
            constructor = binding.value;
        }else{
            //直接赋值
            instance = binding.value;
        }
        //如果没有设置注入值但是键值是一个构造函数
        if(!constructor&&binding.isKeyConstructor){
            //指定绑定状态的键值为构造函数
            constructor = binding.key;
        }
        //如果没有直接赋值实例并且存在构造函数
        if(!instance && constructor){
            //参数
            let args = binding.args;
            instance = this.factory.get(binding, args);
            //如果尝试在这里直接注入
            if (tryInjectHere)
            {
                this.tryInject(binding, instance);
            }
        }
        return instance;
    }
    public tryInject(binding : InjectBinding, target : any)
    {
        //如果工厂不能创建实例则这里直接返回
        if (target != null)
        {
            if (binding.isInject)
            {
                target = this.inject(target, false);
            }

            if (binding.bindingType == InjectConst.BindingType.SINGLETON || binding.bindingType == InjectConst.BindingType.VALUE)
            {
                //prevent double-injection
                binding.toInject(false);
            }
        }
        return target;
    }
    //注入目标中所有被@Inject标记的属性
    public inject(target : object, attemptConstructorInjection : boolean) : any
    {
        if(!this.binder||!target)throw new Error("Attempt to inject into Injector without a Binder or null instance");
        //排除一些不能被注入的类型
        let type : any = typeof target;
        if (type === "string" || type === "boolean"||type === "number" ||type === "symbol"||type === "undefined" || type === "function")
        {
            return target;
        }
        //因为TS中无法获得类型名称，所以使用目标的构造函数名称代替类型名称
        //let typeName : string = target.constructor;
        //获取注入类
        let injectClass : DecoratorClass = this.injectClassBinder.get(target);
        //是否允许使用构造器注入
        if (attemptConstructorInjection)
        {
            //target = performConstructorInject(target, reflection);
        }
        this.decoratorInject(target,injectClass);
        //performSetterInject(target, reflection);
        //postInject(target, reflection);
        return target;
    }
    /**
     * 装饰器注入，使用注入类进行注入
     */
    private decoratorInject(target : any, injectClass : DecoratorClass){
        let that = this;
        //遍历注入类
        injectClass.list.forEach((binding)=>{
            //console.info("[装饰器注入]"+binding.value + "[别名]"+binding.name);
            //尝试获绑定状态
            let injectBinding = that.binder.getBinding(binding.value,binding.name);
            //不能注入一个未绑定的值
            if(injectBinding){
                let instance = that.getInjectValue(injectBinding.key,injectBinding.name);
                //将注入值赋给目标对象
                target[binding.property] = instance;
            }
        })
    }
    /**
     * 获取需要注入的值，这个过程会递归调用
     * @see 注意循环依赖会严重消耗性能
     */
    private getInjectValue(type,name):object{
        //尝试获取绑定状态
        let binding = this.binder.getBinding(type,name);
        if(!binding)return null;
        //if(binding.key.name)console.info("[获取注入值]"+binding.key.name+"[别名]"+name+"[绑定状态]"+binding.bindingType + ","+binding.isInject);
        //else console.info("[获取注入值]"+binding.key+"[别名]"+name+"[绑定状态]"+binding.bindingType + "[需要注入]"+binding.isInject);
        //如果是值类型绑定
        if(binding.bindingType === InjectConst.BindingType.VALUE){
            //如果需要注入
            if(binding.isInject){
                //if(Binding.isConstructor(binding.value))console.info("[对值(构造函数))]"+binding.value.constructor.name + "[进行注入]");
                //else console.info("[对值(对象)]"+binding.value.__proto__.constructor + "[进行注入]");

                let injv = this.inject (binding.value, false);
                binding.toInject (false);

                //if(binding.key.name)console.info("[绑定状态]"+binding.key.name+"[完成注入]"+binding.isInject);
                //else console.info("[绑定状态]"+binding.key+"[完成注入]"+binding.isInject);

                return injv;
            }else{
                return binding.value;
            }
        //如果是单例注入
        }else if (binding.bindingType == InjectConst.BindingType.SINGLETON){
            //如果绑定状态的值是一个构造函数
            if (binding.isValueConstructor || binding.value == null)
            {
                this.instantiate (binding, true);
            }
            return binding.value;
        }else{
            return this.instantiate(binding,true);
        }
    }
    /*     //构造器注入，未实现
    private performConstructorInject(){

    } */
    /* //属性设置器注入，未实现
    performSetterInject(){

    } */
    /*     //方法注入，未实现
    postInject(){

    } */
}