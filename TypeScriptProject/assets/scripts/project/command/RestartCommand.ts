import { Command } from "../../lib/framework/Command/Command";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { MainModel } from "../Model/MainModel";
import { __IC_Model, ModelType } from "../util/Model";

//引用注入装饰器
export class RestartCommand extends Command{
    @inject(cc.Node,"Pause")
    pauseNode : cc.Node;
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;

    execute(){
        //console.info("[重新开始]");

        this.revive();
    }

    revive() {
        
        this.pauseNode.active = false
        this.clearAllCurrent()
        this.mMdl.pauseFlag = false
    }

    clearAllCurrent() {
        if(this.mMdl.currentFoodNodes&&this.mMdl.currentFoodNodes.length>0){
            this.mMdl.currentFoodNodes.forEach(foodNode => {
                this.mMdl.foodPool.res(foodNode)
            })
        }
        this.mMdl.currentFoodNodes = []
    }
}