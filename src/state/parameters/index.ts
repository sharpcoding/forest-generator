/**
 * The generation parameters
 */
import { ISprite } from "../config/sprite/index";

export interface IParameters {
  readonly numberOfTrees: number;
  readonly imageWidth: number;
  readonly imageHeight: number;
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
  readonly minimalDispersion: number;
}