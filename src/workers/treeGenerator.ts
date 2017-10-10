import * as _ from 'lodash';
import { IGenerationParameters } from "../state/generationParameters/index";
import { treeGeneratorWithDispersion } from "../algorithms/treeGeneratorWithDispersion";
import { ITree } from "../state/forest/tree";
import { ITypedMessageEvent, ITypedWorker } from "./typedWorker";

/**
 * Tree generator worker contract
 */
export interface ITreeGeneratorWorkerInputMessage {
  generationParameters: IGenerationParameters; 
}

export interface ITreeGeneratorWorkerOutputMessage {
  isCompleted: boolean;
  trees: ITree[]; 
}

export interface ITreeGenerationWorkerInputMessageEvent
  extends ITypedMessageEvent<ITreeGeneratorWorkerInputMessage> { };

export interface ITreeGenerationWorkerOutputMessageEvent 
  extends ITypedMessageEvent<ITreeGeneratorWorkerOutputMessage> { };

export interface ITreeGenerationWorker 
  extends ITypedWorker<ITreeGeneratorWorkerInputMessage, 
                       ITreeGeneratorWorkerOutputMessage, 
                       ITreeGenerationWorkerInputMessageEvent, 
                       ITreeGenerationWorkerOutputMessageEvent> { };


/**
 * Tree generator worker implementation
 */

//lame but necessary ! see the https://github.com/Microsoft/TypeScript/issues/582
let worker = (self as any) as ITreeGenerationWorker;

worker.addEventListener("message", (event: ITreeGenerationWorkerInputMessageEvent) => {
  let message: ITreeGeneratorWorkerInputMessage = event.data;
  if (!_.isObject(message))
    return;
  let result = treeGeneratorWithDispersion.generate(message.generationParameters, (trees: ITree[]) => {
    worker.postMessage(<ITreeGeneratorWorkerOutputMessage> { trees: trees, isCompleted: false });
  });
  worker.postMessage(<ITreeGeneratorWorkerOutputMessage> { trees: result, isCompleted: true });
});