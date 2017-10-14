import * as _ from "lodash";
import { ISettingsActionsControlState, ISettingsActionsControlProps } from "./index";

export enum EnumValidationContext {
  All,
  NumberOfTrees,
  CanvasWidth,
  CanvasHeight
}

class Calculations {
  private _props: ISettingsActionsControlProps;
  private _state: ISettingsActionsControlState;

  /**
   * Wrapper around lodash _.inRange()
   * Differences:
   * 1) accepts an array of numbers as the range
   * 2) upper range value is checked inclusive
   */
  inRange = (value: number, range: [number, number]): boolean =>
    value == range[1] || _.inRange(value, range[0], range[1]);
  

  setState = (state: ISettingsActionsControlState): void => { this._state = state; }
  setProps = (props: ISettingsActionsControlProps): void => { this._props = props; }

  area = (): number => {
    let w = this._state.imageWidth;
    let h = this._state.imageHeight; 
    let cw = this._props.config.sprite.columnWidth;
    let rh = this._props.config.sprite.rowHeight;
    return (_.max([w, cw]) - cw) * (_.max([h, rh]) - rh);
  }

  density = (): number => this.area() > 0 ? this._state.numberOfTrees*1000/this.area() : 0;

  /**
   * Provided trees were planted uniformly in a square grid, 
   * calculates the size of a grid cell
   * 
   * Used for calculating the minimal distance (in pixels) between a three 
   * and an another, the most proxime tree 
   */
  dispersion = (): number => {
    let dispersion = Math.sqrt(this.area()/this._state.numberOfTrees);
    return _.max([1, dispersion]);
  }

  recommendedNumberOfTrees = (): number => {
    if (this.inRange(this.density(), this._props.config.image.treeDensityRange))
      return this._state.numberOfTrees;
    return this.density() < this._props.config.image.treeDensityRange[0] ? 
      _.ceil(this._props.config.image.treeDensityRange[0] * this.area() / 1000) :
      _.floor(this._props.config.image.treeDensityRange[1] * this.area() / 1000)
  } 

  formatDensity = (): string => {
    let densityRounded = _.floor(this.density()*100)/100
    let result = `${densityRounded}`
    if (!this.inRange(this.density(), this._props.config.image.treeDensityRange) &&
        this.inRange(densityRounded, this._props.config.image.treeDensityRange)) {
      result = this.density() < this._props.config.image.treeDensityRange[0] ? 
        `slightly below ${this._props.config.image.treeDensityRange[0]}` :
        `slightly above ${this._props.config.image.treeDensityRange[1]}`
    }
    return result;
  };

  validate = (context: EnumValidationContext): ("success" | "error") => {
    let result = true;
    result = result && (((context == EnumValidationContext.All) || (context == EnumValidationContext.NumberOfTrees)) ? 
      this.inRange(this.density(), this._props.config.image.treeDensityRange) : true);
    result = result && (((context == EnumValidationContext.All) || (context == EnumValidationContext.CanvasWidth)) ? 
      this.inRange(this._state.imageWidth, this._props.config.image.widthRange) : true);
    result = result && (((context == EnumValidationContext.All) || (context == EnumValidationContext.CanvasHeight)) ? 
      this.inRange(this._state.imageHeight, this._props.config.image.heightRange) : true);
    return result ? "success" : "error";
  };

  isValid = (context: EnumValidationContext): boolean => {
    return this.validate(context) == "success";
  }
}

export const calculations = new Calculations();