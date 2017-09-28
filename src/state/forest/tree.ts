export interface ITree {
  /**
   * Column in sprite where the tree comes from
   */
  spriteColumn: number;
  /**
   * Row in sprite where the tree comes from
   */
  spriteRow:  number;
  /**
   * x value of (x,y) coordinate of the tree image 
   * left upper corner - as painted on canvas
   * Please note tree image does not really exist 
   * physically, as it is a fragment of the sprite
   */
  canvasImageX: number;
  /**
   * y value of (x,y) coordinate of the tree image 
   * left upper corner as painted on canvas
   * Please note tree image does not really exist 
   * physically, as it is a fragment of the sprite
   */
  canvasImageY: number;
  /**
   * The most accurate x value of (x,y) coordinate 
   * of a tree center on canvas
   */
  x: number;
  /**
   * The most accurate y value of (x,y) coordinate 
   * of a tree center on canvas
   */
  y: number;
}