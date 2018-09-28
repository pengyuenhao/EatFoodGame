import {IRoot} from "../../Lib/Framework/Context/IRoot"
import {IContext} from "../../Lib/Framework/Context/Context"
import {IocRoot} from "../../lib/extensions/IocRoot"
import {MainContext} from "./MainContext"
import PersistRoot from "../PersistRoot";
import Common from "../Common";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainRoot extends IocRoot implements IRoot {
    //环境容器
    public context: IContext;

    onLoad () {
        //let context = new MainContext(this);
        this.context = Common.persistRootNode.context;
        //this.context.restart();
    }

    start () {
        if(this.context){
            console.info(this.context.getRoot().node.name);
        }
    }
}

