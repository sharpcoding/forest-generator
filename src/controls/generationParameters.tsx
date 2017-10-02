import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { bindActionCreators } from "redux";
import { ButtonToolbar, Button, ControlLabel, Form, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { ActionCreatorsMapObject } from "redux";
import { IConfig } from "../state/config/index";
import { IParameters } from "../state/parameters/index";
import { IState } from "../state/index";
import { actions } from "../actions/index";

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
  parameters: IParameters;
}

export interface IGenerationParametersControlState {
  numberOfTrees: number;
  canvasWidth: number;
  canvasHeight: number;
}

export interface IGenerationParametersActionCreators extends ActionCreatorsMapObject {
  generateForest: (value: IParameters) => void;
  generationParametersChanged: (value: IParameters) => void;
}

export class GenerationParametersControl extends React.Component<IGenerationParametersControlProps & IGenerationParametersActionCreators, IGenerationParametersControlState> {
  constructor(props: IGenerationParametersControlProps & IGenerationParametersActionCreators) {
    super(props);
    this.state = {
      numberOfTrees: props.parameters.numberOfTrees,
      canvasWidth: props.parameters.imageWidth,
      canvasHeight: props.parameters.imageHeight
    };
  }

  private _validate = (context: EnumValidationContext): ("success" | "error") => {
    let result = true;
    result = result && (((context == EnumValidationContext.All) || (context == EnumValidationContext.NumberOfTrees)) ? 
      _.inRange(this._getTreesTimes1000PerSquarePixel(), this.props.config.image.treeDensityRange[0], this.props.config.image.treeDensityRange[1]+0.001) : true);
    result = result && (((context == EnumValidationContext.All) || (context == EnumValidationContext.CanvasWidth)) ? 
      _.inRange(this.state.canvasWidth, this.props.config.image.widthRange[0], this.props.config.image.widthRange[1]+1) : true);
    result = result && (((context == EnumValidationContext.All) || (context == EnumValidationContext.CanvasHeight)) ? 
      _.inRange(this.state.canvasHeight, this.props.config.image.heightRange[0], this.props.config.image.heightRange[1]+1) : true);
    return result ? "success" : "error";
  }

  private _isValid = (context: EnumValidationContext): boolean => {
    return this._validate(context) == "success";
  }

  private _getTreesTimes1000PerSquarePixel = ():number => {
    let area = (this.state.canvasWidth - this.props.config.sprite.columnWidth) * 
               (this.state.canvasHeight - this.props.config.sprite.rowHeight);
    return this.state.numberOfTrees*1000/area;
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
            onBlur={(event) => this._isValid(EnumValidationContext.NumberOfTrees) ? 
              this.props.generationParametersChanged(_.extend({}, this.props.parameters, { numberOfTrees: this.state.numberOfTrees})) :
              null 
            }
          />
        <FormControl.Feedback />
        <HelpBlock>{`Please enter a value so that the tree density is from ${this.props.config.image.treeDensityRange[0]} to ${this.props.config.image.treeDensityRange[1]}`}</HelpBlock>
        <ControlLabel>Current density is {`${this._getTreesTimes1000PerSquarePixel().toFixed(2)}`} trees per 1000 square pixels</ControlLabel>
      </FormGroup>
      <FormGroup validationState={this._validate(EnumValidationContext.CanvasWidth)}>
        <ControlLabel>Canvas width (px)</ControlLabel>
        <input
          className="form-control"
          type="number"
          value={this.state.canvasWidth}
          onChange={(event) => this.setState({ canvasWidth: event.currentTarget.valueAsNumber })}
          onBlur={(event) => this._isValid(EnumValidationContext.CanvasWidth) ? 
            this.props.generationParametersChanged(_.extend({}, this.props.parameters, { canvasWidth: this.state.canvasWidth})) :
            null 
          }
        />
        <FormControl.Feedback />
        <HelpBlock>{`Please enter a value between ${this.props.config.image.widthRange[0]} and ${this.props.config.image.widthRange[1]}`}</HelpBlock>
      </FormGroup>
      <FormGroup validationState={this._validate(EnumValidationContext.CanvasHeight)}>
        <ControlLabel>Canvas height (px)</ControlLabel>
        <input
          className="form-control"
          type="number"
          value={this.state.canvasHeight}
          onChange={(event) => this.setState({ canvasHeight: event.currentTarget.valueAsNumber })}
          onBlur={(event) => this._isValid(EnumValidationContext.CanvasHeight) ? 
            this.props.generationParametersChanged(_.extend({}, this.props.parameters, { canvasHeight: this.state.canvasHeight })) :
            null 
          }
        />
        <FormControl.Feedback />
        <HelpBlock>{`Please enter a value between ${this.props.config.image.heightRange[0]} and ${this.props.config.image.heightRange[1]}`}</HelpBlock>
      </FormGroup>
      <FormGroup>
        <Button
          disabled={!this._isValid(EnumValidationContext.All)}
          onClick={() => this.props.generateForest(this.props.parameters)}>Generate Forest</Button>
      </FormGroup>
    </Form>)
  }
}

function mapStateToProps(state: IState): IGenerationParametersControlProps {
  return {
    config: state.config,
    parameters: state.parameters
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators<IGenerationParametersActionCreators>({
    generateForest: actions.generateForest,
    generationParametersChanged: actions.generationParametersChanged
  }, dispatch);
}

export default connect<IGenerationParametersControlProps, IGenerationParametersActionCreators, IGenerationParametersControlOwnProps>(mapStateToProps, matchDispatchToProps)(GenerationParametersControl);