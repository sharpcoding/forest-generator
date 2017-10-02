export interface IImage {
  /**
   * Range width, in pixels, of the generated image 
   * (not to be confused with sprite image)
   */
  widthRange: [number, number];
  
  /**
   * Range height, in pixels, of the generated image 
   * (not to be confused with sprite image)
   */
  heightRange: [number, number];
  
  /**
   * The tree densitiy, calcualted as hypothetical density
   * of the generated entities per 1000 square pixels  
   */
  treeDensityRange: [number, number],
}