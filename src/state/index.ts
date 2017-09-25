import { IConfig } from "./config";
import { IParameters } from "./parameters";
import { IForest } from "./forest";

/**
 * Holds the whole state of the redux app
 */
export interface IState {
  readonly config: IConfig;
  readonly parameters: IParameters;
  readonly forest: IForest;
}