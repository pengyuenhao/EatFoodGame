/**
 * 微信API接口
 */
export default class WxApi{
    static get isRunInWeiXin(){
        if(cc.sys.platform === cc.sys.WECHAT_GAME){
            return true
        }else{
            WxApi.errorLog();
            return false;
        } 
    }

    static errorLog(func){
        console.warn("[请在微信环境内调用微信接口]");
    }
}