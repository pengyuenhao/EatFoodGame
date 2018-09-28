import Common from "../../common";
import WxGameApi from "../WxGameApi";

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad(){
        if(!WxGameApi.isRunInWeiXin)return;
        WxGameApi.playBGM("https://636f-common-510ecc-1257233686.tcb.qcloud.la/bgm.mp3?sign=13c065e7d82084906a0147ece1d1e47f&t=1538131480");
        console.info("[登入微信平台]");
        wx.login({
            success(res){
                console.info("[登录成功]" + res);
            },
            fail(res){
                console.info("[登录失败]" + res);
            }
        });
        //同步启动选项
        this.launchOptionsSync();
        //设置存储分数的方法并获取最高分
        if(!Common.saveScoreFunc){
            //获取最高分数据后绑定存储分数的方法
            Common.saveScoreFunc = this.saveScore;
        }

    },
    launchOptionsSync(){
        if(!Common.shareTickets)Common.shareTickets=[];
        let info = wx.getLaunchOptionsSync();
        console.info("[同步启动选项]"+info);
        switch(info.scene){
            case 1044:
                if(info.shareTicket){
                    Common.shareTickets.push(info.shareTicket);
                }
                break;
            default:
                break;
        }
    },
    //存储游戏分数
    saveScore(value){
        let score =  Number(value);
        //检查是否为最高分
        if(score&&score>Common.maxScore){
            Common.maxScore = score;
        }
        console.info("[通知开发数据容器存储分数]"+score);
        //发送存储分数消息告知开放数据容器
        wx.getOpenDataContext().postMessage({
            message:{
                type: "command",
                function: "save",
                arguments : "score",
                data: Common.maxScore,
            }
        });
    }
});