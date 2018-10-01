import { __IC_Model, ModelType } from "../util/Model";
import { Shake } from "../../lib/extensions/ActionExtension";

const {ccclass,property} = cc._decorator

@ccclass
export default class CountDownView extends cc.Component {
    @property(Number)
    private value : number = 3;
    @property(Number)
    private time: number = 3;
    @property(Boolean)
    private isAutoPlay : boolean = false;

    //单步运行的比率
    private step : number;
    //单步的持续时间
    private stepDur : number;
    private completeList;
    private isPlay;
    private alpha;
    private isIn;
    private label;

    onLoad() {
        //super.onLoad();
        this.label = this.node.getComponent(cc.Label);
        this.isPlay = false;
        this.completeList = [];
    }
    start(){
        //super.start();
        if(this.isAutoPlay)this.play();
    }
    /**
     * 配置
     * @param start 起始值 
     * @param duration 持续时间
     */
    config(start,duration){
        this.time = duration;
        this.value = start;

        return this;
    }
    //播放
    play(){
        this.isPlay = true;
        //如果持续时间或者开始时间为0
        if(this.value ===0||this.time===0){
            this.step = 0;
        }
        else{
            this.step = this.value / this.time;
            this.stepDur = this.time/this.value;
        } 

        return this;
    }
    onComplete(complete){
        this.completeList.push(complete);
        return this;
    }
    update(dt){
        if(!this.isPlay)return;

        if(this.value>=0&&this.step>0){
            let before = Math.floor(this.value);
            this.value -= dt * this.step;
            this.time -= dt;
            let after = Math.floor(this.value);
            //如果整数部分发生变化
            if(before !== after){
                this.node.stopAllActions();
                this.node.scale = 0.5;
                this.node.opacity = 0;

                let scaleActions = [cc.scaleBy(0.35*this.stepDur,5),cc.scaleBy(1*this.stepDur,0.125)];
                let fadeActions = [cc.fadeIn(0.35*this.stepDur),cc.fadeOut(1*this.stepDur)];

                //执行动画效果
                if(after>=1){
                    this.label.string = ""+after;
                }else{
                    this.node.runAction(Shake.create(1*this.stepDur,20,20));
                    this.label.string = "Go~!";
                }
                this.node.runAction(cc.sequence(scaleActions));
                this.node.runAction(cc.sequence(fadeActions));
            }
        }else{
            this.isPlay = false;
            //执行完成回调
            this.completeList.forEach(complete => {
                complete();
            });
            this.node.destroy();
        }
    }
}