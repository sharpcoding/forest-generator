import * as _ from "lodash";
import { handleActions, Action } from "redux-actions";
import { actionLabels } from "../actions/labels";
import { IConfig } from "../state/config/index";
import { asyncActionTriggers } from "../actions/asyncTriggers";
import { IGenerationParameters } from "../state/generationParameters";
import { IForest } from "../state/forest";
import { ITree } from "../state/forest/tree";

export const forestReducer = handleActions<IForest, ITree[]>({
  [actionLabels.FOREST_GENERATION_PROGRESSED]: (state: IForest, action: Action<ITree[]>): IForest => {
    return _.extend({}, <IForest> { trees: action.payload });
  },
  [actionLabels.FOREST_GENERATION_FINISHED]: (state: IForest, action: Action<ITree[]>): IForest => {
    return _.extend({}, <IForest> { trees: action.payload });
  }
 }, <IForest> { trees: [] }
);