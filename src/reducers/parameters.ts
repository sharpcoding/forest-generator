import * as _ from "lodash";
import { handleActions, Action } from "redux-actions";
import { actionLabels } from "../actions/labels";
import { IConfig } from "../state/config/index";
import { asyncActionTriggers } from "../actions/asyncTriggers";
import { IParameters } from "../state/parameters";
import { IForest } from "../state/forest";
import { ITree } from "../state/forest/tree";

export const parametersReducer = handleActions<IParameters, IConfig & number>({
  [actionLabels.CONFIG_LOADED_SUCCESSFULLY]: (state: IParameters, action: Action<IConfig>): IParameters => {
    return _.extend({}, state, <IParameters> {
      sprite: action.payload.sprite
    })
  },
  [actionLabels.GENERATION_PARAMS_CHANGED]: (state: IParameters, action: Action<IParameters>): IParameters => {
    return _.extend({}, state, <IParameters> action.payload)
  }
 }, <IParameters> {
   numberOfTrees: 500,
   canvasWidth: 2500,
   canvasHeight: 250,
   dispersion: 20,
   numberOfTreesRange: [50, 5000],
   canvasWidthRange: [100, 5500],
   canvasHeightRange: [100, 5500],
   sprite: {}
  }
);