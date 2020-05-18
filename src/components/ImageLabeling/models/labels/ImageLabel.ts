import MultiPolygon from "./MultiPolygon";
import MultiRectangle from "./MultiRectangle";
import { MultiShape, Shape } from "./MultiShape";

class ImageCategoricalLabel {
  shape: MultiShape | null = null;
  visible: boolean;
  open: boolean = false;
  modified: boolean = false;

  constructor(
    public id: number | null,
    public shapeName: string, 
    public categorySet: any | null,
    public category: string | undefined,
    public approvedBy: Array<String> = [],
    shapeJson?: string,
    ) { 
    if (shapeName === 'polygon') {
      this.shape = new MultiPolygon(shapeJson);
    } else if (shapeName === 'box') {
      this.shape = new MultiRectangle(shapeJson);
    }
    this.visible = true;
  }

  deleteShape (i: number): void {
    if (this.shape) this.shape.deleteShape(i);
    this.modified = true;
  }

  get categorySetId(): string | null {
    return this.categorySet ? this.categorySet.id : null;
  }

  get categorySetName(): string {
    return this.categorySet ? this.categorySet.name : '';
  }

  get displayType(): string {
    if (this.shape instanceof MultiPolygon) {
      return 'polygon';
    } else if (this.shape instanceof MultiRectangle) {
      return 'box';
    }
    return 'None';
  }

  getShapes(): Array<Shape> {
    return this.shape ? this.shape.getShapes() : [];
  }

  draw(ctx: any, zoom: number): void {
    if (this.shape) this.shape.draw(ctx, zoom);
  }

  toJson(): string{
    return this.shape ? this.shape.toJson() : "";
  }

  static fromServerData(data: any): ImageCategoricalLabel {
    const shapeJson = data.value;
    const label = new ImageCategoricalLabel(
      data.id, 
      data.shape, 
      data.categorySet,
      data.category, 
      data.approvedBy,
      shapeJson
    );
    
    return label;
  }
}

export default ImageCategoricalLabel;