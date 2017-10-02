import * as _ from "lodash";

/**
 * Class aggregating minor/auxiliary calculations
 */
class AuxCalculations {
  public getTreesPer1000SquarePixels = (canvasWidth: number, 
                                        canvasHeight: number, 
                                        numberOfTrees: number, 
                                        spriteColumnWidth: number,  
                                        spriteRowHeight: number):number =>  
  {
    let area = (canvasWidth - spriteColumnWidth) * 
               (canvasHeight - spriteRowHeight);
    return numberOfTrees*1000/area;
  }

  /**
   * Provided trees were planted uniformly in a square grid, 
   * calculates the size of a grid cell
   * 
   * Used for calculating the minimal distance (in pixels) between a three 
   * and an another, the most proxime tree 
   */
  public getDispersion = (canvasWidth: number, 
                          canvasHeight: number, 
                          numberOfTrees: number, 
                          spriteColumnWidth: number,  
                          spriteRowHeight: number):number =>  
  {
    let area = (canvasWidth - spriteColumnWidth) * 
               (canvasHeight - spriteRowHeight);
    let dispersion = Math.sqrt(area/numberOfTrees);
    return _.max([1, dispersion]);
  }
}

export const auxCalculations = new AuxCalculations();