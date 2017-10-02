import * as _ from "lodash";
import { handleActions, Action } from "redux-actions";
import { actionLabels } from "../actions/labels";
import { IConfig } from "../state/config/index";
import { asyncActionTriggers } from "../actions/asyncTriggers";

export const configReducer = handleActions<IConfig, Object>({
  [actionLabels.CONFIG_LOADED_SUCCESSFULLY]: (state: IConfig, action: Action<IConfig>): IConfig => {
    return _.extend({}, <IConfig> action.payload);
  }
 }, <IConfig> {
   image: {
     heightRange: [0, 0],
     widthRange: [0, 0],
     treeDensityRange: [0, 0]
   },
   sprite: {
     columns: 0,
     rows: 0,
     columnWidth: 0,
     rowHeight: 0,
     pathUrl: ""
   }
 }
);