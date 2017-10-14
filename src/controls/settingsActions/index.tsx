import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { bindActionCreators } from "redux";
import { ButtonToolbar, Button, ControlLabel, Form, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { ActionCreatorsMapObject } from "redux";
import { IConfig } from "../../state/config";
import { IGenerationParameters } from "../../state/generationParameters";
import { IState } from "../../state";
import { actions } from "../../actions";
import { calculations, EnumValidationContext } from "./calculations";
import { asyncActionTriggers } from "../../actions/asyncTriggers";

export interface ISettingsActionsControlOwnProps {
}

export interface ISettingsActionsControlProps {
  config: IConfig;
  parameters: IGenerationParameters;
}

export interface ISettingsActionsControlState {
  numberOfTrees?: number;
  imageWidth?: number;
  imageHeight?: number;
}

export interface IGenerationParametersActionCreators extends ActionCreatorsMapObject {
  generationParametersChanged: (value: IGenerationParameters) => void;
  startForestGeneration: (value: IGenerationParameters) => (dispatch) => void;
}

export class SettingsActionsControl extends React.Component<ISettingsActionsControlProps & IGenerationParametersActionCreators, ISettingsActionsControlState> {
  constructor(props: ISettingsActionsControlProps & IGenerationParametersActionCreators) {
    super(props);
    this.state = {
      numberOfTrees: props.parameters.numberOfTrees,
      imageWidth: props.parameters.imageWidth,
      imageHeight: props.parameters.imageHeight
    };
    calculations.setProps(this.props);
    calculations.setState(this.state);
  }

  public shouldComponentUpdate(nextProps: ISettingsActionsControlProps, nextState: ISettingsActionsControlState): boolean {
    calculations.setProps(nextProps);
    calculations.setState(nextState);
    return true;
  }

  public render() {
    return (
      <Form>
        <FormGroup validationState={calculations.validate(EnumValidationContext.NumberOfTrees)}>
          <ControlLabel>Number of trees</ControlLabel>
          <input
            className="form-control"
            type="number"
            value={this.state.numberOfTrees}
            onChange={(event) => this.setState({ numberOfTrees: event.currentTarget.valueAsNumber })}
          />
        <FormControl.Feedback />
        <HelpBlock>Please enter a value so that the tree density is from {this.props.config.image.treeDensityRange[0]} to {this.props.config.image.treeDensityRange[1]}</HelpBlock>
        <ControlLabel>
          Presented density is {calculations.formatDensity()} tree per square pixel x 1000.
          Assumed dispersion is {calculations.dispersion().toFixed(2)} pixels.
        </ControlLabel>
      </FormGroup>
      <FormGroup validationState={calculations.validate(EnumValidationContext.CanvasWidth)}>
        <ControlLabel>Canvas width (px)</ControlLabel>
        <input
          className="form-control"
          type="number"
          value={this.state.imageWidth}
          onChange={(event) => { 
            this.setState(_.extend<ISettingsActionsControlState, ISettingsActionsControlState>({}, {
              imageWidth: event.currentTarget.valueAsNumber }), () => {
              this.setState(_.extend<ISettingsActionsControlState, ISettingsActionsControlState>({}, {
                numberOfTrees: calculations.recommendedNumberOfTrees()
              }));
            });
          }}
        />
        <FormControl.Feedback />
        <HelpBlock>Please enter a value between {this.props.config.image.widthRange[0]} and {this.props.config.image.widthRange[1]}</HelpBlock>
      </FormGroup>
      <FormGroup validationState={calculations.validate(EnumValidationContext.CanvasHeight)}>
        <ControlLabel>Canvas height (px)</ControlLabel>
        <input
          className="form-control"
          type="number"
          value={this.state.imageHeight}
          onChange={(event) => { 
            this.setState(_.extend<ISettingsActionsControlState, ISettingsActionsControlState>({}, {
              imageHeight: event.currentTarget.valueAsNumber }), () => {
              this.setState(_.extend<ISettingsActionsControlState, ISettingsActionsControlState>({}, {
                numberOfTrees: calculations.recommendedNumberOfTrees()
              }));
            });
          }}
        />
        <FormControl.Feedback />
        <HelpBlock>Please enter a value between {this.props.config.image.heightRange[0]} and {this.props.config.image.heightRange[1]}</HelpBlock>
      </FormGroup>
      <FormGroup>
        <ButtonToolbar>
          <Button
            disabled={!calculations.isValid(EnumValidationContext.All)}
            onClick={() => {
              let newParameters = _.extend<IGenerationParameters, Object, IGenerationParameters>({}, this.props.parameters, {
                numberOfTrees: this.state.numberOfTrees,
                imageWidth: this.state.imageWidth,
                imageHeight: this.state.imageHeight,
                dispersion: calculations.dispersion()
              });
              this.props.startForestGeneration(newParameters)}
            }>Generate Forest</Button>
        </ButtonToolbar>
      </FormGroup>
    </Form>)
  }
}

function mapStateToProps(state: IState): ISettingsActionsControlProps {
  return {
    config: state.config,
    parameters: state.generationParameters,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators<IGenerationParametersActionCreators>({
    generationParametersChanged: actions.generationParametersChanged,
    startForestGeneration: asyncActionTriggers.startForestGeneration
  }, dispatch);
}

export default connect<ISettingsActionsControlProps, IGenerationParametersActionCreators, ISettingsActionsControlOwnProps>(mapStateToProps, matchDispatchToProps)(SettingsActionsControl);