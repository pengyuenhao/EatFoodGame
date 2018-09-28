import {__IC_SignalManager, ISignalManager} from "../../Lib/Framework/Signal/SignalManager"
import { MainModel } from "../context/MainModel";
import { Command } from "../../lib/framework/Command/Command";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import Food from "../view/Food";
import { MainUtil,__IC_Util } from "../util/MainUtil";
import { __IC_Model, ModelType } from "../util/Model";

//引用注入装饰器
export class UpdateCommand extends Command{
    @inject(__IC_SignalManager)
    sMgr : ISignalManager;
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(cc.Node,"Scene")
    sceneNode : cc.Node;
    @inject(__IC_Util,"Main")
    mUtl:MainUtil;

    tickcount:number = 0;
    timecount:number = 0;
    //执行
    execute(dt){
        this.update(dt);
    }

    update(dt){
        this.mMdl.timer += dt
        if (this.mMdl.timer >= this.mMdl.lastTimer + this.mMdl.timePeriod) {
            this.mMdl.lastTimer = this.mMdl.timer
            this.newNode()
            // 难度加成
            if (this.mMdl.timePeriod >= this.mMdl.minTimePeriod && this.mMdl.score > 0 && (this.mMdl.currentLevel < this.mMdl.harderRatios.length - 1)) {
                const [level, ratio] = this.mMdl.harderRatios[this.mMdl.currentLevel + 1]
                if (this.mMdl.score >= level) {
                    this.mMdl.currentLevel++
                    this.mMdl.timePeriod -= ratio
                    console.log(this.mMdl.timePeriod)
                }
            }
        }
    }

    newNode() {
        //获取食物实例
        let food = this.getPoolNode()
        this.sceneNode.addChild(food);
        //获取对象的食物组件
        let foodComponent = food.getComponent(Food)
        foodComponent.randomProps()
        return food
    }

    getPoolNode() {
        //从食物对象池中获取一个实例
        let foodNode = this.mMdl.foodPool.get()
        //将食物实例放入当前食物节点列表
        this.mMdl.currentFoodNodes.push(foodNode)
        return foodNode
    }


}