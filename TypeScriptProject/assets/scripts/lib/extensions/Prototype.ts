/**
 * 原型缓存字典，用于检测一个对象的基类
 */
export class Prototype {
    //继承映射表
    private static prototypeMap = new Map<Object,Set<Object>>();
    /**
     * 基类检测函数
     * @param instance 实例
     * @param prototype 基类
     */
    public static isProtetype(type, prototype): boolean {
        //let b = type instanceof prototype;
        return type instanceof prototype;
/*         if(!(type instanceof Object))return false;
        let constructor = type.constructor;
        if(this.prototypeMap.has(constructor)){
            let sett = this.prototypeMap.get(constructor);
            if(sett.has(prototype)){
                return true;
            }else{
                return false;
            }
        }
        return false; */
    }
    /**
     * 获取继承列表
     * @param instance 实例
     */
    public static getPrototypeList(target) {
        let that = this;
        if(!this.hasPrototypeList(target)){
            let extendsList;
            //获取继承列表
            extendsList = [];
            //用构造函数代替类型来使用
            let types = [];
            //types.push(target.constructor);
            //继承类型
            let prototype = target.__proto__;
            //构造函数
            let constructor;
            while (true) {
                //如果继承存在
                if (prototype) {
                    //因为压缩代码会把所有对象的名称都压缩掉，所以这里使用构造函数作为键值
                    constructor = prototype.constructor;
                    //搜索到基类一层
                    if (constructor === Object) break;
                    //排除以__IC__开头模拟接口的临时替代类型
                    if (!constructor.name.startsWith("__IC_")) {
                        extendsList.push(constructor);
                        types.push(constructor);
                        //为每一个类都添加继承关系
                        types.forEach(type => {
                            that.AddPrototype(type,constructor);
                        });
                    }
                    prototype = prototype.__proto__;
                } else {
                    break;
                }
            }

        }            
        let values = this.prototypeMap.get(target.constructor);
        return Array.from(values);
    }
    /**
     * 添加继承关系
     */
    public static AddPrototype(tpye,prototype){
        let extendSet : Set<Object>;
        if(this.prototypeMap.has(tpye)){
            extendSet = this.prototypeMap.get(tpye);
        }else{
            extendSet = new Set();
            this.prototypeMap.set(tpye,extendSet);
        }
        //为继承队列加入新的继承
        extendSet.add(prototype);
    }
    /**
     * 是否存在继承列表
     * @param instance 实例
     */
    public static hasPrototypeList(target) {
        if(this.prototypeMap.has(target.constructor)){
            return true;
        }else{
            return false;
        }
    }
}