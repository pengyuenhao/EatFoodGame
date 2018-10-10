// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class ArrowTipView extends cc.Component {
    @property(Number)
    public force: number = 200;
    @property(Number)
    public cycle: number = 1;
    @property(Number)
    public duration: number = 3;
    @property(Boolean)
    public isAutoPlay: boolean = false;
    @property(cc.Node)
    public left: cc.Node = null;
    @property(cc.Node)
    public right: cc.Node = null;

    private isPlay;
    private completeList;
    onLoad() {
        this.completeList = [];
        this.isPlay = false;
    }

    start() {
        if (this.isAutoPlay) {
            this.play();
        }
    }

    config(force, cycle, duration) {
        this.force = force;
        this.cycle = cycle;
        this.duration = duration;
        return this;
    }

    play() {
        this.isPlay = true;

        if (this.left) {
            this.left.opacity = 0;
            //重复左右摆动
            let seq = cc.repeatForever(
                cc.sequence(
                    cc.spawn(
                        cc.moveBy(0, this.force, 0),
                        cc.fadeOut(0)
                    ),
                    cc.fadeIn(this.cycle*0.35),
                    cc.spawn(
                        cc.moveBy(this.cycle, -this.force, 0),
                        cc.fadeOut(this.cycle*0.60)
                    )
                ));
            this.left.runAction(seq);
        }
        if (this.right) {
            this.right.opacity = 0;
            //重复左右摆动
            let seq = cc.repeatForever(
                cc.sequence(
                    cc.spawn(
                        cc.moveBy(0, -this.force, 0),
                        cc.fadeOut(0)
                    ),
                    cc.fadeIn(this.cycle*0.35),
                    cc.spawn(
                        cc.moveBy(this.cycle, this.force, 0),
                        cc.fadeOut(this.cycle*0.60)
                    )
                ));
            this.right.runAction(seq);
        }
        return this;
    }

    stop() {
        if (this.left) {
            this.left.stopAllActions();
        }
        if (this.right) {
            this.right.stopAllActions();
        }
        this.complete();
    }

    private complete() {
        this.isPlay = false;
        //执行完成回调
        this.completeList.forEach(complete => {
            complete();
        });
        this.node.destroy();
    }

    onComplete(complete) {
        this.completeList.push(complete);
        return this;
    }
    update (dt) {
        if(!this.duration || this.duration < 0){
            this.stop();
            return;
        }else{
            this.duration -= dt;
        }
    }
}