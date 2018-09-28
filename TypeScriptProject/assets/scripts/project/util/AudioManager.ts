import {Singleton} from "./Singleton";
import {IManager} from "./Manager";

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
                //找到一个空闲的播放源进行播放
/*                 for(let i =0;i<this.audios.length;i++){
                    if (!this.audios[i].isPlaying) {
                        this.audios[i].clip = clip;
                        this.audios[i].play();
                        isPlay = true;
                        break;
                    }
                } */
                //没有空闲的播放源
/*                 if (!isPlay) {
                    this.audios[0].clip = clip;
                    this.audios[0].play();
                } */
            }
        }
    }
    public playBgm() {
        if (this.bgm.clip) {
            this.bgm.loop = true;
            this.bgm.play();
        }
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