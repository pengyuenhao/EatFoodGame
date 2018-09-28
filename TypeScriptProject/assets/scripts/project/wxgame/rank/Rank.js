import Common from "../../common";
import WxApi from "../WxApi";

cc.Class({
    extends: cc.Component,

    properties: {
        subContextView: cc.Node,
        tipsUiNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let that = this;
        this.rankType = 0;
        this.shareCount = 0;
        //设置转发选项
        if (WxApi.isRunInWeiXin) {
            wx.updateShareMenu({
                withShareTicket: true,
                success() {
                    console.info("设置转发选项成功");
                },
                fail() {
                    console.info("设置转发选项失败");
                }
            })
        }
        //this.subContextView.enabled = false;
        console.info("[初始化功能]");
    },

    start() {
        console.info("[主域进入排行榜界面]");
        //发送启动消息告知开发数据容器
        if (WxApi.isRunInWeiXin) {
            console.info("[启动排行榜]" + this.subContextView.width + "," + this.subContextView.height);
            wx.getOpenDataContext().postMessage({
                message: {
                    type: "command",
                    function: "start",
                    arguments: "default",
                    data: {
                        width: this.subContextView.width,
                        height: this.subContextView.height
                    },
                }
            });
        }
    },
    //切换排行榜
    switchRank(event) {
        //获取切换按钮
        let switchBtn = event.target;
        let switchBar = event.target.getChildByName("Switch");
        let moveRange = switchBtn.width - switchBar.width - 10;
        let that = this;
        //循环切换排行榜类型
        if (this.rankType < 1) {
            this.rankType += 1;
        } else {
            this.rankType = 0;
        }
        switch (this.rankType) {
            case 0:
                switchBar.runAction(cc.moveBy(0.125, cc.v2(-moveRange, 0)));
                if (WxApi.isRunInWeiXin) {
                    console.info("[显示好友排行]");
                    //切换到显示好友排行
                    wx.getOpenDataContext().postMessage({
                        message: {
                            type: "command",
                            function: "switch",
                            arguments: "friend",
                            data: "",
                        }
                    });
                }
                break;
            case 1:
                switchBar.runAction(cc.moveBy(0.125, cc.v2(moveRange, 0)));
                if (WxApi.isRunInWeiXin) {
                    let ticket;
                    if (Common.shareTickets && Common.shareTickets.length > 0) {
                        ticket = Common.shareTickets[this.shareCount];
                        if (!ticket) {
                            console.info("[意外的识别码缺失]" + Common.shareTickets +","+ this.shareCount);
                            Common.shareTickets = [];
                            this.shareCount = 0;
                        } else {
                            //循环切换群信息，索引是从0开始计算的，所以这里需要减一
                            if (this.shareCount >= (Common.shareTickets.length - 1)) {
                                this.shareCount = 0;
                            } else {
                                this.shareCount += 1;
                            }
                        }
                    } else {
                        console.info("[未找到群信息]");
                        this.showTipsUi("无法显示群排行榜", "请先分享到群再查看");
                    }
                    //验证群信息是否有效
                    if(ticket&&ticket!=""){
                        wx.getShareInfo({
                            shareTicket : ticket,
                            success(res){
                                console.info("[有效的群信息]" + ticket + "," + res);
                            },
                            fail(err){
                                console.info("[无效的群信息]" + ticket + "," + err);
                            }
                        })
                    }else{
                        ticket = "";
                    }
                    console.info("[显示群信息]" + Common.shareTickets.length);
                    //切换到显示群排行
                    wx.getOpenDataContext().postMessage({
                        message: {
                            type: "command",
                            function: "switch",
                            arguments: "group",
                            data: ticket,
                        }
                    });
                }
                break;
            default:
                break;
        }
        console.info("[切换排行榜]" + this.rankType);
    },

    backhome() {
        cc.director.loadScene("Begin");
    },

    shareApp() {
        if (!WxApi.isRunInWeiXin) return;
        let that = this;
        wx.shareAppMessage({
            title: "一起来玩游戏吧！",
            success(res) {
                console.info("[转发成功]" + res.shareTickets);
                //没有获取到群消息
                if (!res.shareTickets || res.shareTickets === "") {
                    console.info("[转发到个人用户]");
                } else {
                    console.info("[转发到微信群]" + res.shareTickets);
                    //如果存在群组信息
                    if (res.shareTickets.length > 0) {
                        let isExist = false;
                        //保存群组信息
                        for (let i = 0; i < res.shareTickets.length; i++) {
                            for (let j = 0; j < Common.shareTickets.length; j++) {
                                //检查是否存在重复的群识别号
                                if (res.shareTickets[i] === Common.shareTickets[j]) {
                                    isExist = true;
                                    break;
                                }
                            }
                            if (!isExist) {
                                console.info("[存储群识别码]" + res.shareTickets[i]);
                                Common.shareTickets.push(res.shareTickets[i]);
                            }
                        }
                    }
                }
            },
            fail(res) {
                console.info("[转发失败]");
            }
        });

    },
    //显示提示框
    showTipsUi(title, content) {
        if (!this.tipsUiNode.active) {
            this.tipsUiNode.active = true;
            let tipsUiView = this.tipsUiNode.getComponent("TipsUiView");
            if (tipsUiView) {
                tipsUiView.display(title, content);
            } else {
                console.info("[提示UI不存在]");
            }
        }
    },
});