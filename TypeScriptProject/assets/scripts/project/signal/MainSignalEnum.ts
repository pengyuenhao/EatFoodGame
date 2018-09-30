//主要的信号枚举类型,注意要确保不出现重复的字符串
export enum MainSignalEnum{
    //开始命令
    Start = "Start",
    //更新命令
    Update = "Update",
    //生成视图节点命令
    Generate = "GenerateViewNodes",
    //重新开始
    Restart = "Restart",
    //查看排行榜
    LookRank = "LookRank",
    //记分逻辑
    Match = "Match",
    //输入控制
    InputControl = "InputControl",
    //返回主菜单
    BackHome = "BackHome",
}

export enum GameSignalEnum{
    onMatch = "OnMatch",
    onNotMatch = "OnNotMatch"
}