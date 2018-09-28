import { Singleton } from "./Singleton";
import { IManager } from "./Manager";

export default class ResourceManager extends Singleton implements IManager{
    public isInit = false;
    private prefabMap : Map<any,any>

    protected onConstructor(){
        this.prefabMap = new Map();
    }
    hasPrefab(key):boolean{
        return this.prefabMap.has(key);
    }
    getPrefab(key):cc.Prefab{
        return this.prefabMap.get(key);
    }
    setPrefab(key,value){
        this.prefabMap.set(key,value);
    }
}