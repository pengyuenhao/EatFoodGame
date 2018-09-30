import Common from "../../common";
import WxGameApi from "../WxGameApi";

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        //引入JS文件到TS环境
        Common.WxGameApi = WxGameApi;
        if (!WxGameApi.isRunInWeiXin) return;
        let videoName = "video.mp4";
        let bgmName = "bgm.mp3";
        let videoUrl = "https://636f-common-510ecc-1257233686.tcb.qcloud.la/default_video.mp4";
        let bgmUrl = "https://636f-common-510ecc-1257233686.tcb.qcloud.la/bgm.mp3";
        let getCachePromise = (url,name,complete) => {
            return new Promise((resolve, reject) => {
                WxGameApi.getOrCacheResFile(url, name, (resPath) => {
                    complete(resPath);
                    //传递结果给下一个异步过程
                    resolve();
                });
            })
        }
        //缓存BGM
        let p1 = getCachePromise(bgmUrl,bgmName,(resPath)=>{
            WxGameApi.playBGM(resPath);
        });
        //缓存视频
        let p2 = getCachePromise(videoUrl,videoName,(resPath)=>{
            Common.viedo = resPath;
        });
        //启动异步的下载过程
        let time = new Date().getSeconds();
        let results = Promise.all([p1,p2]);
        //获取结果
        results.then(()=>{
            let diff = new Date().getSeconds() - time;
            console.info("[缓存完成]" + diff + "[秒]");
        });

        console.info("[登入微信平台]");
        wx.login({
            success(res) {
                console.info("[登录成功]" + res);
            },
            fail(res) {
                console.info("[登录失败]" + res);
            }
        });
        //同步启动选项
        this.launchOptionsSync();
        this.preloadFriendInfo();
        this.preloadGroupInfo();
    },
    preloadFriendInfo() {
        if (WxGameApi.isRunInWeiXin) {
            //console.info("[启动排行榜]" + this.subContextView.width + "," + this.subContextView.height);
            wx.getOpenDataContext().postMessage({
                message: {
                    type: "command",
                    function: "preload",
                    arguments: "friend",
                    data: "",
                }
            });
        }
    },
    preloadGroupInfo() {
        if (!Common.shareTickets || Common.shareTickets.length === 0) return;
        wx.getOpenDataContext().postMessage({
            message: {
                type: "command",
                function: "preload",
                arguments: "group",
                data: Common.shareTickets[0],
            }
        });
    },
    launchOptionsSync() {
        if (!Common.shareTickets) Common.shareTickets = [];
        let info = wx.getLaunchOptionsSync();
        console.info("[同步启动选项]" + info);
        switch (info.scene) {
            case 1044:
                if (info.shareTicket) {
                    Common.shareTickets.push(info.shareTicket);
                }
                break;
            default:
                break;
        }
    }
});