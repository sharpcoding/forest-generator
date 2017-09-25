import axios, { AxiosResponse } from 'axios';
import { createAction } from 'redux-actions';
import { actionLabels } from "./labels";
import { IConfig } from "../state/config";
import { ISprite } from "../state/config/sprite";
import { IForest } from "../state/forest";
import { IParameters } from "../state/parameters";

export const actions = {
  configLoadedSuccessfully: createAction<IConfig, Object>(
    actionLabels.CONFIG_LOADED_SUCCESSFULLY,
    (payload: IConfig) => payload),
  generateForest: createAction<IParameters, IParameters>(
    actionLabels.GENERATE_FOREST,
    (payload: IParameters) => payload)
}