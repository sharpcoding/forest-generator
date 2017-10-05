import { IConfig } from "./config";
import { IGenerationParameters } from "./generationParameters";
import { IForest } from "./forest";

/**
 * Holds the whole state of the redux app
 */
export interface IState {
  readonly config: IConfig;
  readonly generationParameters: IGenerationParameters;
  readonly forest: IForest;
}