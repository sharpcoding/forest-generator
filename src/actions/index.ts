import axios, { AxiosResponse } from 'axios';
import { createAction } from 'redux-actions';
import { actionLabels } from "./labels";
import { IConfig } from "../state/config";
import { ISprite } from "../state/config/sprite";
import { IForest } from "../state/forest";
import { IGenerationParameters } from "../state/generationParameters";

export const actions = {
  configLoadedSuccessfully: createAction<IConfig, Object>(
    actionLabels.CONFIG_LOADED_SUCCESSFULLY,
    (payload: IConfig) => payload),
  generationParametersChanged: createAction<IGenerationParameters, IGenerationParameters>(
    actionLabels.GENERATION_PARAMS_CHANGED,
    (payload: IGenerationParameters) => payload),
  generateForest: createAction<IGenerationParameters, IGenerationParameters>(
    actionLabels.GENERATE_FOREST,
    (payload: IGenerationParameters) => payload)
}