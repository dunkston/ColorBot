import JSDictionary from 'jsdictionary';

declare class EventMap {
    public dispatcherMap: JSDictionary;
    public map(dispatcher: any, type: string, handler: Function, owner?: any, useCapture?: boolean): void;
    public unmap(dispatcher: any, type: string, handler: Function, owner?: any, useCapture?: boolean): void;
    public all(): void;
}

export default EventMap;