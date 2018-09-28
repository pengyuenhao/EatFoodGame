import {Context, IContext} from "../framework/Context/Context"

const {ccclass, property} = cc._decorator
@ccclass
export class IocRoot extends cc.Component{
    public context : IContext;

    public requiresContext : boolean;

    public registeredWithContext : boolean;

    public autoRegisterWithContext : boolean;

    public get shouldRegister() {return true;}

    onDestroy(){
        if (this.context != null && Context.firstContext != null)
            Context.firstContext.removeCrossContext(this.context);
    }
}