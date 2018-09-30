import { Command } from "../../lib/framework/Command/Command";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { IInjectBinder, __IC_InjectBinder } from "../../lib/framework/Injector/InjectBinder";

//引用注入装饰器
export class BackHomeCommand extends Command{
    @inject(__IC_InjectBinder)
    inj: IInjectBinder;
    
    execute(){
        //console.info("[游戏结束]");
        this.gameOver();
    }

    gameOver() {
        this.inj.unbindAllMark();
        cc.director.loadScene('Begin')
    }
}