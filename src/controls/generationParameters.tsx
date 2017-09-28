import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { bindActionCreators } from "redux";
import { ButtonToolbar, Button } from 'react-bootstrap';
import { ActionCreatorsMapObject } from "redux";
import { IParameters } from "../state/parameters/index";
import { IState } from "../state/index";
import { actions } from "../actions/index";

export interface IGenerationParametersControlOwnProps {
}

export interface IGenerationParametersControlProps {
  parameters: IParameters;
}

export interface IGenerationParametersControlState {
  numberOfTrees: number;
}

export interface IGenerationParametersActionCreators extends ActionCreatorsMapObject {
  generateForest: (value: IParameters) => void;
}

export class GenerationParametersControl extends React.Component<IGenerationParametersControlProps & IGenerationParametersActionCreators, IGenerationParametersControlState> {
  constructor(props: IGenerationParametersControlProps & IGenerationParametersActionCreators) {
    super(props);
    this.state = {
      numberOfTrees: props.parameters.numberOfTrees
    };
  }

  public render() {
    return (<ButtonToolbar>
      <Button onClick={() => this.props.generateForest(this.props.parameters) }>Generate forest</Button> 
    </ButtonToolbar>)
  }
}

function mapStateToProps(state: IState): IGenerationParametersControlProps {
  return {
    parameters: state.parameters
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators<IGenerationParametersActionCreators>({
    generateForest: actions.generateForest
  }, dispatch);
}

export default connect<IGenerationParametersControlProps, IGenerationParametersActionCreators, IGenerationParametersControlOwnProps>(mapStateToProps, matchDispatchToProps)(GenerationParametersControl);