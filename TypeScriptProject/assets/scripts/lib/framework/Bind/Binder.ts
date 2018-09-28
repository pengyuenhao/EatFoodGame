import { IBinding,Binding } from "./Binding"
import {BindingConst} from "./BindConst"
import {IConstructorName} from "../IocConst"

export interface IBinder {
    bind(key) : IBinding;
    unbind(key, name);
    //根据绑定器实例生成一个空的绑定状态
    getRawBinding() : IBinding;
    //获取绑定状态
    getBinding(key : any, name : any) : IBinding;
    getBindingMap(key : any) : Map<any,IBinding>;
    resolveBinding( binding : IBinding,  key : any);
}
export class __IC_Binder extends IConstructorName{
    get constructorName(){return "IBinder";}
}
export class Binder implements IBinder {
    //绑定状态映射字典
    protected _bindings: any;
    //绑定状态白名单
    //protected _bindingWhitelist : Array<object> ;
    constructor() {
        this.init();
    }
    /**
     * 初始化函数，通过重写该函数指定映射字典的实例
     */
    init(){
        //初始化绑定状态映射
        this._bindings = new Map < any, Map < any, IBinding >> ();
    }
    /**
     * 解析器，将正在绑定中的状态信息解析，使之成为可存储的数据绑定到映射字典。
     * @param binding 绑定的状态
     */
    resolver(binding: IBinding) {
        let key = binding.key;
        this.resolveBinding(binding,key);
    }
    /**
     * 解析绑定状态
     * @param binding 绑定状态
     * @param key 键值
     */
    resolveBinding( binding : IBinding,  key : any){
        //检查绑定状态是否存在别名
        let bindingName = (binding.name == null) ? BindingConst.NULL : binding.name;
        let dict : Map<any,IBinding>;
        //检查绑定状态字典已经存在键值
        if ((this._bindings.has(key))) {
            //获取绑定映射
            dict = this._bindings.get(key);
            //检查绑定映射是否存在别名
            if (dict.has(bindingName)) {
                //获取已经存在的绑定映射
                let existingBinding = dict.get(bindingName);
                //检查合法性
                if (existingBinding != binding) {
                    //如果绑定值为空
                    if (!existingBinding.value) {
                        //移除无效的绑定别名
                        dict.delete(bindingName);
                    }
                }
            }
        } else {
            //创建绑定映射
            dict = new Map<any,IBinding>();
            //添加绑定映射
            this._bindings.set(key, dict);
        }

        //如果存在默认绑定状态并且等于当前绑定状态
        if (dict.has(BindingConst.NULL) && dict.get(BindingConst.NULL) === binding) {
            //删除默认绑定
            dict.delete(BindingConst.NULL);
        }

        //添加或覆盖绑定状态
        if (!dict.has(bindingName)) {
            dict.set(bindingName, binding);
        }
    }

    /**
     * 绑定信号容器
     * @param key 键值，可以是需要执行的全局信号名称或枚举
     */
    bind(key) : IBinding{
        //创建一个绑定中状态
        let binding = this.getRawBinding();
        
        //绑定标志
        binding.bind(key);
        return binding;
    }
    /**
     * 解除绑定信号容器
     * @param key 键值，需要绑定的键值
     * @param name 别名，被绑定变量的别名
     */
    unbind(key, name) {
        let checkKey = Binding.checkAbstract(key);
        //如果绑定映射字典内包含键值
        if (this._bindings.has(checkKey)) {
            //直接获取键值映射的值
            let dict = this._bindings.get(checkKey);
            //检查是否存指定别名
            let bindingName;
            if(name){
                bindingName = name;
            }else{
                bindingName = BindingConst.NULL;
            }
            if (dict.has(bindingName)) {
                dict.delete(bindingName);
            }
        }
    }
    /**
     * 生成默认的绑定状态
     */
    getRawBinding(): IBinding{
        return new Binding(this.resolver.bind(this));
    }
    /**
     * 根据键值和别名获取绑定器中的绑定状态
     * @param key 键值
     * @param name 别名
     */
    getBinding(key : any, name : any) : IBinding{
        //查找是否存在键值
        if(this._bindings.has (key))
        {
            let dict = this._bindings.get(key);
            //如果别名不存在则使用默认值
            if(!name){
                name = BindingConst.NULL
            }
            //查找绑定状态是否存在别名
            if (dict.has(name))
            {
                return dict.get(name);
            }
            else{
                return null;
            }
        }
    }
    /**
     * 获取绑定状态映射表，返回键值的所有绑定状态
     * @param key 被绑定的键值
     */
    getBindingMap(key : any) : any{
        if(this._bindings.has(key)){
            return this._bindings.get(key);
        }
    }
}
//}