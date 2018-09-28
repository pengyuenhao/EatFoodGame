import { Binding } from "../Bind/Binding";

export class CommandBinding extends Binding{
    //是否在执行序列中
    protected _isSequence : boolean;
    //是否仅执行一次
    protected _isOnce : boolean;
    //是否在对象池中
    public isPooled : boolean
    
    public get isSequence() : boolean{
        return this._isSequence
    }
    public get isOnce() : boolean{
        return this._isOnce;
    }
    public to(value) : CommandBinding{
        return super.to(value) as CommandBinding
    }
    public toName(name) : CommandBinding{
        return super.toName(name) as CommandBinding;
    }
    /**
     * 是否进入池
     */
    public Pooled()
    {
        this.isPooled = true;
        this._resolver (this);
        return this;
    }
}