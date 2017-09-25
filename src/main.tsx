import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Store, combineReducers, compose, createStore, applyMiddleware } from 'redux';
import { IState } from './state';
import { asyncActionTriggers } from "./actions/asyncTriggers";
import { actions } from "./actions/index";
import { configReducer } from './reducers/config';
import { parametersReducer } from './reducers/parameters';
import { forestReducer } from './reducers/forest';
import ImageControl from './controls/image';

const combinedReducers = combineReducers<IState>({
  config: configReducer,
  parameters: parametersReducer,
  forest: forestReducer
});

//this is the callback function required in order to have Redux DevTools extension https://github.com/zalmoxisus/redux-devtools-extension working
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const store: Store<any> = createStore(combinedReducers, composeEnhancers(), applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <span>
      <div>Hello, there !</div>
      <ImageControl />
    </span>
  </Provider>,
  document.getElementById('app')
);

store.dispatch(asyncActionTriggers.loadConfig("src/config.json"))