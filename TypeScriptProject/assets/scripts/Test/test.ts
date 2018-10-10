const {ccclass, property} = cc._decorator;

@ccclass
export class Test extends cc.Component{

    

    start(){
        let aa=[2,1,4,3,10,22,3,2];

        let f = (a,b)=>{
            if(a>b){
                return a;
            }else{
                return b;
            }
        }

        let s =(l:any[])=>{
            //位数过少
            if(l.length<=1)return true;
            let isSort = true;
            let tmp = l[0];
            for(let i=0;i<l.length-1;i++){
                tmp = l[i];
                //第一位小于第二位则交换
                if(l[i]>l[i+1]){
                    l[i] = l[i+1];
                    l[i+1] = tmp;
                    isSort = false;
                }
                //设置为新的最大值
            }
            return isSort;
        }
        let m = (l:any[])=>{
            let overtime = 1000;
            while(overtime-->0){
                if(s(l))break;
            }
        }
        m(aa);
        let str = ""
        aa.forEach(element => {
            str += element +",";
        });
        console.error(str);
    }
}