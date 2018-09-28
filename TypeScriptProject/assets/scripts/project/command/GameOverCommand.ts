import { Command } from "../../lib/framework/Command/Command";

//引用注入装饰器
export class GameOverCommand extends Command{
    execute(){
        console.info("[游戏结束]");
    }

    gameOver() {

        cc.director.loadScene('Begin')
    }
}