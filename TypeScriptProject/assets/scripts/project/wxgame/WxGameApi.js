/**
 * 微信API接口
 */
export default class WxGameApi{
    static get isRunInWeiXin(){
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            return true
        }else{
            WxGameApi.errorLog();
            return false;
        } 
    }

    static errorLog(func){
        console.warn("[请在微信环境内调用微信接口]");
    }

    static playBGM(bgmUrl){
        if(!WxGameApi.isRunInWeiXin)return;
        let bgm  = wx.createInnerAudioContext()
        // src 可以设置 http(s) 的路径，本地文件路径或者代码包文件路径
        bgm .src = bgmUrl;      
        bgm.loop = true;
        bgm.autoplay = true;
        bgm.play()
        wx.onShow(()=>{
            bgm.play();
        });
    }

    static downFile(url,successCallback,failCallback){
        /*         wx.downloadFile({
            url : url,
            header:"",
            filePath:"",
            success(res){
                console.info("[下载成功]" + res.statusCode);
                console.info("[保存到路径]" + res.tempFilePath);
                wx.getFileSystemManager().readFile({
                    filePath:res.tempFilePath,
                    success(data){
                        console.info("[成功获取]" + data);
                        successCallback(data);
                    },
                    fail(err){
                        console.info("[获取失败]" + err.errMsg);
                        failCallback(err);
                    }
                })
            },
            fail(err){
                console.info("[下载失败]" + err.errMsg);
            }
        }); */
    }
}