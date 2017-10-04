import * as _ from "lodash";

/**
 * Class aggregating minor/auxiliary calculations
 */
class AuxCalculations {
  public getArea = (canvasWidth: number,
                    canvasHeight: number,
                    spriteColumnWidth: number,  
                    spriteRowHeight: number):number =>  
  {
    return (canvasWidth - spriteColumnWidth) * 
           (canvasHeight - spriteRowHeight);
  }

  /**
   * Get density understood as number of trees (represented in 1k units) 
   * per area (represented in pixels^2 units) 
   */
  public getTreesDensity = (area: number, numberOfTrees: number):number =>  
  {
    return numberOfTrees*1000/area;
  }

  public getRecommendedNumberOfTress = (currentNumberOfTrees: number, area: number, treeDensityRange: [number, number]): number => 
  {
    let currentDensity = this.getTreesDensity(area, currentNumberOfTrees);
    if (_.inRange(currentDensity, treeDensityRange[0], treeDensityRange[1]))
      return currentNumberOfTrees;
    let recalculatedDensity = currentDensity < treeDensityRange[0] ? treeDensityRange[0] : treeDensityRange[1];
    return _.floor((recalculatedDensity * area) / 1000);
  }

  /**
   * Provided trees were planted uniformly in a square grid, 
   * calculates the size of a grid cell
   * 
   * Used for calculating the minimal distance (in pixels) between a three 
   * and an another, the most proxime tree 
   */
  public getDispersion = (area: number, numberOfTrees: number):number =>  
  {
    let dispersion = Math.sqrt(area/numberOfTrees);
    return _.max([1, dispersion]);
  }
}

export const auxCalculations = new AuxCalculations();