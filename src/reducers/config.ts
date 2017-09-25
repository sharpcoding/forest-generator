import * as _ from "lodash";
import { handleActions, Action } from "redux-actions";
import { actionLabels } from "../actions/labels";
import { IConfig } from "../state/config/index";
import { asyncActionTriggers } from "../actions/asyncTriggers";

export const configReducer = handleActions<IConfig, Object>({
  [actionLabels.CONFIG_LOADED_SUCCESSFULLY]: (state: IConfig, action: Action<IConfig>): IConfig => {
    return _.extend({}, <IConfig> action.payload);
  }
 }, <IConfig> {}
);