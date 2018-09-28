import PersistRoot from "./PersistRoot";

//全局变量
 export default class  Common{
    static isInit : boolean = false;
    static persistRootNode : PersistRoot= null;
    static root = null;
    static shareTickets = [];
    static isHasWxRank = false;
    static maxScore = 0;
    static saveScoreFunc = null;
    //用户的唯一标识
    static userOpenId = 0;
    //会话密钥
    static session_key = "";
    //用户全局唯一标识
    static unionId = 0;
}