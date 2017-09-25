import * as _ from "lodash";
import { handleActions, Action } from "redux-actions";
import { actionLabels } from "../actions/labels";
import { IConfig } from "../state/config/index";
import { asyncActionTriggers } from "../actions/asyncTriggers";
import { IParameters } from "../state/parameters";
import { IForest } from "../state/forest";
import { ITree } from "../state/forest/tree";

export const forestReducer = handleActions<IForest, IParameters>({
  [actionLabels.GENERATE_FOREST]: (state: IForest, action: Action<IParameters>): IForest => {
    let trees: ITree[] = [];
    for (let i = 0; i < action.payload.numberOfTrees; i++) {
      trees.push(<ITree> {
        x: _.random(0, action.payload.imageWidth),
        y: _.random(0, action.payload.imageHeight),
        spriteColumn: _.random(0, action.payload.spriteColumns),
        spriteRow: _.random(0, action.payload.spriteRows)
      })
    }
    return _.extend({}, <IForest> { trees: trees });
  }
 }, <IForest> { trees: [] }
);