const {ccclass,property} = cc._decorator;
@ccclass
export class Shake extends cc.ActionInterval {
    private _initial_x: number = 0;
    private _initial_y: number = 0;
    private _strength_x: number = 0;
    private _strength_y: number = 0; 
    private _total_x: number = 0;
    private _total_y: number = 0;
    /** 
     * 创建抖动动画
     * @param {number} duration     动画持续时长     
     * @param {number} strength_x   抖动幅度： x方向     
     * @param {number} strength_y   抖动幅度： y方向     
     * @returns {Shake}     
     * */
    public static create(duration: number, strength_x: number, strength_y: number): Shake {
        let act: Shake = new Shake();
        act.initWithDuration(duration, strength_x, strength_y);
        return act;
    }
    public initWithDuration(duration: number, strength_x: number, strength_y: number): boolean {
        cc.ActionInterval.prototype['initWithDuration'].apply(this, arguments);
        this._strength_x = strength_x;
        this._strength_y = strength_y;
        return true;
    }
    public fgRangeRand(min: number, max: number): number {
        let rnd: number = Math.random();
        return rnd * (max - min) + min;
    }
    public update(time: number): void {
        let randx = this.fgRangeRand(-this._strength_x, this._strength_x);
        let randy = this.fgRangeRand(-this._strength_y, this._strength_y);

        //let position = this.getTarget().getPosition();
        this.getTarget().setPosition(randx + this._initial_x, randy + this._initial_y);
        //根据当前的位置来震动
        //this.getTarget().setPosition(randx + position.x, randy + position.y);
        //this._total_x += randx;
        //this._total_y += randy;
    }
    public startWithTarget(target: cc.Node): void {
        cc.ActionInterval.prototype['startWithTarget'].apply(this, arguments);
        this._initial_x = target.x;
        this._initial_y = target.y;
    }
    public stop(): void {
        //let position = this.getTarget().getPosition();
        this.getTarget().setPosition(new cc.Vec2(this._initial_x, this._initial_y));
        //this.getTarget().setPosition(new cc.Vec2(position.x - this._total_x, position.y - this._total_y));
        cc.ActionInterval.prototype['stop'].apply(this);
    }
}
@ccclass
export class Fader extends cc.ActionInterval{
    private _initColor : cc.Color;
    private _color: cc.Color = cc.color(255,255,255);
    private _stepR:number;
    private _stepB:number;
    private _stepG:number;
    /**
     * 创建渐变动画
     * @param {number} duration     动画持续时长     
     * @param {cc.Color} color      颜色
     * @returns {Fader}     
     * */
    public static create(duration: number, color : cc.Color): Fader {
        let act: Fader = new Fader();
        act.initWithDuration(duration, color);
        return act;
    }
    public initWithDuration(duration: number, color : cc.Color): boolean {
        cc.ActionInterval.prototype['initWithDuration'].apply(this, arguments);
        this._color = color;
        return true;
    }
    public update(time: number): void {
        this.getTarget().color = cc.color(
            this._initColor.getR() + this._stepR * time,
            this._initColor.getG() + this._stepG * time,
            this._initColor.getB() + this._stepB * time
        );
    }
    public startWithTarget(target: cc.Node): void {
        cc.ActionInterval.prototype['startWithTarget'].apply(this, arguments);

        this._initColor = this.getTarget().color;
        this._stepR = this._color.getR() - target.color.getR();
        this._stepG = this._color.getG() - target.color.getG();
        this._stepB = this._color.getB() - target.color.getB();
    }
    public stop(): void {
        this.getTarget().color = this._color;
        cc.ActionInterval.prototype['stop'].apply(this);
    }
}