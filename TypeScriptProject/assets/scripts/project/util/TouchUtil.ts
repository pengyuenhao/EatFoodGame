import {Singleton} from "./Singleton";
import { IUtil } from "./Util";


export class TouchUtil extends Singleton implements IUtil{
    private areaMap;
    //全局区域状态
    private globalAreaStatus : AreaStatus;

    onConstructor(){
        this.areaMap = new Map();
    }
    /**
     * 注册一个触摸区域，只有在区域内的触控才会被识别
     * @param area 区域
     * @param isGlobal 是否设为全局区域
     */
    public registerTouchArea(area: cc.Node,isGlobal:boolean = false) {
        let areaStatus;
        //尝试获取对应的区域状态
        if(this.areaMap.has(area)){
            areaStatus = this.areaMap.get(area);
        }else{
            areaStatus = new AreaStatus();
            this.areaMap.set(area,areaStatus);
        }
        //设定全局区域
        if(isGlobal)this.globalAreaStatus = areaStatus;
        //触摸开始时
        area.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            let touches = event.getTouches();
            touches.forEach((touch: cc.Touch) => {
                let sPosX = touch.getLocationX();
                let sPoxY = touch.getLocationY();
                let status = new TouchStatus();
                status.direction = TouchDirection.No;
                status.touch = touch;
                status.sPosX = sPosX;
                status.sPosY = sPoxY;
                status.totalX = 0;
                status.totalY = 0;
                status.trendX = 0;
                status.trendY = 0;

                //绑定触摸ID到状态
                areaStatus.touchMap.set(touch.getID(), status)
            });
        });
        //触摸移动时
        area.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            let touches = event.getTouches();
            touches.forEach((touch: cc.Touch) => {
                if (areaStatus.touchMap.has(touch.getID())) {
                    let status: TouchStatus = areaStatus.touchMap.get(touch.getID());
                    let mDeltaX = touch.getDelta().x;
                    let mDeltaY = touch.getDelta().y;
                    status.totalX += mDeltaX;
                    status.totalY += mDeltaY;

                    //如果触摸正在向左移动
                    if (Math.abs(mDeltaX) > 10) {
                        status.trendX += status.totalX / mDeltaX;
                    }
                    if (Math.abs(mDeltaY) > 10) {
                        status.trendY += status.totalY / mDeltaY;
                    }
                    //如果触摸的长度超过10000则判断划动超长了
                    if((status.totalX*status.totalX+status.totalY*status.totalY)>10000){
                        this.disposeTouchResult(areaStatus,touch);
                    }
                }
            });
        });
        //触摸结束时
        area.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            let touches = event.getTouches();
            touches.forEach((touch: cc.Touch) => {
                if (areaStatus.touchMap.has(touch.getID())) {
                    this.disposeTouchResult(areaStatus,touch);
                }
            });
        });

        //触摸取消时
        area.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            let touches = event.getTouches();
            touches.forEach((touch: cc.Touch) => {
                if (areaStatus.touchMap.has(touch.getID())) {
                    this.disposeTouchResult(areaStatus,touch);
                }
            });
        });
    }
    //执行触控结果
    disposeTouchResult(areaStatus,touch){
        //判断当前触摸正处于什么状态
        let result : TouchStatus= areaStatus.touchMoveDetection(touch);
        if(result&&areaStatus.touchEvnet[result.direction]){
            areaStatus.touchEvnet[result.direction].forEach(event => {
                if(event && typeof event ==="function"){
                    //告知结果和触摸信息
                    event(result);
                }
            });
        }
        //移除结束的触摸
        areaStatus.touchMap.delete(touch.getID());
    }
    /**
     * 注册指定的回调函数
     * @param direction 方向
     * @param callback 返回一个触控事件
     */
    public on<T extends Function>(direction: TouchDirection, callback: T, area?: cc.Node) : T{
        let areaStatus;
        if(area&&this.areaMap.has(area)){
            areaStatus = this.areaMap.get(area);
        }else{
            areaStatus = this.globalAreaStatus;
        }
        //增加回调函数
        if(!areaStatus.touchEvnet[direction]){
            areaStatus.touchEvnet[direction] = [];
        }
        areaStatus.touchEvnet[direction].push(callback);
        return callback;
    }
    
}
//区域状态
class AreaStatus{
    public touchEvnet;
    //触摸状态映射
    public touchMap;

    constructor(){
        this.touchMap = new Map();
        this.touchEvnet = [];
    }

    //触摸移动检测
    touchMoveDetection(touch: cc.Touch){
        if (this.touchMap.has(touch.getID())) {
            let status: TouchStatus = this.touchMap.get(touch.getID());
            //检查是否为有效触摸
            let isMoveValid = false;
            //触摸的方向，按照上下左右的顺序排列
            let direction : TouchDirection= TouchDirection.No;
            //如果移动的总距离超过10
            if (Math.abs(status.totalX) > 10 || Math.abs(status.totalY) > 10) {
                //趋势不都为0时
                if (status.trendX != 0 || status.trendY != 0) {
                    //检查移动的趋势
                    if (status.trendX === 0) {
                        isMoveValid = true;
                        //检查总移动距离
                        if (status.totalY > 0) {
                            direction = TouchDirection.Up;
                        } else {
                            direction = TouchDirection.Down;
                        }
                    } else {
                        let trend = status.totalX / status.totalY;
                        //在X轴移动趋势不为0的情况下，检查移动趋势是否达到有效判断范围内
                        if (Math.abs(trend) > 1) {
                            //有效的触摸轨迹
                            isMoveValid = true;
                            //X轴方向向右移动
                            if (status.totalX > 0) {
                                direction = TouchDirection.Right;
                            } else {
                                direction = TouchDirection.Left;
                            }
                        }
                    }
                    //如果之前的检查没有通过
                    if (!isMoveValid) {
                        if (status.trendY === 0) {
                            isMoveValid = true;
                            if (status.totalY > 0) {
                                direction = TouchDirection.Right;
                            } else {
                                direction = TouchDirection.Left;
                            }
                        } else {
                            let trend = status.totalY / status.totalX;
                            if (Math.abs(trend) > 1) {
                                //有效的触摸轨迹
                                isMoveValid = true;
                                //Y轴方向向上移动
                                if (status.totalY > 0) {
                                    direction = TouchDirection.Up;
                                } else {
                                    direction = TouchDirection.Down;
                                }
                            }
                        }
                    }
                }
            }
            //如果之前的检查判断为无效则表明没有发生移动
            if (isMoveValid) {
                switch (direction) {
                    case TouchDirection.No:
                        status.direction = TouchDirection.No;
                        return status;
                    case TouchDirection.Up:
                        status.direction = TouchDirection.Up;
                        return status;
                    case TouchDirection.Down:
                        status.direction = TouchDirection.Down;
                        return status;
                    case TouchDirection.Left:
                        status.direction = TouchDirection.Left;
                        return status;
                    case TouchDirection.Right:
                        status.direction = TouchDirection.Right;
                        return status;
                }
            } else {
                status.direction = TouchDirection.No;
                return status;
            }
        }else{
            return null;
        }
    }
}
//传递触摸状态
export class TouchStatus {
    //触摸
    public touch : cc.Touch;
    //方向
    public direction : TouchDirection;
    /**
     * 触摸开始的X坐标
     */
    public sPosX: number;
    /**
     * 触摸开始的Y坐标
     */
    public sPosY: number;
    /**
     * 最后一次的X坐标
     */
    public lPosX: number;
    /**
     * 最后一次的Y坐标
     */
    public lPosY: number;
    /**
     * X轴移动总距离
     */
    public totalX: number;
    /**
     * Y轴移动总距离
     */
    public totalY: number;
    /**
     * 触摸的总时间
     */
    public totalTime: number;
    /**
     * 趋向于X轴方向移动
     */
    public trendX;
    /**
     * 趋向于Y轴方向移动
     */
    public trendY;
}
export enum TouchDirection{
    No = -1,
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3
}