import {DecoratorConst} from "../Decorator/DecoratorConst"
import { Binding } from "../Bind/Binding";
//全局注入数据绑定器
const ClassBinder = DecoratorConst.DECORATOR_CLASS_BINDER;
/**
 * 注入装饰器模块
 * 因为TS的类型系统仅可以用于检查语法错误，而在编译为JS后不再有类型系统，所以无法在TS中存储类型数据
 * 并且在微信环境下是无法使用反射库和动态代码，至少现在还不行。
 * 为了实现注入功能，这里采用类的构造函数作为类型数据，以构造函数的name属性作为类型的名称，又因接口没有构造函数
 * 所以统一采用添加 __IC_ 前缀的模拟接口名方式间接存储接口数据，因为装饰器会在程序运行的起始阶段执行，所以使用一个全局变量存储这些数据
 * @see 注意：所有的__IC_类均需要实现IConstructorName接口
 * @example
 * class{
 *  @inject(constructor)
 *  anyclass:T;
 * }
 */
export function inject < T > (str: string): Function;
/**
 * 属性值注入装饰器
 * @param c 构造函数
 */
export function inject < T > (c: new() => T): Function;
/**
 * 使用别名的方式注入属性值
 * @param name 属性值别名
 */
export function inject < T > (c: new() => T, name: any): Function;
export function inject < T > (str:string, name: any): Function;
/**
 * 使用默认的方式注入属性值
 */
//export function inject<T>(_target: Object, _key: any, _desc ? : any) : void;

//利用重载的形式定义注入属性的方法
export function inject < T > (): any {
    switch (arguments.length) {
        case 0:
            break;
        case 1:
            return injectNoNameFunc < T > (arguments[0]);
            break;
        case 2:
            return injectToNameFunc < T > (arguments[0], arguments[1])
            break;
        case 3:
            break;
    }
}
/**
 * 无别名的属性装饰器
 * @param _constructor 类型T的构造函数
 */
const injectNoNameFunc = < T > (_constructor: new() => T | string) => {
    return function (_target: any, _property: string) {
        injectFunc(_target,_constructor,_property);
    }
}
/**
 * 带别名的属性装饰器
 * @param _constructor 类型T的构造函数
 */
const injectToNameFunc = < T > (_constructor: new() => T | string, _name: any) => {
    return function (_target: any, _property: string) {
        injectFunc(_target,_constructor,_property,_name);
    }

}
/**
 * 
 * @param _target 被注入的目标类
 * @param _constructor 注入的类
 * @param _property 注入的类的属性名
 * @param _name 注入的类的别名
 */
function injectFunc(_target,_constructor,_property,_name?){
    //所有实现了IConstructorName的类都属于虚类，这里获取虚类对应的接口名作为键值传递给绑定器
    //因为压缩代码会把所有对象的名称都压缩掉，所以这里使用构造函数作为键值
    ClassBinder.bind(_target.constructor).to(Binding.checkAbstract(_constructor)).toProperty(_property).toName(_name);
}