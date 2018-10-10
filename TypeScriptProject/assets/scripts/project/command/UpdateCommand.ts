import {__IC_SignalManager, ISignalManager} from "../../Lib/Framework/Signal/SignalManager"
import { MainModel } from "../Model/MainModel";
import { Command } from "../../lib/framework/Command/Command";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import Food from "../view/Food";
import { MainUtil } from "../util/MainUtil";
import { __IC_Model, ModelType } from "../util/Model";
import { __IC_Util, UtilType } from "../util/Util";

//引用注入装饰器
export class UpdateCommand extends Command{
    @inject(__IC_SignalManager)
    sMgr : ISignalManager;
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(cc.Node,"Scene")
    sceneNode : cc.Node;
    @inject(cc.Node,"FoodArea")
    foodArea : cc.Node;
    @inject(__IC_Util,UtilType.Main)
    mUtl:MainUtil;

    tickcount:number = 0;
    timecount:number = 0;
    //执行
    execute(dt){
        this.update(dt);
    }

    update(dt){
        //如果小游戏处于被隐藏的状态则不执行任何更新
        if(this.mMdl.isHide)return;
        this.mMdl.timer += dt
        if (this.mMdl.timer >= this.mMdl.lastTimer + this.mMdl.timePeriod) {
            this.mMdl.lastTimer = this.mMdl.timer
            this.newNode();
            // 难度加成
            if (this.mMdl.timePeriod >= this.mMdl.minTimePeriod && this.mMdl.score > 0 && (this.mMdl.currentLevel < this.mMdl.harderRatios.length - 1)) {
                let [level, ratio] = this.mMdl.harderRatios[this.mMdl.currentLevel + 1]
                if (this.mMdl.score >= level) {
                    this.mMdl.currentLevel++
                    this.mMdl.timePeriod -= ratio
                    //console.log("[难度提升]"+this.mMdl.timePeriod)
                }
            }
        }
    }

    newNode() {
        //获取食物实例
        let food = this.getPoolNode()
        if(!food.parent){
            this.foodArea.addChild(food);
        }
        let foodComponent : Food = food.getComponent(Food)
        //初始化配置
        foodComponent.init();
        //获取对象的食物组件
        foodComponent.randomProps()
        return food
    }

    getPoolNode() {
        //从食物对象池中获取一个实例
        let foodNode = this.mMdl.foodPool.get();
        //将食物实例放入当前食物节点列表
        this.mMdl.currentFoodNodes.push(foodNode)
        return foodNode
    }


}