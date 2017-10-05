import axios, { AxiosResponse } from 'axios';
import { Dispatch } from "redux";
import { IState } from "../state/index";
import { actions } from "./index";
import { IConfig } from "../state/config/index";
import { IGenerationParameters } from "../state/generationParameters";

export const asyncActionTriggers = {
  loadConfig: (configUrl: string) => (dispatch) => {
    axios
      .get(configUrl)
      .then((result: AxiosResponse) => {
        // Below there is a risky operation, to be improved by response checking 
        dispatch(actions.configLoadedSuccessfully(<IConfig> result.data));
      });
  }
}