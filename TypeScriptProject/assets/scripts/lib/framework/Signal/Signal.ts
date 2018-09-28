import {IocError, IConstructorName} from "../IocConst"
export interface ISignal {
    name;
    dispatch(...args);
    addListener(callback:Function);
    addOnceListener(callback:Function);
    removeAllListeners();
    /// Returns a List<System.Type> representing the Types bindable to this Signal
	getTypes() : object[];
}
export class __IC_Signal extends IConstructorName {
    static get constructorName(){return "ISignal";};
}

export class Signal implements ISignal {
    public name;
    //回调监听
    public _listener: Function[] = [];
    public _onceListener: Function[] = [];
    //执行信号
    public dispatch(...args) {
        let that = this;
        //如果存在回调函数
        if (that._listener&&that._listener.length != 0) {
            this._listener.forEach(function (action) {
                action(that,...args);
            })
        }
        //如果存在单次回调
        if (that._onceListener&&that._onceListener.length != 0)
            this._listener.forEach(function (action) {
                action(that,...args);
            })
        //清空单次执行的监听
        this._onceListener.length = 0;
    }
    public addListener(callback:Function){
        this._listener = this.addUnique(this._listener,callback);
    }
    public addOnceListener(callback:Function){
        this._onceListener = this.addUnique(this._onceListener,callback);
    }
    //清空监听
    public removeAllListeners(){
        this._listener.length=0;
        this._onceListener.length=0;
    }
    //不重复添加
    private addUnique(listeners : Function[], callback : Function)
    {
        //检查监听回调是否存在
        if (listeners)
        {
            let isUnique = false;
            for(let i = 0;i<listeners.length;i++){
                //检查是否存在重复项
                if(listeners[i] === callback){
                    isUnique = true;
                    break;
                }
            }
            if(!isUnique){
                //放入回调
                listeners.push(callback);
            }
        }
        return listeners;
    }
    public getTypes() : object[]
    {
        let retv = [];
        //retv.push(this);
        return retv;
    }
}