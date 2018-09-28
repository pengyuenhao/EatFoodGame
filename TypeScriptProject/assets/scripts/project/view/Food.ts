import { randomCoin, randomValue, spriteRes } from '.././util'
import { inject } from '../../lib/framework/Injector/InjectDecorator';
import { MainModel} from '../context/MainModel';
import Animal from './Animal';
import { MainUtil, __IC_Util } from '../util/MainUtil';
import { IocView } from '../../lib/extensions/IocView';
import { GameSignalEnum, MainSignalEnum } from '../signal/MainSignalEnum';
import { __IC_Model, ModelType } from "../util/Model";

const {ccclass, property} = cc._decorator

@ccclass
export default class Food extends IocView {
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(__IC_Util,"Main")
    mUtl : MainUtil;

    inited;
    foodData;

	speed = 300
	accel = 100
    moveY = 0
    type = ''

    onLoad() {super.onLoad();}
    start(){super.start();}
    reuse() {}
    unuse() {}

    update(dt) {
    	if (!this.inited) return
    	this.speed += this.accel * dt
    	this.moveY = this.speed * dt
    	this.node.y -= this.moveY
    }

    onCollisionEnter(other, self) {
        if (!this.inited) return
        const otherComponent = other.getComponent(Animal)
        const selfComponent = self.getComponent(Food)
        if (otherComponent && selfComponent && otherComponent.type === selfComponent.type) {
            //this.mMdl.onMatch()
            this.sMgr.get(MainSignalEnum.Match).dispatch(GameSignalEnum.onMatch);
            this.resPoolNode(this.node)
        } else {
            //this.mMdl.onNotMatch()
            this.sMgr.get(MainSignalEnum.Match).dispatch(GameSignalEnum.onNotMatch);
        }
    }
    //随机配置食物位置
    randomProps() {
        this.inited = false
        let track = randomCoin()
        //记录最后的食物索引
        if (this.mMdl.lastFoodIndex === -1) this.mMdl.lastFoodIndex = track
        if (this.mMdl.lastTrack === -1) this.mMdl.lastTrack = track
        let baseIndex
        //如果当前轨道等于最后的轨道
        if (track === this.mMdl.lastTrack) {
            //创建与最后的轨道相同类型的食物
            baseIndex = this.mMdl.lastFoodIndex
        } else {
            //检查当前的轨道与最后的食物之间的差值
            baseIndex = track ? this.mMdl.lastFoodIndex + 1 : this.mMdl.lastFoodIndex - 1
        }
        //随机范围
        let randomRange = [baseIndex - 1, baseIndex + 1].map(i => {
            if (i < 0) i = this.mMdl.foodDatas.length + i
            if (i >= this.mMdl.foodDatas.length) i = i - this.mMdl.foodDatas.length
            return i
        })
        let foodIndex = randomValue(...randomRange)
        this.mMdl.lastFoodIndex = foodIndex
        this.mMdl.lastTrack = track
        this.foodData = this.mMdl.foodDatas[foodIndex]
        let foodNode = this.node
        this.type = this.foodData.type
        foodNode.setPosition((track ? 1 : -1) * this.node.width / 2, this.mUtl.getSceneSize().height/2);
        foodNode.getComponent(cc.Sprite).spriteFrame = this.foodData.spriteFrame 
        this.inited = true
    }
    //回收到资源池
    resPoolNode(foodNode) {
        let index = this.mMdl.currentFoodNodes.indexOf(foodNode)
        if (index !== -1) {
            this.mMdl.currentFoodNodes.splice(index, 1)
        }
        return this.mMdl.foodPool.res(foodNode)
    }
}



