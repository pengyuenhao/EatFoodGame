import { Command } from "../../lib/framework/Command/Command";
import { MainModel } from "../Model/MainModel";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import Animal from "../view/Animal";
import { __IC_Model, ModelType } from "../util/Model";
import { TouchUtil, TouchDirection, TouchStatus } from "../util/TouchUtil";
import { InputModel } from "../Model/InputModel";
import { __IC_Util, UtilType } from "../util/Util";
import { __IC_Manager, ManagerType } from "../util/Manager";
import AudioManager from "../util/AudioManager";
import Common from "../Common";
import { MainUtil } from "../util/MainUtil";

/**
 * 输入控制指令
 */
export class InputControlCommand extends Command{
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(__IC_Model,ModelType.Input)
    iMdl : InputModel;
    @inject(cc.Node,"Animals")
    animalsNode : cc.Node;
    @inject(cc.Node,"Avatar")
    avatarNode : cc.Node;
    @inject(__IC_Util,UtilType.Main)
    mUtl : MainUtil;
    @inject(__IC_Util,UtilType.Touch)
    tUtl : TouchUtil;
    @inject(__IC_Manager,ManagerType.Audio)
    aMgr : AudioManager;

    execute(){
        let that = this;
        let xRange = this.avatarNode.x + this.mUtl.getSceneSize().width*0.5;
        let yRange = this.avatarNode.y + this.mUtl.getSceneSize().height*0.5;

        //注册一个使用全局区域的上划回调
        this.tUtl.on(TouchDirection.Up,(status:TouchStatus)=>{
            if(status.sPosX>=xRange){
                that.areaOnMove(0);
            }else{
                that.areaOnMove(1);
            }
        });
        this.tUtl.on(TouchDirection.Down,(status:TouchStatus)=>{
            if(status.sPosX>=xRange){
                that.areaOnMove(1);
            }else{
                that.areaOnMove(0);
            }
        });
        this.tUtl.on(TouchDirection.Left,(status:TouchStatus)=>{
            if(status.sPosY>=yRange){
                that.areaOnMove(2);
            }else{
                that.areaOnMove(3);
            }
        });
        this.tUtl.on(TouchDirection.Right,(status:TouchStatus)=>{
            if(status.sPosY>=yRange){
                that.areaOnMove(3);
            }else{
                that.areaOnMove(2);
            }
        });
    }

    areaOnMove(direction : TouchDirection) {
        //如果暂停标志位为真并且不在准备状态则直接返回
        if (this.mMdl.pauseFlag&&!this.mMdl.readyFlag) return;
        this.rotateAnimals(direction);
    }
    //旋转动物
    rotateAnimals(direction) {
        //如果正处于旋转中，则将缓存下一步操作
        if (this.mMdl.isRotationing) {
            this.iMdl.waitingDirection = direction;
            return;
        }
        //播放跳跃音效
        this.aMgr.play("Jump");
        if(Common.operatorMode ==0)
            this.byScaleSpin(direction);
        else 
            this.byRotateSpin(direction);
        
    }
    byScaleSpin(direction){
        let that = this;
        this.mMdl.isRotationing = true;
        let [x, y] = (direction==0||direction==1) ? [1, 0] : [0, 1];
        let rotateAction = cc.scaleTo(this.mMdl.rotateDur * 0.5, x, y)
        let rotateActionEnd = cc.scaleTo(this.mMdl.rotateDur * 0.5, 1, 1)
        this.iMdl.lastAction = this.animalsNode.runAction(cc.sequence(rotateAction,cc.callFunc(()=>{
            //交换节点的排序
            that.resetAnimalsNode(direction);
            //重置节点的位置
            if(that.animalsNode.children&&this.animalsNode.children.length>0){
                //遍历并重新设置所有动物节点的位置
                that.animalsNode.children.forEach((animalNode, i) => {
                    animalNode.stopAllActions();
                    animalNode.getComponent(Animal).rePositonAnimal(i)
                });
            }
            //this.animalsNode.setScale(1, 1);
        }),rotateActionEnd, cc.callFunc(() => {
            that.animalsNode.setScale(1, 1);
            that.mMdl.isRotationing = false;
            //执行之前等待中的操作
            if(that.iMdl.waitingDirection!==null&&that.iMdl.waitingDirection!==undefined){
                that.rotateAnimals(that.iMdl.waitingDirection);
                that.iMdl.waitingDirection = null;
            }
        })));
    }

    byRotateSpin(direction){
        let that = this;
        this.mMdl.isRotationing = true;
        let x = (direction==0||direction==2) ? -90 : 90;
        let rotateAction = cc.rotateBy(this.mMdl.rotateDur * 0.5, x)
        this.iMdl.lastAction = this.animalsNode.runAction(cc.sequence(cc.spawn(rotateAction,cc.callFunc(()=>{
            //交换节点的排序
            //that.resetAnimalsNode(direction);
            //重置节点的位置
            if(that.animalsNode.children&&this.animalsNode.children.length>0){
                let animalAction;
                //遍历并重新设置所有动物节点的位置
                that.animalsNode.children.forEach((animalNode, i) => {
                    animalAction = cc.rotateBy(this.mMdl.rotateDur * 0.5, -x);
                    animalNode.runAction(animalAction);
                    //animalNode.getComponent(Animal).rePositonAnimal(i)
                });
            }
            //this.animalsNode.setScale(1, 1);
        })), cc.callFunc(() => {
            that.mMdl.isRotationing = false;
            //执行之前等待中的操作
            if(that.iMdl.waitingDirection!==null&&that.iMdl.waitingDirection!==undefined){
                that.rotateAnimals(that.iMdl.waitingDirection);
                that.iMdl.waitingDirection = null;
            }
        })));
    }
    //重新设置所有节点的排序
    resetAnimalsNode(direction) {
        let animalsNodeChildren = this.animalsNode.children;
        if (direction==0||direction==1) {
            this.switchIndex(animalsNodeChildren, 0, 3)
            this.switchIndex(animalsNodeChildren, 1, 2)
        } else {
            this.switchIndex(animalsNodeChildren, 0, 1)
            this.switchIndex(animalsNodeChildren, 3, 2)
        }
        //this.animalsNode.setScale(1, 1)
    }
    //交换节点层级位置
    switchIndex(list, one, two) {
        let temp = list[two]
        list[two] = list[one]
        list[one] = temp
    }
}