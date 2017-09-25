/**
 * Describes a graphic sprite, which is just an image 
 * available at @param pathUrl, containing other images, 
 * equally distributed in @param rows and @param columns.
 * 
 * Every column has its @param columnWidth (in pixels) and 
 * every row has its @param rowHeight (in pixels) and
 */
export interface ISprite {
  pathUrl: string;
  columns: number;
  rows: number;
  columnWidth: number;
  rowHeight: number;
}