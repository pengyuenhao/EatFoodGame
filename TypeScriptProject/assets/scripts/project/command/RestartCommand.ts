import { Command } from "../../lib/framework/Command/Command";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { MainModel } from "../Model/MainModel";
import { __IC_Model, ModelType } from "../util/Model";
import Common from "../Common";
import { __IC_Util, UtilType } from "../util/Util";
import { MainUtil } from "../util/MainUtil";
import { __IC_Manager, ManagerType } from "../util/Manager";
import PrefabManager from "../util/PrefabManager";
import CountDownView from "../view/CountDownView";

//引用注入装饰器
export class RestartCommand extends Command{
    @inject(cc.Node,"Pause")
    pauseNode : cc.Node;
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;
    @inject(__IC_Util,UtilType.Main)
    mUtl : MainUtil;
    @inject(cc.Node,"Score")
    scoreNode : cc.Node;
    @inject(__IC_Manager,ManagerType.Prefab)
    preMgr : PrefabManager;
    @inject(cc.Node,"MainNode")
    mainNode : cc.Node;

    execute(isPlayVideo){
        //console.info("[重新开始]");
        this.revive();
        //是否需要播放广告
        if(isPlayVideo){
            this.playVideo();
        }else{
            console.info("[不播放广告]");
            this.restart(true);
        }
    }
    playVideo(){
        //是否已经看过广告
        if(!this.mMdl.isLookVideo){
            this.mMdl.isLookVideo = true;
        }
        //是否为微信环境
        if(Common.WxGameApi.isRunInWeiXin){
            console.info("[微信环境]");
            //从本地直接获取视频资源
            if(Common.viedo){
                let width = this.mUtl.getSceneSize().width*0.25;
                let height = this.mUtl.getSceneSize().width*0.25;
                let x = width/4;
                let y = this.mUtl.getSceneSize().height/4 - height;
                let url = Common.viedo;
                Common.WxGameApi.checkCacheExistFile(url,(result)=>{
                    if(result){
                        //记录当前的播放器
                        Common.viedoHandle = Common.WxGameApi.playVideo(x,y,width,height,url,10000,true,()=>{
                            //重新开始但不结算
                            this.restart(false);
                        });
                        console.info("[使用缓存路径]");
                    }else{
                        console.info("[缓存路径无效]");
                        this.restart(false);
                    }
                })
            }else{
                console.info("[播放广告失败]");
                this.restart(false);
            }
        }else{
            console.info("[无法播放广告]");
            this.restart(false);
        }
    }
    //清理环境
    revive() {
        this.pauseNode.active = false
        this.clearAllCurrent()
    }
    //结算分数
    result(){
        this.mMdl.isLookVideo = false;
        this.mMdl.lastScore = this.mMdl.score;
        Common.WxGameApi.saveScore(this.mMdl.lastScore);
        this.mMdl.score = 0;
        this.scoreNode.getComponent(cc.Label).string = 'Score: ' + Number(this.mMdl.score)
    }
    /**
     * 重新开始
     * @param isResult 是否进行结算
     */
    restart(isResult:boolean){
        this.mMdl.lastFoodIndex = -1
        this.mMdl.lastTrack = -1
        this.mMdl.lastTimer = 0
        this.mMdl.timePeriod = 2.5
        this.mMdl.currentLevel = 0;                    
        this.mMdl.timer = this.mMdl.timePeriod;
        
        let waitStartTime;
        let waitDurTime;
        //是否结算分数
        if(isResult){
            this.result();
            waitStartTime = 4;
            waitDurTime = 1.5;
        }else{
            waitStartTime = 1;
            waitDurTime = 0.75;
        }

        if(this.preMgr.hasPrefab("CountDown")){
            let countDown : cc.Node = cc.instantiate(this.preMgr.getPrefab("CountDown"));
            this.mainNode.addChild(countDown);
            countDown.getComponent(CountDownView).config(waitStartTime,waitDurTime).onComplete(()=>{
                this.mMdl.pauseFlag = false;
            }).play();
        }else{
            this.mMdl.pauseFlag = false;
        }
    }

    clearAllCurrent() {
        if(this.mMdl.currentFoodNodes&&this.mMdl.currentFoodNodes.length>0){
            this.mMdl.currentFoodNodes.forEach(foodNode => {
                this.mMdl.foodPool.res(foodNode)
            })
        }
        this.mMdl.currentFoodNodes = []
    }
}