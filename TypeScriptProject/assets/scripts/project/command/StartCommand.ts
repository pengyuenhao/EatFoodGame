import {__IC_SignalManager, ISignalManager} from "../../Lib/Framework/Signal/SignalManager"
import { Command } from "../../lib/framework/Command/Command";
import { MainModel } from "../Model/MainModel";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { MainSignalEnum } from "../signal/MainSignalEnum";
import { MainUtil } from "../util/MainUtil";
import PrefabPool from "../helper/PrefabPool";
import { __IC_Model, ModelType } from "../util/Model";
import { __IC_Manager, ManagerType } from "../util/Manager";
import PrefabManager from "../util/PrefabManager";
import { __IC_InjectBinder, IInjectBinder } from "../../lib/framework/Injector/InjectBinder";
import { __IC_Util, UtilType } from "../util/Util";

//引用注入装饰器
export class StartCommand extends Command{
    @inject(__IC_SignalManager)
    sMgr : ISignalManager;
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(__IC_Util,UtilType.Main)
    mUtil : MainUtil;
    //注入资源管理器
    @inject(__IC_Manager,ManagerType.Prefab)
    resMgr : PrefabManager;
    @inject(__IC_InjectBinder)
    inj: IInjectBinder;
    @inject(cc.Node,"LogicNode")
    logicNode : cc.Node;
    @inject(cc.Node,"MainNode")
    mainNode : cc.Node;

    //执行
    execute(){
        //console.log("[开始指令]");

        this.lanuch();
        this.start();
    }
    start(){
        this.sMgr.get(MainSignalEnum.InputControl).dispatch();
    }
    //启动配置
    lanuch(){
        const manager = cc.director.getCollisionManager()
        manager.enabled = true

        this.loadRes();

        this.sMgr.get(MainSignalEnum.Generate).dispatch();
    }


    loadRes(){
        if(!this.resMgr.isInit){
            //绑定预制件
            if(this.resMgr.hasPrefab("Animal")){
                this.inj.bind(cc.Prefab).toName("Animal").toValue(this.resMgr.getPrefab("Animal"));
            }
            if(this.resMgr.hasPrefab("Food")){
                this.inj.bind(cc.Prefab).toName("Food").toValue(this.resMgr.getPrefab("Food"));
            }
            this.resMgr.isInit = true;
        }
        
        //检查是否存在对应的资源
        if(this.resMgr.hasPrefab("Scene")){
            let scene : cc.Node = cc.instantiate(this.resMgr.getPrefab("Scene"));
            this.mainNode.addChild(scene);
            let avatar = scene.getChildByName("Avatar");
            let animals = avatar.getChildByName("Animals");
            let score = scene.getChildByName("Score");

            this.inj.bind(cc.Node).toName("Scene").toValue(scene).unBind();
            this.inj.bind(cc.Node).toName("Avatar").toValue(avatar).unBind();
            this.inj.bind(cc.Node).toName("Animals").toValue(animals).unBind();
            this.inj.bind(cc.Node).toName("Score").toValue(score).unBind();
        }else{
            throw new Error("Scene prefab is not found");
        }
        if(this.resMgr.hasPrefab("PauseLayer")){
            let pause : cc.Node = cc.instantiate(this.resMgr.getPrefab("PauseLayer"));
            this.mainNode.addChild(pause);
            pause.active = false;

            this.inj.bind(cc.Node).toName("Pause").toValue(pause).unBind();
        }else{
            throw new Error("Pause layer prefab is not found");
        }
    }
}