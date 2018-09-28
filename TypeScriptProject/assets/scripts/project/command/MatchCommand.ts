import { Command } from "../../lib/framework/Command/Command";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { MainModel } from "../context/MainModel";
import Common from "../Common";
import Food from "../view/Food";
import { GameSignalEnum } from "../signal/MainSignalEnum";
import { __IC_Model, ModelType } from "../util/Model";

//引用注入装饰器
export class MatchCommand extends Command{
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(cc.Node,"Score")
    scoreNode : cc.Node;
    @inject(cc.Node,"Pause")
    pauseNode : cc.Node;

    execute(match){
        console.info("[游戏判断]");
        switch(match){
            case GameSignalEnum.onMatch:
                this.onMatch();
                break;
            case GameSignalEnum.onNotMatch:
                this.onNotMatch();
                break;
        }
    }
    //增加分数
    gainPoint() {
        this.mMdl.score++
        this.scoreNode.getComponent(cc.Label).string = 'Score: ' + Number(this.mMdl.score)
    }
    onMatch() {
        this.gainPoint()
    }

    onNotMatch() {
        this.mMdl.pauseFlag = true
        this.stopAllCurrent()
        this.pauseNode.active = true
        console.info("[游戏结算]"+this.mMdl.score);
        if(Common.saveScoreFunc){
            Common.saveScoreFunc(this.mMdl.score);
        }
    }

    stopAllCurrent() {
        console.info("[停止当前游戏进程]");
        //let a = Common.persistRootNode;
        if(this.mMdl.currentFoodNodes&&this.mMdl.currentFoodNodes.length>0){
            this.mMdl.currentFoodNodes.forEach(foodNode => {
            foodNode.getComponent(Food).inited = false
            })
        }
    }
}