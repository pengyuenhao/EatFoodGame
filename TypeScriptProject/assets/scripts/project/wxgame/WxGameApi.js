/**
 * 微信API接口
 */
export default class WxGameApi {
    static get userPath() {
        if (!WxGameApi.isRunInWeiXin) return
        return wx.env.USER_DATA_PATH + "/";;
    }
    static get isRunInWeiXin() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            return true
        } else {
            WxGameApi.errorLog();
            return false;
        }
    }
    static onHide(callback) {
        if (!WxGameApi.isRunInWeiXin) return
        wx.onHide(callback);
    }
    static onShow(callback) {
        if (!WxGameApi.isRunInWeiXin) return
        wx.onShow(callback);
    }
    static errorLog(func) {
        //console.warn("[请在微信环境内调用微信接口]");
    }

    static playBGM(bgmUrl) {
        if (!WxGameApi.isRunInWeiXin) return;
        let bgm = wx.createInnerAudioContext()
        // src 可以设置 http(s) 的路径，本地文件路径或者代码包文件路径
        bgm.src = bgmUrl;
        bgm.loop = true;
        bgm.autoplay = true;
        bgm.play()
        wx.onShow(() => {
            bgm.play();
        });
    }
    static playVideo(x, y, w, h, url ,overtime ,isAutoPlay, onComplete) {
        if (!WxGameApi.isRunInWeiXin) return null;
        let isPlayFinish = false;
        console.info("[尝试播放视频]" + "<x,y>" + x + "," + y + "<w,h>" + w + "," + h);
        let video = wx.createVideo({
            x: x,
            y: y,
            width: w,
            height: h,
            src: url,
            poster: "",
            objectFit: "fill",
            controls: false,
            autoplay: isAutoPlay,
        });
        video.onEnded(() => {
            isPlayFinish = true;
            onComplete();
            video.destroy();
        });
        video.onerror(() => {
            isPlayFinish = true;
            onComplete();
            video.destroy();
        });
        //播放一秒后检查播放状态
        setTimeout(()=>{
            if(!video)return;
            //根据对象搜索算法找到的微信视频接口状态函数
            
            let status = video.emitter.event + "";
            if(status === "onVideoPause"){
                console.info("[播放提前结束]" + video.emitter.event);
                isPlayFinish = true;
                onComplete();
                video.destroy();
            }
        },1000);
        //检查超时
        setTimeout(()=>{
            //如果播放超时则强制结束播放
            if(!isPlayFinish){
                //强制销毁视频播放
                if(video)video.destroy();
                onComplete();
            }
        },overtime);
        return video;
    }
    static downFile(url, path, successCallback, failCallback) {
        let userPath = WxGameApi.userPath;
        //console.info("[用户缓存路径]" + userPath);
        wx.downloadFile({
            url: url,
            header: "",
            filePath: "",
            success(res) {
                console.info("[下载成功]" + res.statusCode);
                //console.info("[保存到路径]" + res.tempFilePath);
                wx.getFileSystemManager().saveFile({
                    tempFilePath: res.tempFilePath,
                    filePath: userPath + path,
                    success(res) {
                        console.info("[保存成功]" + res.savedFilePath);
                        successCallback(res.savedFilePath);
                    },
                    fail(err) {
                        console.info("[保存失败]" + err.errMsg);
                    }
                });

            },
            fail(err) {
                console.info("[下载失败]" + err.errMsg);
                failCallback(err)
            }
        });
    }
    /**
     * 检查是缓存中是否存在对应路径的文件
     * @param {*} path 文件路径
     * @param {*} result 结果
     */
    static checkCacheExistFile(path, result) {
        wx.getFileSystemManager().access({
            path: path,
            success() {
                result(true);
            },
            fail() {
                result(false);
            }
        });
    }
    static readFile(path, successCallback, failCallback) {
        wx.getFileSystemManager().readFile({
            filePath: path,
            success(res) {
                console.info("[成功获取]" + res);
                successCallback(res);
            },
            fail(err) {
                console.info("[获取失败]" + err.errMsg);
                failCallback(err);
            }
        })
    }
    /**
     * 获取或者缓存资源文件
     * @param {*} url 资源的地址
     * @param {*} path 存储路径
     * @param {*} complete 完成回调
     */
    static getOrCacheResFile(url, path, complete) {
        //是否允许下载资源
        let isAllowDownload;
        if (!url || url === "") {
            isAllowDownload = false;
        } else {
            isAllowDownload = true;
        }
        let resPath = WxGameApi.userPath + path;
        //检查缓存文件是否存在
        WxGameApi.checkCacheExistFile(resPath, (result) => {
            if (result === true) {
                console.info("[从缓存获取资源]]" + path);
                //直接从本地获取资源
                complete(resPath);
            } else {
                //允许下载则保存对应的资源到缓存
                if (isAllowDownload) {
                    console.info("[需要下载资源]]" + path);
                    WxGameApi.downFile(url, path, (savedFilePath) => {
                        console.info("[下载成功]" + savedFilePath);
                        complete(savedFilePath);
                    }, (err) => {
                        console.info("[下载失败]" + err);
                        complete(null);
                    });
                } else {
                    console.info("[无法获取资源]]" + path);
                    //无法找到对应的资源
                    complete(null);
                }
            }
        });
    }
    //存储游戏分数
    static saveScore(value) {
        if (!WxGameApi.isRunInWeiXin) return
        console.info("[通知开发数据容器存储分数]" + value);
        //发送存储分数消息告知开放数据容器
        wx.getOpenDataContext().postMessage({
            message: {
                type: "command",
                function: "save",
                arguments: "score",
                data: value,
            }
        });
    }
}