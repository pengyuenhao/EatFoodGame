import {Command} from "../../lib/framework/Command/Command";
import {inject} from "../../lib/framework/Injector/InjectDecorator";
import {MainModel} from "../Model/MainModel";
import {MainUtil} from "../util/MainUtil";
import Animal from "../view/Animal";
import {__IC_Model,ModelType} from "../util/Model";
import PrefabPool from "../helper/PrefabPool";
import {TouchUtil,} from "../util/TouchUtil";
import {__IC_Util,UtilType} from "../util/Util";

/**
 * 生成视图节点命令
 * 这个命令用于生成游戏视图
 */
export class GenerateCommand extends Command {
    @inject(__IC_Model, ModelType.Main)
    mMdl: MainModel;
    @inject(__IC_Util, UtilType.Main)
    mUtl: MainUtil;
    @inject(__IC_Util, UtilType.Touch)
    tUtl: TouchUtil;
    @inject(cc.Node, "Scene")
    sceneNode: cc.Node;
    @inject(cc.Node, "Animals")
    animalsNode: cc.Node;
    @inject(cc.Prefab, "Animal")
    animalPrefab: cc.Prefab;
    @inject(cc.Prefab, "Food")
    foodPrefab: cc.Prefab;


    execute(complete) {
        //console.log("[视图节点生成指令]");
        //等待异步过程初始化完成
        this.init().then(() => {
            this.generateTouchArea();
            this.generateAnimals();
            complete();
        })
    }
    //生成触控区域
    generateTouchArea() {
        let area = new cc.Node("TouchArea");
        this.sceneNode.addChild(area);
        area.width = this.mUtl.getSceneSize().width;
        area.height = this.mUtl.getSceneSize().height;
        this.tUtl.registerTouchArea(area, true);
    }
    init(): Promise < {} > {
        this.mMdl.currentFoodNodes = [];
        this.mMdl.foodPool = new PrefabPool('Food', this.foodPrefab)
        let p1 = this.loadFoodRes();
        let p2 = this.loadAnimalRes();
        return Promise.all([p1, p2]);
    }
    private loadFoodRes() {
        let that = this;
        return new Promise((resolve, reject) => {
            //获取所有的渲染对象
            let results = Promise.all(that.mMdl.foodDatas.map((foodData) =>{
                return that.mUtl.spriteRes(foodData.image)
            }));
            results.then((spriteFrames)=>{
                spriteFrames.forEach((spriteFrame, i) => {
                    that.mMdl.foodDatas[i].spriteFrame = spriteFrame;
                });
                //完成过程
                resolve();
            })
        });
    }
    private loadAnimalRes() {
        let that = this;
        return new Promise((resolve, reject) => {
            //获取所有的渲染对象
            let results = Promise.all(that.mMdl.animalDatas.map((animalData) =>{
                            return that.mUtl.spriteRes(animalData.image)
                        }));
            results.then((spriteFrames) => {
                if (spriteFrames) {
                    spriteFrames.forEach((spriteFrame, i) => {
                        that.mMdl.animalDatas[i].spriteFrame = spriteFrame;
                    });
                }
                //完成过程
                resolve();
            })
        })
    }
    private generateAnimals(){
        let that = this;
        this.mMdl.animalDatas.forEach((animalData, i) => {
            let animalNode = cc.instantiate(that.animalPrefab);
            let animal = animalNode.getComponent(Animal);
            let sprite = animalNode.getComponent(cc.Sprite);
            //注意，未被添加到空间中的节点不会被初始化，所以这里需要先引入节点再执行节点的函数
            that.animalsNode.addChild(animalNode);
            sprite.spriteFrame = animalData.spriteFrame;
            animal.type = animalData.type;
            animal.rePositonAnimal(i);
        })
    }
}