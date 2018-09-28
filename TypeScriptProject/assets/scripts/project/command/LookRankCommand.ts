import { Command } from "../../lib/framework/Command/Command";
import Common from "../Common";
import { inject } from "../../lib/framework/Injector/InjectDecorator";
import { IInjectBinder, __IC_InjectBinder } from "../../lib/framework/Injector/InjectBinder";

//引用注入装饰器
export class LookRankCommand extends Command{
    @inject(__IC_InjectBinder)
    inj: IInjectBinder;

    execute(){
        console.info("[查看排行榜开始]");
        this.lookRank();
    }

    lookRank(){
        this.inj.unbindAllMark();
        //let a = Common.persistRootNode;
        cc.director.loadScene('Rank')
    }
}