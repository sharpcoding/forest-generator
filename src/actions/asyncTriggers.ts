import axios, { AxiosResponse } from 'axios';
import { Dispatch } from "redux";
import { IState } from "../state/index";
import { actions } from "./index";
import { IConfig } from "../state/config/index";
import { IParameters } from "../state/parameters/index";

export const asyncActionTriggers = {
  loadConfig: (configUrl: string) => (dispatch) => {
    axios
      .get(configUrl)
      .then((result: AxiosResponse) => {
        dispatch(actions.configLoadedSuccessfully(<IConfig> result.data.config));
      });
  }
}