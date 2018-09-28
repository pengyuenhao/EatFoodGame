import { Singleton } from "./Singleton";
import { IConstructorName } from "../../lib/framework/IocConst";
export class __IC_Util extends IConstructorName{
    public get constructorName(){
        return "IUtil";
    }
}
export interface IUtil{

}
export class MainUtil extends Singleton implements IUtil{
    public getSceneSize(){
        return cc.winSize;
    }
    public spriteRes(resourceUrl) {
        return new Promise((resolve, reject) => {
            cc.loader.loadRes(resourceUrl, cc.SpriteFrame, (err, spriteFrame) => {
                if (err) throw err
                resolve(spriteFrame)
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