import * as _ from 'lodash';
import { IGenerator } from "./interfaces";
import { IGenerationParameters } from "../state/generationParameters/index";
import { ITree } from "../state/forest/tree";

class TreeGeneratorWithDispersion implements IGenerator {
  generate(params: IGenerationParameters, reportProgress: (trees: ITree[]) => void): ITree[] {
    let result: ITree[] = [];
    let numberOfTries = 0;
    for (let i = 0; i < params.numberOfTrees; i++) {
      let dispersion = params.dispersion;
      let tree = <ITree> {
        spriteColumn: _.random(0, params.sprite.columns),
        spriteRow: _.random(0, params.sprite.rows),
      }
      let treePositionMeetsDispersionLimit = false;
      while (!treePositionMeetsDispersionLimit) {
        tree = _.extend(tree, <ITree> {
          canvasImageX: _.random(0, params.imageWidth - params.sprite.columnWidth),
          canvasImageY: _.random(0, params.imageHeight - params.sprite.rowHeight)
        })
        treePositionMeetsDispersionLimit = _.isEmpty(_.filter(result, t => {
          let distance = Math.sqrt(
            Math.pow(tree.canvasImageX - t.canvasImageX, 2) +
            Math.pow(tree.canvasImageY - t.canvasImageY, 2));
          return distance < dispersion
        }));
        numberOfTries++;
        if (numberOfTries > 5) {
          dispersion = Math.max(dispersion-1, 1);
          numberOfTries = 0;
        }
      }
      if ((_.isFunction(reportProgress)) && (i % 1000 == 0))
        reportProgress(result);
      result.push(_.extend(tree, <ITree> {
        x: tree.canvasImageX + params.sprite.columnWidth/2,
        y: tree.canvasImageY + params.sprite.rowHeight/2
      }))
    }
    return result;
  }
}

export const treeGeneratorWithDispersion = new TreeGeneratorWithDispersion();