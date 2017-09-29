/**
 * The generation parameters
 */
import { ISprite } from "../config/sprite/index";

export interface IParameters {
  readonly numberOfTrees: number;
  readonly canvasWidth: number;
  readonly canvasHeight: number;
  /**
   * Unfortunately we need almost everything 
   * (but the url) from ISprite interface to carry out the 
   * forest generation
   */
  readonly sprite: ISprite;
  /**
   * Minimal distance (in pixels) that must be kept
   * from a tree to another tree  
   */
  readonly dispersion: number;
  /**
   * Currently non-adjustble parameters 
   * defining parametric limits of generation
   */
  readonly canvasWidthRange: [number, number];
  readonly canvasHeightRange: [number, number];
  readonly numberOfTreesRange: [number, number];
}