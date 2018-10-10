import {Singleton} from "../util/Singleton";
import {IModel} from "../util/Model";
import PrefabPool from "../helper/PrefabPool";

/**
 * 应该将需要生命周期较长的变量存储在数据模型里，然后在其他类中通过注入的方式获取数据模型
 */
export class MainModel extends Singleton implements IModel {
    //食物对象池，减少创建对象的开销
    public foodPool: PrefabPool = null;
    //当前的食物节点列表
    public currentFoodNodes = [];
    //最后的食物索引
    public lastFoodIndex = 0;
    //最后的轨道
    public lastTrack = 0;

    public animalDatas = [{
        image: 'animals/bird',
        type: '0',
        spriteFrame: null,
    }, {
        image: 'animals/bear',
        type: '1',
        spriteFrame: null
    }, {
        image: 'animals/rabbit',
        type: '2',
        spriteFrame: null,
    }, {
        image: 'animals/dog',
        type: '3',
        spriteFrame: null
    }]
    public foodDatas = [{
        image: 'foods/food-bird',
        type: '0',
        spriteFrame: null
    }, {
        image: 'foods/food-bear',
        type: '1',
        spriteFrame: null
    }, {
        image: 'foods/food-rabbit',
        type: '2',
        spriteFrame: null
    }, {
        image: 'foods/food-dog',
        type: '3',
        spriteFrame: null
    }]
    public rotateDur = 0.1
    public isRotationing = false
    public animalTextureRect = {
        width: 264,
        height: 268
    }
    //暂停标记
    public pauseFlag = true;
    //准备状态标记
    public readyFlag = false;
    //游戏被隐藏
    public isHide = false;
    //是否已经观看过广告
    public isLookVideo = false;

    public score = 0;
    public timer = 0;
    public lastTimer = 0;
    public timePeriod = 2.5;
    public currentLevel = 0;


    public initTimePeriod = 0;

    public minTimePeriod = 0.8;

    public lastScore = 0;
    public maxScore = 0;

    public harderRatios = (() => {
        const list = []
        for (let i = 0; i <= 20; i++) {
            list[i] = [i * 200, 0.075]
        }
        return list
    })();
}