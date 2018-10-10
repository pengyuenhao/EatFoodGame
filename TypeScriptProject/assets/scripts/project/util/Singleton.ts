export class Singleton {
    /** 存放初始化过的构造函数,这里用数组来存放构造函数 **/
    private static classMap: Map < any, any > = new Map();

    constructor() {
        let clazz: any = this.constructor;
        //为空时，表示浏览器不支持这样读取构造函数
        if (!clazz)
            return;
        // 防止重复实例化
        if (Singleton.classMap.has(clazz))
            throw new Error(this + " 只允许实例化一次！");
        else {
            Singleton.classMap.set(clazz, this);
            this.onConstructor();
        }
    }
    protected onConstructor() {

    }
    public static get Instance(){
        return Singleton.getInstanceOrCreate(this);
    }

    public static destroyInstance(clazz: any): void {
        if (Singleton.classMap.has(clazz)) {
            Singleton.classMap.get(clazz).onDestroy();
            Singleton.classMap.delete(clazz);
        }
    }

    public static getInstanceOrCreate(clazz: any,...args): any {
        let instance;
        if (Singleton.classMap.has(clazz)) {
            instance = Singleton.classMap.get(clazz);
            if (instance) {
                return instance;
            }
        }
        instance = new clazz(...args);
        //不是Singleton的子类，则手动添加Singleton构造器会自动添加到classMap
        if (!(instance instanceof Singleton)) {
            Singleton.classMap.set(clazz, instance);
        }
        return instance;
    }

    protected onDestroy(): void {

    }
}