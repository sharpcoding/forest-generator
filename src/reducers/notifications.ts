import * as _ from "lodash";
import { handleActions, Action, BaseAction } from "redux-actions";
import { actionLabels } from "../actions/labels";
import { INotifications, EnumForestGeneratingStatus, EnumImageDownloadingStatus } from "../state/notifications/index";
import { ITree } from "../state/forest/tree";

export const notificationsReducer = handleActions<INotifications, ITree[]>({
  [actionLabels.FOREST_GENERATION_STARTED]: (state: INotifications, action: BaseAction): INotifications => {
    return _.extend({}, state, <INotifications> { forestGeneratingStatus: EnumForestGeneratingStatus.IsGenerating });
  },
  [actionLabels.FOREST_GENERATION_PROGRESSED]: (state: INotifications, action: BaseAction): INotifications => {
    return _.extend({}, state, <INotifications> { forestGeneratingStatus: EnumForestGeneratingStatus.IsGenerating });
  },
  [actionLabels.FOREST_GENERATION_FINISHED]: (state: INotifications, action: BaseAction): INotifications => {
    return _.extend({}, state, <INotifications> { forestGeneratingStatus: EnumForestGeneratingStatus.Generated });
  },
  [actionLabels.IMAGE_DOWNLOAD_STATUS_CHANGE]: (state: INotifications, action: Action<EnumImageDownloadingStatus>): INotifications => {
    return _.extend({}, state, { imageDownloadingStatus: action.payload });
  }
 }, <INotifications> { 
   forestGeneratingStatus: EnumForestGeneratingStatus.Initial,
   imageDownloadingStatus: EnumImageDownloadingStatus.NotRequested
 }
);