import { Singleton } from "./Singleton";
import { IUtil } from "./Util";

export class MainUtil extends Singleton implements IUtil{
    public getSceneSize(){
        return cc.winSize;
    }
    /**
     * 异步转换资源文件为可渲染文件的对象
     * @param resourceUrl 资源文件的地址
     */
    public spriteRes(resourceUrl) {
        return new Promise<cc.SpriteFrame>((resolve, reject) => {
            cc.loader.loadRes(resourceUrl, cc.SpriteFrame, (err, spriteFrame : cc.SpriteFrame) => {
                if (err) throw err
                resolve(spriteFrame);
            })
        })
    }
    
    public randomCoin() {
        return Math.round(Math.random())
    }
    
    public randomNumber(size) {
        return Math.floor(Math.random() * size)
    }
    
    public randomValue(...values) {
        return values[this.randomNumber(values.length)]
    }
}