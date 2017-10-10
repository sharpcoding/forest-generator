import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { bindActionCreators } from "redux";
import { ButtonToolbar, Button, ControlLabel, Form, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { ActionCreatorsMapObject } from "redux";
import { IConfig } from "../state/config/index";
import { IGenerationParameters } from "../state/generationParameters";
import { IState } from "../state/index";
import { actions } from "../actions/index";
import { auxCalculations } from "../algorithms/auxCalculations";
import { asyncActionTriggers } from "../actions/asyncTriggers";

enum EnumValidationContext {
  All,
  NumberOfTrees,
  CanvasWidth,
  CanvasHeight
}

export interface IGenerationParametersControlOwnProps {
}

export interface IGenerationParametersControlProps {
  config: IConfig;
  parameters: IGenerationParameters;
}

export interface IGenerationParametersControlState {
  numberOfTrees?: number;
  imageWidth?: number;
  imageHeight?: number;
}

export interface IGenerationParametersActionCreators extends ActionCreatorsMapObject {
  generationParametersChanged: (value: IGenerationParameters) => void;
  startForestGeneration: (value: IGenerationParameters) => (dispatch) => void;
}

export class GenerationParametersControl extends React.Component<IGenerationParametersControlProps & IGenerationParametersActionCreators, IGenerationParametersControlState> {
  constructor(props: IGenerationParametersControlProps & IGenerationParametersActionCreators) {
    super(props);
    this.state = {
      numberOfTrees: props.parameters.numberOfTrees,
      imageWidth: props.parameters.imageWidth,
      imageHeight: props.parameters.imageHeight
    };
  }

  private _area = (): number => auxCalculations.getArea(
    this.state.imageWidth, 
    this.state.imageHeight, 
    this.props.config.sprite.columnWidth,
    this.props.config.sprite.rowHeight);
  private _density = (): number => auxCalculations.getTreesDensity(this._area(), this.state.numberOfTrees);
  private _dispersion = (): number => auxCalculations.getDispersion(this._area(), this.state.numberOfTrees);
  private _recommendedNumberOfTrees = (): number => auxCalculations.getRecommendedNumberOfTress(
    this.state.numberOfTrees, 
    this._area(), 
    this.props.config.image.treeDensityRange)
  private _formatDensity = (): string => {
    let densityRounded = _.floor(this._density()*100)/100
    let result = `${densityRounded}`
    if (!auxCalculations.inRange(this._density(), this.props.config.image.treeDensityRange) &&
        auxCalculations.inRange(densityRounded, this.props.config.image.treeDensityRange)) {
      result = this._density() < this.props.config.image.treeDensityRange[0] ? 
        `slightly below ${this.props.config.image.treeDensityRange[0]}` :
        `slightly above ${this.props.config.image.treeDensityRange[1]}`
    }
    return result;
  }

  private _validate = (context: EnumValidationContext): ("success" | "error") => {
    let result = true;
    result = result && (((context == EnumValidationContext.All) || (context == EnumValidationContext.NumberOfTrees)) ? 
      auxCalculations.inRange(this._density(), this.props.config.image.treeDensityRange) : true);
    result = result && (((context == EnumValidationContext.All) || (context == EnumValidationContext.CanvasWidth)) ? 
      auxCalculations.inRange(this.state.imageWidth, this.props.config.image.widthRange) : true);
    result = result && (((context == EnumValidationContext.All) || (context == EnumValidationContext.CanvasHeight)) ? 
      auxCalculations.inRange(this.state.imageHeight, this.props.config.image.heightRange) : true);
    return result ? "success" : "error";
  }

  private _isValid = (context: EnumValidationContext): boolean => {
    return this._validate(context) == "success";
  }

  public render() {
    return (
      <Form>
        <FormGroup validationState={this._validate(EnumValidationContext.NumberOfTrees)}>
          <ControlLabel>Number of trees</ControlLabel>
          <input
            className="form-control"
            type="number"
            value={this.state.numberOfTrees}
            onChange={(event) => this.setState({ numberOfTrees: event.currentTarget.valueAsNumber })}
            onBlur={(event) => {
              this._isValid(EnumValidationContext.NumberOfTrees) ? 
                this.props.generationParametersChanged(_.extend<IGenerationParameters, Object, IGenerationParameters>({}, this.props.parameters, {
                    numberOfTrees: this.state.numberOfTrees,
                    dispersion: this._dispersion() 
                  })) : null 
              }
            }
          />
        <FormControl.Feedback />
        <HelpBlock>Please enter a value so that the tree density is from {this.props.config.image.treeDensityRange[0]} to {this.props.config.image.treeDensityRange[1]}</HelpBlock>
        <ControlLabel>
          Presented density is {this._formatDensity()} tree per square pixel x 1000.
          Assumed dispersion is {this._dispersion().toFixed(2)} pixels.
        </ControlLabel>
      </FormGroup>
      <FormGroup validationState={this._validate(EnumValidationContext.CanvasWidth)}>
        <ControlLabel>Canvas width (px)</ControlLabel>
        <input
          className="form-control"
          type="number"
          value={this.state.imageWidth}
          onChange={(event) => { 
            this.setState(_.extend<IGenerationParametersControlState, IGenerationParametersControlState>({}, {
              imageWidth: event.currentTarget.valueAsNumber }), () => {
              this.setState(_.extend<IGenerationParametersControlState, IGenerationParametersControlState>({}, {
                numberOfTrees: this._recommendedNumberOfTrees()
              }));
            });
          }}
          onBlur={(event) => { 
            this._isValid(EnumValidationContext.CanvasWidth) ? 
              this.props.generationParametersChanged(_.extend<IGenerationParameters, Object, IGenerationParameters>({}, this.props.parameters, { 
                imageWidth: this.state.imageWidth,
                numberOfTrees: this.state.numberOfTrees,
                dispersion: this._dispersion()})) : null 
            }
          }
        />
        <FormControl.Feedback />
        <HelpBlock>Please enter a value between {this.props.config.image.widthRange[0]} and {this.props.config.image.widthRange[1]}</HelpBlock>
      </FormGroup>
      <FormGroup validationState={this._validate(EnumValidationContext.CanvasHeight)}>
        <ControlLabel>Canvas height (px)</ControlLabel>
        <input
          className="form-control"
          type="number"
          value={this.state.imageHeight}
          onChange={(event) => { 
            this.setState(_.extend<IGenerationParametersControlState, IGenerationParametersControlState>({}, {
              imageHeight: event.currentTarget.valueAsNumber }), () => {
              this.setState(_.extend<IGenerationParametersControlState, IGenerationParametersControlState>({}, {
                numberOfTrees: this._recommendedNumberOfTrees()
              }));
            });
          }}
          onBlur={(event) => {
            this._isValid(EnumValidationContext.CanvasHeight) ? 
              this.props.generationParametersChanged(_.extend<IGenerationParameters, Object, IGenerationParameters>({}, this.props.parameters, {
                  dispersion: this._dispersion(),
                  numberOfTrees: this.state.numberOfTrees,
                  imageHeight: this.state.imageHeight,
                })) : null
            } 
          }
        />
        <FormControl.Feedback />
        <HelpBlock>Please enter a value between {this.props.config.image.heightRange[0]} and {this.props.config.image.heightRange[1]}</HelpBlock>
      </FormGroup>
      <FormGroup>
        <Button
          disabled={!this._isValid(EnumValidationContext.All)}
          onClick={() => this.props.startForestGeneration(this.props.parameters)}>Generate Forest</Button>
      </FormGroup>
    </Form>)
  }
}

function mapStateToProps(state: IState): IGenerationParametersControlProps {
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

export default connect<IGenerationParametersControlProps, IGenerationParametersActionCreators, IGenerationParametersControlOwnProps>(mapStateToProps, matchDispatchToProps)(GenerationParametersControl);