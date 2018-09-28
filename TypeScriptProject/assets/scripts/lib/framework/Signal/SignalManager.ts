import { IConstructorName } from "../IocConst"
import { __IC_Signal , Signal, ISignal } from "./Signal"

export interface ISignalManager {
    get(symbol) : ISignal;
    delete(symbol);
    info: string;
}
export class __IC_SignalManager extends IConstructorName {
    static get constructorName(){return "ISignalManager";}
}
export class SignalManager implements ISignalManager {
    //维护一个信号指令映射表，注意不再使用的信号应该及时释放掉
    _signal_dic : Map<any,ISignal>= new Map < any, ISignal > ();
    info: string = "this is a signal manager";

    public get(symbol) : ISignal{
        //检查全局信号字典内是否存在对应的信号名称或枚举
        if (this._signal_dic.has(symbol)) {
            //获取标志对应的信号
            return this._signal_dic.get(symbol);
        } else {
            //创建一个信号
            let _signal = new Signal();
            //如果使用字符串作为信号识别名，则将其绑定给信号
            if(typeof symbol == "string")_signal.name = symbol;
            //设置根环境
            //_signal.setRoot(this._context.getRoot);
            //建立全局信号与标志值的映射关系
            this._signal_dic.set(symbol, _signal);
            return _signal;
        }
    };

    public delete(symbol) {
        //检查全局信号字典内是否存在对应的信号名称或枚举
        if (this._signal_dic.has(symbol)) {
            //获取标志对应的信号
            return this._signal_dic.delete(symbol);
        }
    }
}