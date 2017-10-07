import * as _ from "lodash";

/**
 * Class aggregating minor/auxiliary calculations
 */
class AuxCalculations {
  /**
   * Wrapper around lodash _.inRange()
   * Differences:
   * 1) accepts an array of numbers as the range
   * 2) upper range value is checked inclusive
   */
  public inRange = (value: number, range: [number, number]): boolean => {
    return value == range[1] || _.inRange(value, range[0], range[1]);
  }

  public getArea = (canvasWidth: number,
                    canvasHeight: number,
                    spriteColumnWidth: number,  
                    spriteRowHeight: number):number =>  
  {
    return (_.max([canvasWidth, spriteColumnWidth]) - spriteColumnWidth) * 
           (_.max([canvasHeight, spriteRowHeight]) - spriteRowHeight);
  }

  /**
   * Get density understood as number of trees (represented in 1k units) 
   * per area (represented in pixels^2 units) 
   */
  public getTreesDensity = (area: number, numberOfTrees: number):number =>  
  {
    return area > 0 ? numberOfTrees*1000/area : 0;
  }

  public getRecommendedNumberOfTress = (currentNumberOfTrees: number, area: number, treeDensityRange: [number, number]): number => 
  {
    let currentDensity = this.getTreesDensity(area, currentNumberOfTrees);
    if (auxCalculations.inRange(currentDensity, treeDensityRange))
      return currentNumberOfTrees;
    return currentDensity < treeDensityRange[0] ? 
      _.ceil(treeDensityRange[0] * area / 1000) :
      _.floor(treeDensityRange[1] * area / 1000)
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