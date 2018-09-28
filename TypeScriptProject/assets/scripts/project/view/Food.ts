import { inject } from '../../lib/framework/Injector/InjectDecorator';
import { MainModel} from '../Model/MainModel';
import Animal from './Animal';
import { MainUtil } from '../util/MainUtil';
import { IocView } from '../../lib/extensions/IocView';
import { GameSignalEnum, MainSignalEnum } from '../signal/MainSignalEnum';
import { __IC_Model, ModelType } from "../util/Model";
import { __IC_Util, UtilType } from '../util/Util';
import { __IC_Manager, ManagerType } from '../util/Manager';
import AudioManager from '../util/AudioManager';

const {ccclass, property} = cc._decorator

@ccclass
export default class Food extends IocView {
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(__IC_Util,UtilType.Main)
    mUtl : MainUtil;
    @inject(__IC_Manager,ManagerType.Audio)
    aMgr : AudioManager;

    inited;
    foodData;

	public speed = 0;
    public accel = 0;
    
    private moveY = 0
    type = ''

    onLoad() {super.onLoad();}
    start(){super.start();}
    reuse() {}
    unuse() {}
    public clear(){
        this.speed = 100;
        this.accel = 100;
        this.moveY = 0;
        this.node.x = 0;
        this.node.y = 0;
    }
    update(dt) {
    	if (!this.inited) return
    	this.speed += this.accel * dt
    	this.moveY = this.speed * dt
        this.node.y -= this.moveY
    }

    onCollisionEnter(other, self) {
        if (!this.inited) return;
        let otherComponent = other.getComponent(Animal);
        let selfComponent = self.getComponent(Food);
        if (otherComponent && selfComponent && otherComponent.type === selfComponent.type) {
            //this.mMdl.onMatch()
            this.sMgr.get(MainSignalEnum.Match).dispatch(GameSignalEnum.onMatch,this.node);
            this.resPoolNode(this.node);
        } else {
            //this.mMdl.onNotMatch()
            this.sMgr.get(MainSignalEnum.Match).dispatch(GameSignalEnum.onNotMatch);
        }
        this.inited = false;
    }
    //回收到资源池
    resPoolNode(foodNode) {
        let index = this.mMdl.currentFoodNodes.indexOf(foodNode)
        if (index !== -1) {
            this.mMdl.currentFoodNodes.splice(index, 1)
        }
        return this.mMdl.foodPool.res(foodNode)
    }
    //随机配置食物位置
    randomProps() {
        this.inited = false
        let track = this.mUtl.randomCoin()
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
        let foodIndex = this.mUtl.randomValue(...randomRange)
        this.mMdl.lastFoodIndex = foodIndex
        this.mMdl.lastTrack = track
        this.foodData = this.mMdl.foodDatas[foodIndex]
        let foodNode = this.node
        this.type = this.foodData.type
        foodNode.getComponent(cc.Sprite).spriteFrame = this.foodData.spriteFrame ;
        let x = (track ? 1 : -1) * (this.mMdl.animalTextureRect.width / 2);
        foodNode.setPosition(x , this.mUtl.getSceneSize().height/2);
        this.inited = true
    }
}



