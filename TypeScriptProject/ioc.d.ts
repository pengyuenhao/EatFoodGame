/* declare namespace ioc{
    export interface IRoot{
        context : __IC_ontext;
    }
    export interface __IC_ontext{
        start() : __IC_ontext;
        //启动
        launch();
        /// Get the ContextView
		getRoot() : any;
    }
    export class Context extends Binder implements __IC_ontext{
        getRoot();
        constructor(root:any);
        setRoot(root : any) : __IC_ontext;
        start() : __IC_ontext;
        launch();
        instantiateCore();
        mapBindings();
        postBindings();
        addCore();
    }

}

declare module ioc.decorator{
    export function inject(name: string): Function;
    export function inject(_target: Object, _key: any, _desc ? : any): void;
} */