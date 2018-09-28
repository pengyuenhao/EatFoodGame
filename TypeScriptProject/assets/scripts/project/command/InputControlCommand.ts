import { Command } from "../../lib/framework/Command/Command";
import { MainModel } from "../context/MainModel";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import Animal from "../view/Animal";
import { __IC_Model, ModelType } from "../util/Model";
import { __IC_Util } from "../util/MainUtil";
import { TouchUtil, TouchDirection, TouchStatus } from "../util/TouchUtil";

/**
 * 输入控制指令
 */
export class InputControlCommand extends Command{
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(cc.Node,"Animals")
    animalsNode : cc.Node;
    @inject(__IC_Util,"Touch")
    tUtl : TouchUtil;

    execute(){
        let that = this;
        //注册一个使用全局区域的上划回调
        this.tUtl.on(TouchDirection.Up,(status:TouchStatus)=>{
            if(status.sPosX>0){
                that.areaOnMove(TouchDirection.Up);
            }else{
                that.areaOnMove(TouchDirection.Down);
            }
        });
        this.tUtl.on(TouchDirection.Down,(status:TouchStatus)=>{
            if(status.sPosX>0){
                that.areaOnMove(TouchDirection.Up);
            }else{
                that.areaOnMove(TouchDirection.Down);
            }
        });
        this.tUtl.on(TouchDirection.Left,(status:TouchStatus)=>{
            if(status.sPosY>0){
                that.areaOnMove(TouchDirection.Left);
            }else{
                that.areaOnMove(TouchDirection.Right);
            }
        });
        this.tUtl.on(TouchDirection.Right,(status:TouchStatus)=>{
            if(status.sPosY>0){
                that.areaOnMove(TouchDirection.Left);
            }else{
                that.areaOnMove(TouchDirection.Right);
            }
        });
    }

    areaOnMove(direction : TouchDirection) {
        //如果暂停标志位为真则直接返回
        if (this.mMdl.pauseFlag) return
        if (direction === TouchDirection.Left || direction === TouchDirection.Right) {
            this.rotateAnimals(0)
        } else if (direction === TouchDirection.Up || direction === TouchDirection.Down) {
            this.rotateAnimals(1)
        }
    }
    //旋转动物
    rotateAnimals(direction) {
        if (this.mMdl.isRotationing) return
        let that = this;
        this.mMdl.isRotationing = true
        const [x, y] = direction ? [1, -1] : [-1, 1]
        const rotateAction = cc.scaleBy(this.mMdl.rotateDur, x, y)
        this.animalsNode.runAction(cc.sequence(rotateAction, cc.callFunc(() => {
            that.resetAnimalsNode(direction);
            if(that.animalsNode.children&&this.animalsNode.children.length>0){
                //遍历并旋转所有动物节点
                that.animalsNode.children.forEach((animalNode, i) => animalNode.getComponent(Animal).rePositonAnimal(i))
            }
            that.mMdl.isRotationing = false
        })))
    }

    resetAnimalsNode(direction) {
        const animalsNodeChildren = this.animalsNode.children;
        if (!direction) {
            this.switchIndex(animalsNodeChildren, 0, 1)
            this.switchIndex(animalsNodeChildren, 3, 2)
        } else {
            this.switchIndex(animalsNodeChildren, 0, 3)
            this.switchIndex(animalsNodeChildren, 1, 2)
        }
        this.animalsNode.setScale(1, 1)
    }

    switchIndex(list, one, two) {
        const temp = list[two]
        list[two] = list[one]
        list[one] = temp
    }
}