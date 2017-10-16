import axios, { AxiosResponse } from 'axios';
import { createAction } from 'redux-actions';
import { actionLabels } from "./labels";
import { IConfig } from "../state/config";
import { ISprite } from "../state/config/sprite";
import { IForest } from "../state/forest";
import { ITree } from "../state/forest/tree";
import { IGenerationParameters } from "../state/generationParameters";
import { EnumImageDownloadingStatus } from "../state/notifications/index";

export const actions = {
  configLoadedSuccessfully: createAction<IConfig, Object>(
    actionLabels.CONFIG_LOADED_SUCCESSFULLY,
    (payload: IConfig) => payload),
  generationParametersChanged: createAction<IGenerationParameters, IGenerationParameters>(
    actionLabels.GENERATION_PARAMS_CHANGED,
    (payload: IGenerationParameters) => payload),
  forestGenerationStarted: createAction(actionLabels.FOREST_GENERATION_STARTED),
  forestGenerationProgressed: createAction<ITree[], ITree[]>(
    actionLabels.FOREST_GENERATION_PROGRESSED,
    (payload: ITree[]) => payload),
  forestGenerationFinished: createAction<ITree[], ITree[]>(
    actionLabels.FOREST_GENERATION_FINISHED,
    (payload: ITree[]) => payload),
  /**
   * Request to change the dowload status in system
   */
  imageDownloadStatusChange: createAction<EnumImageDownloadingStatus, EnumImageDownloadingStatus>(
    actionLabels.IMAGE_DOWNLOAD_STATUS_CHANGE,
    (payload: EnumImageDownloadingStatus) => payload
  )
}