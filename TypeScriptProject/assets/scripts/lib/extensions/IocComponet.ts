import {Context, IContext} from "../framework/Context/Context"
import {IocRoot} from "./IocRoot"
const {ccclass} = cc._decorator
@ccclass
export class IocComponet extends cc.Component{
	public registeredWithContext : boolean;
	private _requiresContext : boolean= true;
	public get requiresContext() : boolean
	{
		return this._requiresContext;
	}
	public set requiresContext(value){
		this._requiresContext = value;
	}
	protected _registerWithContext : boolean = true;
	public get autoRegisterWithContext()
	{
		return this._registerWithContext; 
	}
	public set autoRegisterWithContext(value){
		this._registerWithContext = value;
	}
	public get shouldRegister() :boolean { return this.enabled && this.node.activeInHierarchy; }

	//载入阶段尝试注入数据
    onLoad(){
		if (this.autoRegisterWithContext && !this.registeredWithContext && this.shouldRegister)
			this.bubbleToContext(this,BubbleType.Add, false);
	}
	//启动阶段尝试注入数据
	start(){
		if (this.autoRegisterWithContext && !this.registeredWithContext && this.shouldRegister)
			this.bubbleToContext(this, BubbleType.Add, true);
	}

    protected bubbleToContext(view : cc.Component,type: BubbleType,finalTry:boolean)
	{
			const LOOP_MAX : number= 100;
			let loopLimiter : number= 0;
			let node = view.node;
			while (node.parent != null && loopLimiter < LOOP_MAX)
			{
				loopLimiter++;
				node = node.parent;
				if (node.getComponent(IocRoot) != null)
				{
					let iocContext : IocRoot = node.getComponent(IocRoot) as IocRoot;
					if (iocContext.context != null)
					{
						let context : IContext= iocContext.context;
						let success : boolean= true;

						switch (type)
						{
							case BubbleType.Add:
								//注入数据
								context.crossContextBinder.injector.inject(this,true);
								//context.addView(view);
								this.registeredWithContext = true;
								break;
							case BubbleType.Remove:
								//context.removeView(view);
								break;
							case BubbleType.Enable:
								//context.enableView(view);
								break;
							case BubbleType.Disable:
								//context.disableView(view);
								break;
							default:
								success = false;
								break;
						}

						if (success)
						{
							return;
						}
					}
				}
			}
			if (this.requiresContext && finalTry && type == BubbleType.Add)
			{
				//last ditch. If there's a Context anywhere, we'll use it!
				if (Context.firstContext != null)
				{
					//Context.firstContext.addView(view);
					this.registeredWithContext = true;
					return;
				}

				let msg : string;
				if(loopLimiter == LOOP_MAX){
					msg = "A view couldn't find a context. Loop limit reached."
				}
				else{
					msg = "A view was added with no context. Views must be added into the hierarchy of their ContextView lest all hell break loose.";
					msg += "\nView: " + view.toString();
				}
				throw new Error(msg);
			}
		}
}

export enum BubbleType
{
	Add,
	Remove,
	Enable,
	Disable
}