import { Singleton } from "../util/Singleton";
import { IModel } from "../util/Model";

export class InputModel extends Singleton implements IModel{
    //等待中的操作
    public waitingDirection;
    public lastAction : cc.Action;

    onConstructor(){
        this.lastAction = null;
        this.waitingDirection = null;
    }
}