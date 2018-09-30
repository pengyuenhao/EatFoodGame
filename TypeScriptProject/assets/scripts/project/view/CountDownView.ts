import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { MainModel } from "../Model/MainModel";
import { __IC_Model, ModelType } from "../util/Model";
import { IocView } from "../../lib/extensions/IocView";

const {ccclass,property} = cc._decorator

@ccclass
export default class CountDownView extends IocView {
    private value;
    private time;
    private step;
    private completeList;
    private isPlay;
    private alpha;
    private isIn;

    private lastLabel;
    onLoad() {
        super.onLoad();
        this.isPlay = false;
        this.alpha = 0;
        this.isIn = true;
        this.completeList = [];
    }
    start(){
        super.start();
    }
    /**
     * 配置
     * @param start 起始值 
     * @param duration 持续时间
     */
    config(start,duration){
        this.time = duration;
        this.value = start;
        if(this.value ===0)this.step = 0;
        else this.step = this.value / this.time;
        return this;
    }
    //播放
    play(){
        this.isPlay = true;
        return this;
    }
    onComplete(complete){
        this.completeList.push(complete);
        return this;
    }
    update(dt){
        if(!this.isPlay)return;
        if(this.value>=0){
            let before = this.value;
            this.value -= dt * this.step;
            let after = Math.floor(this.value);
            //如果整数部分发生变化
            if(before !== after){
                let label;
                if(!this.lastLabel){
                    label = new cc.Node().addComponent(cc.Label);
                    this.node.addChild(label.node);
                    this.lastLabel = label;
                }else{
                    label = this.lastLabel;
                }
                label.node.color = cc.color(255,255,255,0);
                this.isIn = true;
                //执行动画效果
                if(after>=0){
                    label.string = ""+after;
                }else{
                    //spawnActions.push(cc.sequence([cc.scaleBy(0.25*this.step,1.25),cc.scaleBy(0.25*this.step,0.75)]));
                    label.string = "Go~!";
                }
            }else{
                //动态效果
                if(this.lastLabel){
                    if(this.isIn){
                        if(this.alpha>=255){
                            this.isIn = false;
                        }else{
                            this.alpha += dt * this.step * 0.25 * 255;
                        }
                    }else{
                        this.alpha -= dt * this.step * 0.75 * 255;
                    }
                    this.lastLabel.node.color = cc.color(255,255,255,this.alpha);
                }
            }
        }else{
            this.isPlay = false;
            //执行完成回调
            this.completeList.forEach(complete => {
                complete();
            });
            this.destroy();
        }
    }
}