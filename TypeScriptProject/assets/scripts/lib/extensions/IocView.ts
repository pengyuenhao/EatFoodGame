import { IocComponet } from "./IocComponet";
import { inject } from "../framework/Injector/InjectDecorator";
import { __IC_SignalManager, ISignalManager } from "../framework/Signal/SignalManager";

const {ccclass} = cc._decorator
@ccclass
export class IocView extends IocComponet{
    @inject(__IC_SignalManager)
    sMgr : ISignalManager;

    onLoad(){
        super.onLoad();
    }
    
    start(){
        super.start();
    }

}