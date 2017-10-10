import 'react-toastify/dist/ReactToastify.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Store, combineReducers, compose, createStore, applyMiddleware } from 'redux';
import { IState } from './state';
import { asyncActionTriggers } from "./actions/asyncTriggers";
import { actions } from "./actions/index";
import { configReducer } from './reducers/config';
import { generationParametersReducer } from './reducers/generationParameters';
import { forestReducer } from './reducers/forest';
import { notificationsReducer } from './reducers/notifications';
import Toaster from './controls/toaster';
import SpritePaintCanvasControl from './controls/spritePaintCanvas';
import GenerationParametersControl from './controls/generationParameters';

const combinedReducers = combineReducers<IState>({
  config: configReducer,
  generationParameters: generationParametersReducer,
  forest: forestReducer,
  notifications: notificationsReducer
});

//this is the callback function required in order to have Redux DevTools extension https://github.com/zalmoxisus/redux-devtools-extension working
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const store: Store<any> = createStore(combinedReducers, composeEnhancers(), applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <span>
      <Toaster />
      <GenerationParametersControl />
      <br />
      <SpritePaintCanvasControl />
    </span>
  </Provider>,
  document.getElementById('app')
);

store.dispatch(asyncActionTriggers.loadConfig("src/config.json"))