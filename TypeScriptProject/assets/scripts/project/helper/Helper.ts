export class Helper {
    /**
     * 获取一个对象全部的信息并打印出来
     * @param obj 被搜索对象
     */
    public static getAllInfo(obj: object) {
        if (typeof obj !== "object") return;
        let property = "<GetAllInfo>"+"\n";
        property += Helper.getInfo(obj);
        console.info(property);
    }
    private static getInfo(obj : Object,depth?){
        let property = "";
        let depthTab = "";
        if(!obj||!obj.constructor||obj.constructor.name === "object")return "";
        if(depth){
            //深度过大则说明溢出了
            if(depth>100){
                property += "[N]"+obj+"[overflow]";
                return "";
            }
            //根据深度加Tab键
            for(let i = 0;i<depth;i++){
                depthTab += "\t";
            }
        }else{
            depthTab += "\t";
            depth = 1;
        }

        for (let item in obj) {
            let p = item;
            let v = obj[item];
            if(v && typeof v == "function"){
                let f : Function = v as Function;
                v = f.name + "(F)";
            }
            property += depthTab + "[P]" + p + "[V]" + v + "\n";
            //递归遍历
            if(v && typeof v == "object"){
                //继续寻找并且深度加一
                property += Helper.getInfo(v,depth+1);
            }
        }
        return property;
    }
}