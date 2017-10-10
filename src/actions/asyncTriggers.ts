import axios, { AxiosResponse } from 'axios';
import { Dispatch } from "redux";
import { IState } from "../state/index";
import { actions } from "./index";
import { IConfig } from "../state/config/index";
import { IGenerationParameters } from "../state/generationParameters";
import { ITreeGenerationWorker, ITreeGenerationWorkerOutputMessageEvent, ITreeGenerationWorkerInputMessageEvent } from "../workers/treeGenerator";
import * as TreeGeneratorWorker from "worker-loader!../workers/treeGenerator";

const treeGeneratorWorker: ITreeGenerationWorker = new TreeGeneratorWorker();

export const asyncActionTriggers = {
  loadConfig: (configUrl: string) => (dispatch) => {
    axios
      .get(configUrl)
      .then((result: AxiosResponse) => {
        // Below there is a risky operation, to be improved by response checking
        dispatch(actions.configLoadedSuccessfully(<IConfig> result.data));
      });
  },
  startForestGeneration: (params: IGenerationParameters) => (dispatch) => {
    dispatch(actions.forestGenerationStarted);
    treeGeneratorWorker.postMessage({ generationParameters: params });
    treeGeneratorWorker.addEventListener("message", (message: ITreeGenerationWorkerOutputMessageEvent) => {
      dispatch(actions.forestGenerationProgressed(message.data.trees));
      if (message.data.isCompleted)
        dispatch(actions.forestGenerationFinished(message.data.trees));
    });
  }
}