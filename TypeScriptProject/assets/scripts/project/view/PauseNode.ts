import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { IocView } from "../../lib/extensions/IocView";
import { MainSignalEnum } from "../signal/MainSignalEnum";
import { __IC_Model, ModelType } from "../util/Model";
import { MainModel } from "../Model/MainModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseNode extends IocView {
    @inject(__IC_Model,ModelType.Main)
    mMdl:MainModel
    @property(cc.Label)
    score:cc.Label = null;
    @property(cc.Sprite)
    mainButton:cc.Sprite;
    @property(cc.Label)
    mainTop:cc.Label = null;
    @property(cc.Label)
    mainBotton:cc.Label = null;
    @property(cc.SpriteFrame)
    playVideo : cc.SpriteFrame;
    @property(cc.SpriteFrame)
    replayFrame : cc.SpriteFrame;

    onLoad () {
        super.onLoad();
    }

    start () {
        super.start();
    }
    show(){
        //如果已经观看过广告了
        if(this.mMdl.isLookVideo){
            console.info("[无法复活]");
            this.mainButton.spriteFrame = this.replayFrame;
            this.mainTop.string = "再接再厉";
            this.mainBotton.string = "重新开始";
        }else{
            console.info("[可以复活]");
            this.mainButton.spriteFrame = this.playVideo;
            this.mainTop.string = "观看广告";
            this.mainBotton.string = "满血复活";
        }
    }
    updateScore(value){
        this.score.string = value;
    } 
    //重新开始按钮被点击时
    onRestartClicked(){
        console.info("[观看过广告]"+this.mMdl.isLookVideo);
        if(this.mMdl.isLookVideo){
            this.sMgr.get(MainSignalEnum.Restart).dispatch(false);
        }
        else{
            //发布重新开始信号并且播放视频
            this.sMgr.get(MainSignalEnum.Restart).dispatch(true);
        }
    }
    //排行榜按钮被点击时
    onLookRankClicked(){
        this.sMgr.get(MainSignalEnum.LookRank).dispatch();
    }
    onBackHomeClicked(){
        this.sMgr.get(MainSignalEnum.BackHome).dispatch();
    }
    // update (dt) {}
}
