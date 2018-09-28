import {
    OpenCommon
} from "./OpenCommon";

cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        prefab: cc.Prefab
    },

    start() {
        let that = this;
        this.rank = 0;
        //监听主域通过微信API发送到子域的消息
        wx.onMessage(data => {
            if (data && data.message) {
                console.info("[子域收到消息]" + data.message);
                that.resolveMessage(data.message);
            }
        });
    },
    //创建使用者区块
    createUserBlock(user) {
        let that = this;
        let node = this.createPrefab();
        // getUserInfo will return the nickName, getFriendCloudStorage will return the nickname.
        let nickName;
        let avatarUrl;
        let score;
        //如果存在信息
        if(user){
            nickName = user.nickName ? user.nickName : user.nickname;
            avatarUrl = user.avatarUrl;
            score = this.resolveCloudStorage(user.KVDataList, "OneEatMaxScore");
        }
        //尝试解析数据
        let userRank = node.getChildByName('rank').getComponent(cc.Label);
        let userName = node.getChildByName('userName').getComponent(cc.Label);
        let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);
        let userScore = node.getChildByName('userScore').getComponent(cc.Label);

        //如果名称存在则创建对应的区块，否则创建空区块
        if (nickName) {
            if (!score) {
                score = "null";
                userRank.string = "null";
            }else{
                that.rank += 1;
                userRank.string = that.rank;
                switch(that.rank){
                    case 1:
                        userRank.node.color = new cc.Color(255, 0, 0);
                        break;
                    case 2:
                        userRank.node.color = new cc.Color(0, 255, 0);
                        break;
                    case 3:
                        userRank.node.color = new cc.Color(0, 0, 255);
                        break;
                    default:
                        userRank.fontSize = userRank.fontSize / 2;
                        break;
                }
            }
            userName.string = nickName;
            userScore.string = score;
            console.log("[获取好友信息]" + nickName);
            //如果头像存在
            if (avatarUrl) {
                cc.loader.load({
                    url: avatarUrl,
                    type: 'png'
                }, (err, texture) => {
                    if (err) console.error(err);
                    userIcon.spriteFrame = new cc.SpriteFrame(texture);
                });
            }
            node.on(cc.Node.EventType.TOUCH_START, () => {
                console.info("[点击区块1]" + userName.string + "[分数]" + userScore.string);
            }, this);
        }else{
            userName.string = "";
            userScore.string = "";
            userIcon.spriteFrame = "";
            userRank.string = "";
        }
    },
    createPrefab() {
        let node = cc.instantiate(this.prefab);
        node.parent = this.content;
        return node;
    },
    //分解主域传递过来的信息
    resolveMessage(message) {
        console.info("[指令]" + message.type);
        switch (message.type) {
            case "command":
                this.resolveCommand(message.function, message.arguments, message.data);
                break;
            default:
                break;
        }
    },

    resolveCommand(func, args, data) {
        console.info("[指令]" + func + "[参数]" + args + "[数据]" + data);
        switch (func) {
            case "start":
                new Promise((resolve) => {
                    this.clearContext();
                    //获取用户信息
                    this.getUserInfo((result) => {
                        resolve(result);
                    });
                    if (data && data.width && data.height) {
                        console.info("[修正分辨率]" + data.width + "," + data.height);
                        //修改分辨率
                        this.getComponent(cc.Canvas).designResolution = new cc.size(data.width, data.height);
                    }
                }).then((result) => {
                    console.info("[是否得到用户信息]" + result);
                    //获取朋友信息
                    this.getFriendInfo(["OneEatMaxScore"]);
                    //this.resolveCommand("switch","friend","");
                });
                break;
            case "switch":
                this.clearContext();
                switch (args) {
                    case "friend":
                        //获取好友最高分信息
                        this.getFriendInfo(["OneEatMaxScore"]);
                        break;
                    case "group":
                        //如果是从群分享卡片中打开的则可以查看同玩信息
                        if (data) {
                            console.info("[根据]" + data + "[获取群组信息]");
                            //获取群信息
                            this.getGroupInfo(data, ["OneEatMaxScore"]);
                        } else {
                            console.info("[无法获取群组信息]");
                        }
                        break;
                }
                break;
            case "save":
                switch (args) {
                    case "gameDiamond":
                        console.info("[存储游戏钻石]" + data);
                        break;
                    case "gameCurrency":
                        console.info("[存储游戏币]" + data);
                        break;
                    case "score":
                        console.info("[存储分数]" + data);
                        if (data > OpenCommon.maxScore) {
                            console.info("[新的最高分数]" + data);
                            this.saveMaxScoreData(data);
                        }
                        break;
                    case "shareTicket":
                        console.info("[存储群识别码]" + data);
                        break;
                }
                break;
            default:
                break;
        }
    },
    //移除容器内所有子节点
    clearContext() {
        this.rank = 0;
        this.content.removeAllChildren();
        console.info("[清理容器]");
    },
    getUserInfo(result) {
        let that = this;
        //如果没有用户信息则尝试获取用户信息
        if (!OpenCommon.userInfo) {
            //微信在子域内调用获取用户信息API
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                lang: 'zh_CN',
                success: (res) => {
                    //获取用户信息
                    let userInfo = res.data[0];
                    //保存用户信息
                    OpenCommon.userInfo = userInfo;
                    console.info("[获取用户信息成功]" + userInfo);
                    //尝试获取用户托管数据
                    that.getUserMaxScoreData((score) => {
                        let nickName = userInfo.nickName;
                        let avatarUrl = userInfo.avatarUrl;
                        let maxScore = score;
                        //如果存在使用者区块
                        if (that.userBlock) {
                            let userAvatarSprite = that.userBlock.getChildByName('Mask').getComponentInChildren(cc.Sprite);
                            let nickNameLabel = that.userBlock.getChildByName('Name').getComponent(cc.Label);
                            let maxScoreLabel = that.userBlock.getChildByName('Score').getComponent(cc.Label);

                            nickNameLabel.string = nickName;
                            cc.loader.load({
                                url: avatarUrl,
                                type: 'png'
                            }, (err, texture) => {
                                if (err) console.error(err);
                                userAvatarSprite.spriteFrame = new cc.SpriteFrame(texture);
                            });
                            //检查是否存在最高分
                            if (maxScore) {
                                maxScoreLabel.string = score;
                            } else {
                                maxScoreLabel.string = "null";
                            }
                        }
                        result(true);
                    });
                },
                fail: (res) => {
                    //reject(res);
                    console.info("[获取用户信息失败]" + res);
                    result(false);
                }
            });
        }else{
            result(true);
        }

    },

    getFriendInfo(keys) {
        let that = this;
        let kList;

        if (OpenCommon.localStorageMap.has("Friend")) {
            let dict = OpenCommon.localStorageMap.get("Friend");

            kList = [];
            for (let i = 0; i < keys.length; i++) {
                //如果有缓存信息
                if (dict.has(keys[i])) {
                    console.info("[从缓存获取好友托管数据]" + keys[i]);
                    let data = dict.get(keys[i]);
                    that.createInfoBlock(data, 10);
                } else {
                    kList.push(keys[i]);
                }
            }
        } else {
            kList = keys;
        }

        //如果有未缓存的数据则请求云端获取
        if (kList.length > 0) {
            console.info("[开始获取好友托管数据]" + kList);
            // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getFriendCloudStorage.html
            wx.getFriendCloudStorage({
                keyList: keys,
                success: function (res) {
                    console.info("[成功获取朋友信息]", res.data);
                    //解析数据信息
                    let data = that.resolveInfo("Friend", "OneEatMaxScore", res.data);
                    that.createInfoBlock(data, 10);
                },
                fail: function (res) {
                    console.error(res);
                }
            });
        }
    },
    //解析数据信息
    resolveInfo(type, key, data) {
        let that = this;
        //排序
        that.sortList(data, key, false);
        let infoMap;
        if (OpenCommon.localStorageMap.has(type)) {
            infoMap = OpenCommon.localStorageMap.get(type);
        } else {
            infoMap = new Map();
            OpenCommon.localStorageMap.set(type, infoMap);
            console.info("[创建数据缓存]"+infoMap);
        }
        //缓存数据信息
        infoMap.set(key, data);

        return data;
    },
    createInfoBlock(data, length) {
        let that = this;
        for (let i = 0; i < length; i++) {
            let friendInfo = data[i];
            //如果朋友信息存在则创建信息否则创建空信息
            if (friendInfo) {
                that.createUserBlock(friendInfo);
            } else {
                that.createUserBlock();
            }
        }
    },

    getGroupInfo(groupShareTicket, keys) {
        let that = this;
        let kList;

        if (OpenCommon.localStorageMap.has("Group")) {
            let dict = OpenCommon.localStorageMap.get("Group");

            kList = [];
            for (let i = 0; i < keys.length; i++) {
                //如果有缓存信息
                if (dict.has(keys[i])) {
                    console.info("[从缓存获取群组托管数据]" + keys[i]);
                    let data = dict.get(keys[i]);
                    that.createInfoBlock(data, 10);
                } else {
                    kList.push(keys[i]);
                }
            }
        } else {
            kList = keys;
        }

        //如果有未缓存的数据则请求云端获取
        if (kList.length > 0) {
            console.info("[开始获取好友托管数据]" + kList);
            // https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getFriendCloudStorage.html
            wx.getGroupCloudStorage({
                shareTicket: groupShareTicket,
                keyList: keys,
                success: function (res) {
                    console.info("[成功获取群组信息]", res.data);
                    //解析数据信息
                    let data = that.resolveInfo("Group", "OneEatMaxScore", res.data);
                    that.createInfoBlock(data, 10);
                },
                fail: function (res) {
                    console.error(res);
                }
            });
        }
    },
    //获取用户的最高分记录
    getUserMaxScoreData(result) {
        let that = this;
        let kvDataList = new Array();
        //获取游戏最高分数
        kvDataList.push("OneEatMaxScore");
        wx.getUserCloudStorage({
            keyList: kvDataList,
            success(res) {
                console.info("[获取用户托管数据成功]" + res.KVDataList.length);
                let score = that.resolveCloudStorage(res.KVDataList, "OneEatMaxScore");
                if (score) {
                    console.info("[获取托管最高分成功]")
                    OpenCommon.maxScore = score;
                    result(score);
                } else {
                    that.saveMaxScoreData(0);
                    result(0);
                }
                OpenCommon.isGetMaxScoreSuccess = true;
            },
            fail(res) {
                console.info("[获取托管数据失败]");
                OpenCommon.isGetMaxScoreSuccess = false;
                result(0);
            }
        });
    },
    //解析云存储数据
    resolveCloudStorage(kVDataList, Key) {
        //数据无效则直接返回
        if (!kVDataList) return null;
        console.log("[托管数据数量]" + kVDataList.length);
        for (let i = 0; i < kVDataList.length; i++) {
            if (kVDataList[i].key === Key) {
                return kVDataList[i].value;
                console.info("[获取托管键值]" + Key + "[数据]" + kVDataList[i].value);
                break;
            }
        }
    },
    //存储托管数据
    saveCloudStorage(kVDataList, success, fail) {
        wx.setUserCloudStorage({
            KVDataList: kVDataList,
            success,
            fail
        });
    },
    saveMaxScoreData(value) {
        let kvDataList = new Array();
        kvDataList.push({
            key: "OneEatMaxScore",
            value: "" + value
        });
        this.saveCloudStorage(kvDataList, () => {
            console.info("[存储最高分数据成功]");
        }, () => {
            console.info("[存储最高分数据失败]");
        });
    },
    //排序(ListData：res.data;order:false降序，true升序)
    sortList(ListData, key, order) {
        ListData.sort(function (a, b) {
            let AMaxScore = 0;
            let KVDataList = a.KVDataList;
            for (let i = 0; i < KVDataList.length; i++) {
                if (KVDataList[i].key == key) {
                    AMaxScore = KVDataList[i].value;
                }
            }
            let BMaxScore = 0;
            KVDataList = b.KVDataList;
            for (let i = 0; i < KVDataList.length; i++) {
                if (KVDataList[i].key == key) {
                    BMaxScore = KVDataList[i].value;
                }
            }

            if (order) {
                return parseInt(AMaxScore) - parseInt(BMaxScore);
            } else {
                return parseInt(BMaxScore) - parseInt(AMaxScore);
            }
        });
        return ListData;
    }
});