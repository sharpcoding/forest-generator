import * as _ from "lodash";
import { handleActions, Action, BaseAction } from "redux-actions";
import { actionLabels } from "../actions/labels";
import { INotifications, EnumForestGeneratingState } from "../state/notifications/index";
import { ITree } from "../state/forest/tree";

export const notificationsReducer = handleActions<INotifications, ITree[]>({
  [actionLabels.FOREST_GENERATION_STARTED]: (state: INotifications, action: BaseAction): INotifications => {
    return _.extend({}, <INotifications> { forestGeneratingState: EnumForestGeneratingState.IsGenerating });
  },
  [actionLabels.FOREST_GENERATION_PROGRESSED]: (state: INotifications, action: BaseAction): INotifications => {
    return _.extend({}, <INotifications> { forestGeneratingState: EnumForestGeneratingState.IsGenerating });
  },
  [actionLabels.FOREST_GENERATION_FINISHED]: (state: INotifications, action: BaseAction): INotifications => {
    return _.extend({}, <INotifications> { forestGeneratingState: EnumForestGeneratingState.Generated });
  }
 }, <INotifications> { forestGeneratingState: EnumForestGeneratingState.Initial }
);