export module InjectConst {
    //注入状态类型枚举
    export const enum BindingType
    {
        /// 每次都会创建一个新的对象
        DEFAULT = "Default",
    
        /// 总是使用同一个对象单例
        SINGLETON = "Singleton",
    
        /// 总是相同的对象但参数不同
        VALUE = "Value",
    }
}