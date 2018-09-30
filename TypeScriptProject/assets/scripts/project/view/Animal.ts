import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { MainModel } from "../Model/MainModel";
import { __IC_Model, ModelType } from "../util/Model";
import { IocView } from "../../lib/extensions/IocView";

const {ccclass,property} = cc._decorator

@ccclass
export default class Animal extends IocView {
    @inject(__IC_Model,ModelType.Main)
    mMdl : MainModel;

    @property
    type = ''

    onLoad() {
        super.onLoad();
    }
    start(){
        super.start();
    }

    //重设动物坐标
    rePositonAnimal(i) {
        let {
            width,
            height
        } = this.mMdl.animalTextureRect
        let offsetRatio = {
            x: 0,
            y: 0
        }
        i === 0 && (offsetRatio = {
            x: -1,
            y: 1
        })
        i === 1 && (offsetRatio = {
            x: 1,
            y: 1
        })
        i === 2 && (offsetRatio = {
            x: 1,
            y: -1
        })
        i === 3 && (offsetRatio = {
            x: -1,
            y: -1
        })
        this.node.setPosition(offsetRatio.x * width / 2, offsetRatio.y * height / 2);
    }

}