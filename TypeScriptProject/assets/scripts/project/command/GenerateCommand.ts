import { Command } from "../../lib/framework/Command/Command";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { MainModel } from "../Model/MainModel";
import { MainUtil } from "../util/MainUtil";
import Animal from "../view/Animal";
import { __IC_Model, ModelType } from "../util/Model";
import PrefabPool from "../helper/PrefabPool";
import { TouchUtil, TouchDirection, TouchStatus } from "../util/TouchUtil";
import { __IC_Util, UtilType } from "../util/Util";

/**
 * 生成视图节点命令
 * 这个命令用于生成游戏视图
 */
export class GenerateCommand extends Command{
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(__IC_Util,UtilType.Main)
    mUtl : MainUtil;
    @inject(__IC_Util,UtilType.Touch)
    tUtl : TouchUtil;
    @inject(cc.Node,"Scene")
    sceneNode : cc.Node;
    @inject(cc.Node,"Animals")
    animalsNode : cc.Node;
    @inject(cc.Prefab,"Animal")
    animalPrefab : cc.Prefab;
    @inject(cc.Prefab,"Food")
    foodPrefab : cc.Prefab;


    execute(){
        //console.log("[视图节点生成指令]");
        this.init();
        this.generateTouchArea();
        this.generateAnimalNodes();
    }
    //生成触控区域
    generateTouchArea(){
        let area = new cc.Node("TouchArea");
        this.sceneNode.addChild(area);
        area.width = this.mUtl.getSceneSize().width;
        area.height = this.mUtl.getSceneSize().height;
        this.tUtl.registerTouchArea(area,true);
    }
    init() {
        this.mMdl.currentFoodNodes = [];
        this.mMdl.foodPool = new PrefabPool('Food', this.foodPrefab)
        this.mMdl.pauseFlag = false;
        this.mMdl.lastFoodIndex = -1
        this.mMdl.lastTrack = -1
        return Promise.all(this.mMdl.foodDatas.map(foodData => this.mUtl.spriteRes(foodData.image).then(spriteFrame => { foodData.spriteFrame = spriteFrame })))
    }
    //生成动物节点
    generateAnimalNodes() {
        let that = this;
        Promise.all(that.mMdl.animalDatas.map(animalData => that.mUtl.spriteRes(animalData.image)))
            .then((spriteFrames) => {
                if (spriteFrames && spriteFrames.length > 0) {
                    spriteFrames.forEach((spriteFrame, i) => {
                        let animalData = that.mMdl.animalDatas[i];
                        let animalNode = cc.instantiate(that.animalPrefab);
                        let animal = animalNode.getComponent(Animal);
                        let sprite = animalNode.getComponent(cc.Sprite);
                        //注意，未被添加到空间中的节点不会被初始化，所以这里需要先引入节点再执行节点的函数
                        that.animalsNode.addChild(animalNode);

                        sprite.spriteFrame = spriteFrame as cc.SpriteFrame;
                        animal.type = animalData.type;
                        animal.rePositonAnimal(i);
                    })
                }
            })
    }
}