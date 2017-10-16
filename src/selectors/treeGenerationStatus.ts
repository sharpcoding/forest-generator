import * as _ from 'lodash';
import { createSelector } from 'reselect'
import { IState } from "../state/index";
import { INotifications, EnumForestGeneratingStatus } from "../state/notifications/index";

const currentlyGeneratedNumberOfTrees = (state: IState) => _.isArray(state.forest.trees) ? state.forest.trees.length : 0
const targetNumberOfTrees = (state: IState) => state.generationParameters.numberOfTrees
const notifications = (state: IState) => state.notifications

export interface ITreeGenerationStatusSelectorResult {
  updateOnProgress: boolean;
  percentComplete: number;
}  

export const treeGenerationStatusSelector = createSelector<IState, number, number, INotifications, ITreeGenerationStatusSelectorResult>(
  [currentlyGeneratedNumberOfTrees, targetNumberOfTrees, notifications],
  (currentlyGeneratedNumberOfTrees: number, targetNumberOfTrees: number, notifications: INotifications) => {
    let result: ITreeGenerationStatusSelectorResult;
    switch (notifications.forestGeneratingStatus) {
      case EnumForestGeneratingStatus.IsGenerating:
        let percentComplete = targetNumberOfTrees != 0 ? currentlyGeneratedNumberOfTrees * 100 / targetNumberOfTrees : 0;
        result = {
          updateOnProgress: percentComplete > 0,
          percentComplete: percentComplete
        };
        break;
      case EnumForestGeneratingStatus.Initial:
      case EnumForestGeneratingStatus.Generated:
        result = {
          updateOnProgress: false,
          percentComplete: 100
        }
        break;
    }
    return result;
  }
)