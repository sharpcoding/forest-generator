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
  [actionLabels.GENERATION_PARAMS_NUMBER_OF_TREES_CHANGED]: (state: IParameters, action: Action<number>): IParameters => {
    return _.extend({}, state, <IParameters> {
      numberOfTrees: action.payload
    })
  }
 }, <IParameters> {
   numberOfTrees: 1,
   imageHeight: 800,
   imageWidth: 800,
   sprite: {}
  }
);