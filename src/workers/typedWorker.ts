export interface ITypedMessageEvent<T> extends MessageEvent {
  readonly data: T;
}

export interface ITypedWorker<TWorkerInputMessage, 
                              TWorkerOutputMessage, 
                              TWorkerInputMessageEvent extends MessageEvent, 
                              TWorkerOutputMessageEvent extends MessageEvent> 
extends Worker {
  postMessage(message: (TWorkerInputMessage | TWorkerOutputMessage)): void;
  addEventListener(
    type: ("message"|"error"), 
    eventListener: (event: TWorkerInputMessageEvent | TWorkerOutputMessageEvent) => void);
}