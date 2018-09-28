import { DecoratorClassBinder } from "./DecoratorClassBinder";
export module DecoratorConst {
    /**
     * 全局注册接入点
     * 使用属性的类型和属性的别名识别被注入的属性
     */
    export const DECORATOR_CLASS_BINDER = new DecoratorClassBinder();
}