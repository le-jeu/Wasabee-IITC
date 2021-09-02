export default class Evented {
    _events: {
        [propName: string]: Array<{
            fct: (data: any) => any;
            context: any;
        }>;
    };
    constructor();
    on(event: string, func: (data: any) => any, context?: any): this;
    off(event: string, func: (data: any) => any, context?: any): this;
    fire(event: string, data?: any): this;
}
