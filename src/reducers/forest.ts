import * as _ from "lodash";
import { handleActions, Action } from "redux-actions";
import { actionLabels } from "../actions/labels";
import { IConfig } from "../state/config/index";
import { asyncActionTriggers } from "../actions/asyncTriggers";
import { IGenerationParameters } from "../state/generationParameters";
import { IForest } from "../state/forest";
import { ITree } from "../state/forest/tree";
import { treeGeneratorWithDispersion } from "../algorithms/treeGeneratorWithDispersion";

export const forestReducer = handleActions<IForest, IGenerationParameters>({
  [actionLabels.GENERATE_FOREST]: (state: IForest, action: Action<IGenerationParameters>): IForest => {
    return _.extend({}, <IForest> { trees: treeGeneratorWithDispersion.generate(action.payload) });
  }
 }, <IForest> { trees: [] }
);