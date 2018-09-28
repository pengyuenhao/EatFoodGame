import {StartCommand} from "../command/StartCommand"
import { __IC_SignalManager, ISignalManager } from "../../Lib/Framework/Signal/SignalManager";
import {IContext,Context} from "../../Lib/Framework/Context/Context"
import { MainSignalManager } from "../signal/MainSignalManager"
import { MainModel } from "./MainModel";
import { UpdateCommand } from "../command/UpdateCommand";
import { GenerateCommand } from "../command/GenerateCommand";
import { MainSignalEnum } from "../signal/MainSignalEnum";
import { MainUtil,__IC_Util } from "../util/MainUtil";
import { RestartCommand } from "../command/RestartCommand";
import { LookRankCommand } from "../command/LookRankCommand";
import { MatchCommand } from "../command/MatchCommand";
import ResourceManager from "../util/ResourceManager";
import { ManagerType, __IC_Manager } from "../util/Manager";
import { __IC_Model } from "../util/Model";
import { TouchUtil } from "../util/TouchUtil";
import { InputControlCommand } from "../command/InputControlCommand";

export class MainContext extends Context{
    constructor(root: any){
        super(root);
    }
    //添加核心
    addCore(){
        super.addCore();
        //注入信号管理器单例
        this.injectBinder.bind(__IC_SignalManager).to(MainSignalManager).toSingleton();
        //绑定数据
        this.injectBinder.bind(__IC_Model).toValue(MainModel.Instance).toName("Main");
        //绑定工具
        this.injectBinder.bind(__IC_Util).toValue(MainUtil.Instance).toName("Main");
        this.injectBinder.bind(__IC_Util).toValue(TouchUtil.Instance).toName("Touch");
        //绑定资源管理器
        this.injectBinder.bind(__IC_Manager).toValue(ResourceManager.Instance).toName(ManagerType.Resource);
        //console.info("添加核心");
    }
    //映射绑定
    mapBindings(){
        super.mapBindings();
        //console.info("映射绑定");
        let signalMgr : ISignalManager= this.injectBinder.getInstance(__IC_SignalManager,null);

        this.commandBinder.bind(signalMgr.get(MainSignalEnum.Start)).to(StartCommand);
        //绑定更新信号到更新命令,并使用池进行缓存
        this.commandBinder.bind(signalMgr.get(MainSignalEnum.Update)).to(UpdateCommand).Pooled();
        //生成游戏视图节点
        this.commandBinder.bind(signalMgr.get(MainSignalEnum.Generate)).to(GenerateCommand);

        this.commandBinder.bind(signalMgr.get(MainSignalEnum.Restart)).to(RestartCommand);

        this.commandBinder.bind(signalMgr.get(MainSignalEnum.LookRank)).to(LookRankCommand);

        this.commandBinder.bind(signalMgr.get(MainSignalEnum.Match)).to(MatchCommand);

        this.commandBinder.bind(signalMgr.get(MainSignalEnum.InputControl)).to(InputControlCommand);
    }
    start() : IContext{
        super.start();
        console.info("[启动环境]");
        return this;
    } 
}
