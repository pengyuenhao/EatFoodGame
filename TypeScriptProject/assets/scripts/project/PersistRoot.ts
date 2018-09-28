import Common from "./Common";
import ResourceManager from "./util/ResourceManager";
import { IRoot } from "../lib/framework/Context/IRoot";
import { MainContext } from "./context/MainContext";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PersistRoot extends cc.Component implements IRoot {
    public context;

    @property([cc.Prefab])
    prefabs: Array<cc.Prefab> = [];

    onLoad () {
        //防止重复执行初始化
        if(Common.isInit)return;
        Common.isInit = true;
        console.info("[初始化常驻节点]");
        //配置为常驻节点
        if(!Common.persistRootNode){
            cc.game.addPersistRootNode(this.node);
            Common.persistRootNode = this;
        }
        this.context = new MainContext(this)
        this.prefabs.forEach(prefab => {
            ResourceManager.Instance.setPrefab(prefab.name,prefab);
        });
    }
    start () {

    }
    // update (dt) {}
}
