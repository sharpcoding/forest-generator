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
    let dispersion = action.payload.minimalDispersion;
    let numberOfTries = 0;
    for (let i = 0; i < action.payload.numberOfTrees; i++) {
      let tree = <ITree> {
        spriteColumn: _.random(0, action.payload.sprite.columns),
        spriteRow: _.random(0, action.payload.sprite.rows),
      }
      let treePositionMeetsDispersionLimit = false;
      while (!treePositionMeetsDispersionLimit) {
        tree = _.extend(tree, <ITree> {
          canvasImageX: _.random(0, action.payload.imageWidth - action.payload.sprite.columnWidth),
          canvasImageY: _.random(0, action.payload.imageHeight - action.payload.sprite.rowHeight)
        })
        treePositionMeetsDispersionLimit = _.isEmpty(_.filter(trees, t => {
          let distance = Math.sqrt(
            Math.pow(tree.canvasImageX - t.canvasImageX, 2) +
            Math.pow(tree.canvasImageY - t.canvasImageY, 2));
          return distance < dispersion
        }));
        numberOfTries++;
        if (numberOfTries > action.payload.numberOfTrees/5) {
          dispersion = Math.max(dispersion-1, 1);
          numberOfTries = 0;
        }
      }
      trees.push(_.extend(tree, <ITree> {
        x: tree.canvasImageX + action.payload.sprite.columnWidth/2,
        y: tree.canvasImageY + action.payload.sprite.rowHeight/2
      }))
    }
    return _.extend({}, <IForest> { trees: trees });
  }
 }, <IForest> { trees: [] }
);