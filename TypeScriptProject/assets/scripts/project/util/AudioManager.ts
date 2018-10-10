import {Singleton} from "./Singleton";
import {IManager} from "./Manager";
import Common from "../Common";

export default class AudioManager extends Singleton implements IManager {
    public isInit = false;
    public bgm: cc.AudioSource;
    public audios: Array < cc.AudioSource > ;
    private audioMap: Map < any, any >
    private playLoopCount;

    protected onConstructor() {
        this.playLoopCount = 0;
        this.audioMap = new Map();
    }

    public play(key) {
        if (this.hasAudio(key)) {
            let clip = this.getAudio(key);
            let isPlay = false;
            if (this.audios.length != 0) {
                if(this.audios[this.playLoopCount]){
                    this.audios[this.playLoopCount].clip = clip;
                    this.audios[this.playLoopCount].play();
                }else{
                    this.playLoopCount=0;
                }
                if(this.playLoopCount < this.audios.length - 1){
                    this.playLoopCount+=1;
                }else{
                    this.playLoopCount=0;
                }
            }
        }
    }
    public playBgm() {
        if (this.bgm.clip) {
            this.bgm.loop = true;
            this.bgm.play();
        }
    }
    public setVolume(volume){
        //设置所有播放源的音量
        if (this.audios.length != 0) {
            this.audios.forEach((audio : cc.AudioSource)=> {
                audio.volume = volume;
            });
        }
        //设置微信API作用的BGM的音量
        Common.WxGameApi.setBgmVolume(volume);
    }
    hasAudio(key): boolean {
        return this.audioMap.has(key);
    }
    getAudio(key): cc.AudioClip {
        return this.audioMap.get(key);
    }
    setAudio(key, value) {
        this.audioMap.set(key, value);
    }
}