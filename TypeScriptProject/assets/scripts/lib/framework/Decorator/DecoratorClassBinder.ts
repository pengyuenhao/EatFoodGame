import {Binder} from "../Bind/Binder";
import {BindingConst} from "../Bind/BindConst";
import {DecoratorClass} from "./DecoratorClass";
import {DecoratorClassBinding} from "./DecoratorClassBinding";
import {IBinding, Binding} from "../Bind/Binding";
import { Prototype } from "../../Extensions/Prototype";

export class DecoratorClassBinder extends Binder {
    //重写绑定状态映射字典Map< 被注入的类名, Map< 属性名 ，Map< 属性别名 , 绑定状态>>>
    protected _bindings: Map < any, Map < any, Map < any, DecoratorClassBinding >>> ;
    private _decoratorClassBufferMap : Map<any,DecoratorClass>;

    //重写初始化函数
    init() {
        //初始化绑定状态映射
        this._bindings = new Map < any, Map < any, Map < any, DecoratorClassBinding >>> ();
        //初始化缓存映射
        this._decoratorClassBufferMap = new Map<any,DecoratorClass>();
    }
    //检查是否存在指定的键值
    public has(key):boolean{
        return this._bindings.has(key);
    }
    //获取需要注入的类型数据
    public get(target: any): DecoratorClass {
        //检查是否为实例
        if (!(target instanceof Object)) throw new Error("proto must is a object but" + target + "is not");
        //检查是否存在缓存
        if(!this._decoratorClassBufferMap.has(target)){
            //获取继承列表
            let extendsList = Prototype.getPrototypeList(target);

            let injectClass: DecoratorClass = new DecoratorClass();
            let list = [];
            let dict: Map < any, Map < any, DecoratorClassBinding >> ;
            let that = this;
            let bindingMaps = [];
            if (extendsList && extendsList.length > 0) {
                for(let i = 0 ; i<extendsList.length ; i++){
                    dict = that.getBindingMap(extendsList[i]);
                    if(dict&&dict.size>0){
                        dict.forEach(function(inside) {
                            bindingMaps.push(inside);
                        });
                    }
                }
            }
            let inside : Map<any,DecoratorClassBinding>;
            if (bindingMaps && bindingMaps.length > 0) {
                for(let i = 0; i <bindingMaps.length;i++){
                    inside = bindingMaps[i];
                    if(inside&&inside.size>0){
                        let values = inside.values();
                        for (let j =0;j<inside.size;j++) {
                            let binding = values.next();
                            list.push(binding.value);
                        }
                    }
                }
            }
            injectClass.list = list;
            //添加缓存
            this._decoratorClassBufferMap.set(target,injectClass);
        }
        //从缓存映射中获取对应的列表
        return this._decoratorClassBufferMap.get(target);
    }
    //重写绑定方法
    public bind(key: any): DecoratorClassBinding {
        return super.bind(key) as DecoratorClassBinding;
    }
    //重写获取绑定状态方法
    public getBinding(key, name): DecoratorClassBinding {
        return super.getBinding(key, name) as DecoratorClassBinding
    }
    //重写绑定获取方法
    public getRawBinding(): IBinding {
        return new DecoratorClassBinding(this.resolver.bind(this));
    }
    //重写解析器
    public resolver(binding: IBinding) {
        super.resolver(binding);
    }
    /**
     * 重写解析绑定状态
     * @param binding 绑定状态
     * @param key 键值
     */
    resolveBinding(binding: DecoratorClassBinding, key: any) {
        //绑定状态必须有属性名
        if (!binding.property) return;
        //检查绑定状态是否存在别名
        let bindingName = (binding.name == null) ? BindingConst.NULL : binding.name;
        let dict: Map < any, Map < any, DecoratorClassBinding >> ;
        //检查绑定状态字典已经存在键值
        if ((this._bindings.has(key))) {
            //获取绑定映射
            dict = this._bindings.get(key);
            //检查绑定映射是否存在别名
            if (dict.has(bindingName)) {
                //获取内部映射
                let insideDict = dict.get(bindingName);
                //检查映射内是否存在属性名
                if (insideDict.has(binding.property)) {
                    let existingBinding = insideDict.get(binding.property);
                    //如果存在绑定状态
                    if (existingBinding) {
                        //检查存在对应状态绑定是否于当前相等
                        if (existingBinding != binding) {
                            //如果绑定值为空
                            if (!existingBinding.value) {
                                //移除无效的绑定别名
                                dict.delete(bindingName);
                            }
                        }
                    }
                }
            }
        } else {
            //创建绑定映射Map< 别名, Map< 属性名, 绑定状态 >
            dict = new Map < any, Map < any, DecoratorClassBinding >> ();
            //添加绑定映射
            this._bindings.set(key, dict);
        }

        //如果存在默认绑定状态并且等于当前绑定状态
        if (dict.has(BindingConst.NULL)) {
            let insideDic = dict.get(BindingConst.NULL);
            if (insideDic.has(binding.property)) {
                let existingBinding = insideDic.get(binding.property);
                if (binding.property === binding) {
                    //删除默认绑定
                    insideDic.delete(BindingConst.NULL);
                }
            }

        }
        let insideDict;
        //添加或覆盖绑定状态
        if (!dict.has(bindingName)) {
            //创建内部映射
            insideDict = new Map < any, DecoratorClassBinding > ();
            //映射绑定状态
            insideDict.set(binding.property, binding);
            //映射绑定
            dict.set(bindingName, insideDict);
        } else {
            //获取内部映射
            insideDict = dict.get(bindingName);
            //检查是否存在属性名映射
            if (!insideDict.has(binding.property)) {
                //映射绑定
                insideDict.set(binding.property, binding)
            }
        }
    }
    /**
     * 重写获取绑定状态映射表，返回键值的所有绑定状态
     * @param key 被绑定的键值
     */
    getBindingMap(key: any): Map < any, Map < any, DecoratorClassBinding >> {
        if (this._bindings.has(key)) {
            return this._bindings.get(key);
        }
    }
}