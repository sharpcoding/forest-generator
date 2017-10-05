import * as _ from "lodash";
import { handleActions, Action } from "redux-actions";
import { actionLabels } from "../actions/labels";
import { IConfig } from "../state/config/index";
import { asyncActionTriggers } from "../actions/asyncTriggers";
import { IGenerationParameters } from "../state/generationParameters";
import { IForest } from "../state/forest";
import { ITree } from "../state/forest/tree";

export const generationParametersReducer = handleActions<IGenerationParameters, IConfig & number>({
  [actionLabels.CONFIG_LOADED_SUCCESSFULLY]: (state: IGenerationParameters, action: Action<IConfig>): IGenerationParameters => {
    return _.extend({}, state, <IGenerationParameters> {
      sprite: action.payload.sprite
    })
  },
  [actionLabels.GENERATION_PARAMS_CHANGED]: (state: IGenerationParameters, action: Action<IGenerationParameters>): IGenerationParameters => {
    return _.extend({}, state, <IGenerationParameters> action.payload)
  }
 }, <IGenerationParameters> {
   numberOfTrees: 315,
   imageWidth: 500,
   imageHeight: 500,
   dispersion: 20,
   sprite: {}
  }
);