import {
    IBinding,
    Binding
} from "../Bind/Binding"
import {
    __IC_InjectBinder,
    IInjectBinder
} from "../Injector/InjectBinder";
import {
    CommandBinding
} from "./CommandBinding";
import {
    ISignal
} from "../Signal/Signal"
import {
    InjectBinding
} from "../Injector/InjectBinding";
import {
    ICommand,
    __IC_Command
} from "./Command";
import {
    Pool
} from "../../Extensions/Pool";
import {
    CommandConst
} from "./CommandConst"
import {
    inject
} from "../Injector/InjectDecorator";
import {
    Binder
} from "../Bind/Binder";
import {
    ICommandBinder
} from "./ICommandBinder";
//全局注入数据绑定器


/**
 * 指令绑定器
 */
export class CommandBinder extends Binder implements ICommandBinder {
    //注入绑定器
    @inject(__IC_InjectBinder)
    public injectBinder: IInjectBinder;

    //指令池
    protected pools: Map < object, Pool >= new Map < object, Pool > ();

    // Tracker for parallel commands in progress
    protected activeCommands: Set < ICommand >= new Set < ICommand > ();
    // Tracker for sequences in progress
    protected activeSequences: Map < ICommand, CommandBinding > = new Map < ICommand, CommandBinding > ();
    //是否使用池
    public usePooling: boolean = false;
    public getPool(type: object): Pool {
        if (this.pools.has(type))
            return this.pools.get(type);
        return null;
    }

    public resolver(binding: IBinding) {
        super.resolver(binding);
        if (this.usePooling && (binding as CommandBinding).isPooled) {
            if (binding.value != null) {
                let that = this;
                //检查被绑定的值是否有效
                let values: object[] = binding.value as object[];
                if (values.length === 0) {
                    values = [];
                    values.push(binding.value);
                }

                if (values && values.length > 0) {
                    values.forEach((value) => {
                        //如果找不到对应的池则创建
                        if (that.pools.has(value) == false) {
                            let myPool = this.makePoolFromType(value);
                            that.pools.set(value, myPool);
                        }
                    });
                }
            }
        }
    }
    protected makePoolFromType(type): Pool {
        //池构造函数作为类型使用
        let poolType = type;
        //预制实例缓存
        this.injectBinder.bind(type).to(type);

        //获取一个池实例
        this.injectBinder.bind(Pool).to(Pool).toName(CommandConst.COMMAND_POOL);
        let pool: Pool = this.injectBinder.getInstance(Pool, CommandConst.COMMAND_POOL) as Pool;
        this.injectBinder.unbind(Pool, CommandConst.COMMAND_POOL);
        pool.bind(poolType);

        return pool;
    }
    //绑定状态映射字典
    getRawBinding(): IBinding {
        return new CommandBinding(this.resolver.bind(this));
    }
    bind(key: any): CommandBinding {
        return super.bind(key) as CommandBinding;
    }
    //调用指令
    protected invokeCommand(cmd: object, binding: CommandBinding, args, depth: number): ICommand {
        let command: ICommand = this.createCommand(cmd, args);
        command.sequenceId = depth;
        this.trackCommand(command, binding);
        this.executeCommand(command,args);
        return command;
    }
    //
    protected createCommand(cmd: object, data: object): ICommand {
        let command: ICommand = this.getCommand(cmd);

        if (command == null) {
            let msg: string = "A Command ";
            if (data != null) {
                msg += "tied to data " + data.toString();
            }
            msg += " could not be instantiated.\nThis might be caused by a null pointer during instantiation or failing to override Execute (generally you shouldn't have constructor code in Commands).";
            throw new Error(msg);
        }

        command.data = data;
        return command;
    }
    //获取指令实例
    protected getCommand(type: object): ICommand {
        //如果使用池则检查是否已经存在相应的实例
        if (this.usePooling && this.pools.has(type)) {
            let pool: Pool = this.pools.get(type);
            let command: ICommand = pool.getInstance() as ICommand;
            //是否存在对应的实例
            if(command){
                //检查是否已经清理
                if (command.isClean) {
                    this.injectBinder.injector.inject(command, null);
                    command.deploy();
                }
            }else{
                //获取实例
                command = this.injectBinder.getInstance(type,null);
                //为池添加实例缓存
                pool.add(command);
            }
            return command;
        } else {
            this.injectBinder.bind(__IC_Command).to(type);
            let command: ICommand = this.injectBinder.getInstance(__IC_Command, null);
            this.injectBinder.unbind(__IC_Command, null);
            return command;
        }
    }
    protected trackCommand(command: ICommand, binding: CommandBinding) {
        if (binding.isSequence) {
            this.activeSequences.set(command, binding);
        } else {
            this.activeCommands.add(command);
        }
    }
    //执行指令
    protected executeCommand(command: ICommand,args) {
        if (command == null) {
            return;
        }
        command.execute(...args);
    }
    /**
     * 信号调用回掉函数
     * @param trigger 触发的信号
     * @param data 数据
     */
    public onDispose(trigger: object , ...args) {
        //尝试获取绑定状态
        let binding: CommandBinding = this.getBinding(trigger, null) as CommandBinding;
        if (binding != null) {
            //是否处于执行序列中
            if (binding.isSequence) {
                //加入执行队列
                this.next(binding, args, 0,);
            } else {
                //获取被绑定的指令对象
                let values: object[] = binding.value as object[];
                let aa = values.length + 1;
                for (let a = 0; a < aa; a++) {
                    this.next(binding, args , a,);
                }
            }
        }
    }
    //下一次即将执行的指令
    protected next(binding: CommandBinding, args, depth: number) {
        let values: object[] = binding.value as object[];
        if (values.length === 0) {
            values = [];
            values.push(binding.value);
        }

        if (depth < values.length) {
            let cmd = values[depth];
            let command: ICommand = this.invokeCommand(cmd, binding, args, depth);
            this.releaseCommand(command);
        } else {
            this.disposeOfSequencedData(args);
            //是否仅执行一次
            if (binding.isOnce) {
                //解除绑定
                this.unbind(binding, null);
            }
        }
    }
    //EventCommandBinder (and perhaps other sub-classes) use this method to dispose of the data in sequenced commands
    protected disposeOfSequencedData(data: object) {
        //No-op. Override if necessary.
    }
    //释放指令，使其进入池
    public releaseCommand(command: ICommand) {
        //有时会需要执行一些耗时的异步操作，如果指令被用户保持则不进行释放，默认情况下都是自动释放的
        if (!command.isRetain) {
            //使用构造函数作为类型
            let t = command.constructor;
            if (this.usePooling && this.pools.has(t)) {
                this.pools.get(t).returnInstance(command);
            }
            if (this.activeCommands.has(command)) {
                this.activeCommands.delete(command);
            } else if (this.activeSequences.has(command)) {
                let binding: CommandBinding = this.activeSequences.get(command);
                let data = command.data;
                this.activeSequences.delete(command);
                this.next(binding, data, command.sequenceId + 1);
            }
        }
    }
}
export class SignalCommandBinder extends CommandBinder {
    //启用池
    public usePooling : boolean = true;
    //重写解析绑定状态函数
    resolveBinding(binding: IBinding, key: any) {
        super.resolveBinding(binding, key);
        //如果已经存在了则不能再次绑定
        if (this._bindings.has(key)) {
            let signal: ISignal = key;
            signal.addListener(this.onDispose.bind(this)); //Do normal bits, then assign the commandlistener to be reactTo
        }
    }
    //重写绑定方法
    public bind(value: object): CommandBinding {
        //获取绑定状态
        let binding: InjectBinding = this.injectBinder.getBinding(value, null);
        let signal: ISignal = null;
        //检查参数值是否为构造函数
        if (Binding.isConstructor(value)) {
            //如果尚未进行注入则注入一个单例
            if (binding == null) {
                binding = this.injectBinder.bind(value);
                binding.toSingleton();
            }
            signal = this.injectBinder.getInstance(value, null) as ISignal;
        }
        //如果信号存在则绑定信号，否则直接绑定值
        if (signal) {
            return super.bind(signal);
        } else {
            return super.bind(value);
        }
    }
    //重写获取绑定状态方法
    public getBinding(key: any, name: any): CommandBinding {
        let signal;
        //检查键值是否为构造函数
        if (Binding.isConstructor(key)) {
            //参数应该是一个信号或信号的构造函数，而不是其他的值
            signal = this.injectBinder.getInstance(key, name);
        } else {
            //信号是一个实例
            signal = key;
        }
        return super.getBinding(signal, name) as CommandBinding;
    }
    protected invokeCommand(cmd, binding: CommandBinding, args, depth: number): ICommand {
        let signal: ISignal = binding.key;
        let command: ICommand = this.createCommandForSignal(cmd, args); //Special signal-only command creation
        command.sequenceId = depth;
        this.trackCommand(command, binding);
        this.executeCommand(command,args);
        return command;
    }
    // Create a Command and bind its injectable parameters to the Signal types
    protected createCommandForSignal(cmd, args): ICommand {
        let that = this;

        if (args != null) {

            let signalData: [] = args as[];

            //Iterate each signal type, in order. 
            //Iterate values and find a match
            //If we cannot find a match, throw an error
            let injectedTypes = new Set < any > ();
            let values = [signalData];

            /* if(signalTypes&&signalTypes.length>0){
            signalTypes.forEach((type)=>{
                if (!injectedTypes.has(type)) // Do not allow more than one injection of the same Type
                {
                    let foundValue : boolean= false;
                    for(let i = 0;i<values.length;i++){
                        if (values[i] != null)
                        {
                            that.injectBinder.bind(type).toValue(values[i]).toInject(false);
                            injectedTypes.add(type);
                            //values[i]=null;
                            foundValue = true;
                            break;
                        }
                        else //Do not allow null injections
                        {
                            throw new Error("SignalCommandBinder attempted to bind a null value from a signal to Command: " + cmd.GetType() + " to type: " + type);
                        }
                    }
                    if (!foundValue)
                    {
                        throw new Error("Could not find an unused injectable value to inject in to Command: " + cmd.GetType() + " for Type: " + type);
                    }
                }
                else
                {
                    throw new Error("SignalCommandBinder: You have attempted to map more than one value of type: " + type +
                        " in Command: " + cmd.GetType() + ". Only the first value of a type will be injected. You may want to place your values in a VO, instead.");
                }
            })
            }*/
        }
        let command: ICommand = that.getCommand(cmd);
        command.data = args;
/*         if (signalTypes && signalTypes.length > 0) {
            signalTypes.forEach((typeToRemove) => {
                that.injectBinder.unbind(typeToRemove, null);
            })
        } */
        return command;
    }
}