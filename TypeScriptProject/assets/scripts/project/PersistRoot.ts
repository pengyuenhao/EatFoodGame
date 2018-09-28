import Common from "./Common";
import PrefabManager from "./util/PrefabManager";
import { IRoot } from "../lib/framework/Context/IRoot";
import { MainContext } from "./context/MainContext";
import AudioManager from "./util/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PersistRoot extends cc.Component implements IRoot {
    public context;

    @property([cc.Prefab])
    prefabs: Array<cc.Prefab> = [];
    @property([cc.AudioClip])
    clips: Array<cc.AudioClip> = [];
    @property([cc.AudioSource])
    audios: Array<cc.AudioSource> = [];
    @property(cc.AudioSource)
    bgm:cc.AudioSource = null;


    onLoad () {
        //防止重复执行初始化
        if(Common.isInit)return;
        Common.isInit = true;
        //console.info("[初始化常驻节点]");
        //配置为常驻节点
        if(!Common.persistRootNode){
            cc.game.addPersistRootNode(this.node);
            Common.persistRootNode = this;
        }
        this.context = new MainContext(this)
        this.loadPrefab();
        this.loadAudio();
    }
    loadPrefab(){
        this.prefabs.forEach(prefab => {
            PrefabManager.Instance.setPrefab(prefab.name,prefab);
        });
    }
    loadAudio(){
        this.clips.forEach(audio=>{
            AudioManager.Instance.setAudio(audio.name,audio);
        });
        AudioManager.Instance.bgm = this.bgm;
        AudioManager.Instance.audios = this.audios;
        AudioManager.Instance.playBgm();

    }
    start () {
        
    }
    // update (dt) {}
}
