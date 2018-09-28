const {ccclass, property} = cc._decorator;

@ccclass
export default class TipsUiView extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.RichText)
    text: cc.RichText = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        
    }
    display(title,content){
        this.label.string = title;
        this.text.string = content;
    }
    onClicked(){
        this.node.active = false;
    }
    // update (dt) {}
}
