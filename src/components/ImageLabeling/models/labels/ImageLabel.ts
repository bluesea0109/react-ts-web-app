import MultiPolygon from './MultiPolygon';
import MultiRectangle from './MultiRectangle';
import MultiShape from './MultiShape';
import Shape from './Shape';

export enum ImageLabelShapesEnum {
  BOX = 'box',
  POLYGON = 'polygon',
}

class ImageCategoricalLabel {
  shape: MultiShape;
  visible: boolean;
  open = false;
  modified = false;

  constructor(
    public id: number | null,
    public shapeType: ImageLabelShapesEnum,
    public categorySet: any | null,
    public category: string | null,
    public approvedBy: string[] = [],
    shapeJson?: string,
    ) {

    switch (shapeType) {
      case ImageLabelShapesEnum.BOX: this.shape = new MultiRectangle(shapeJson); break;
      case ImageLabelShapesEnum.POLYGON: this.shape = new MultiPolygon(shapeJson); break;
      default: throw new Error('unknown shape type');
    }
    this.visible = true;
  }

  deleteShape (i: number): void {
    if (this.shape) { this.shape.deleteShape(i); }
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

  getShapes(): Shape[] {
    return this.shape ? this.shape.getShapes() : [];
  }

  draw(ctx: any, zoom: number): void {
    if (this.shape) { this.shape.draw(ctx, zoom); }
  }

  toJson(): string {
    return this.shape ? this.shape.toJson() : '';
  }

  static fromServerData(data: any): ImageCategoricalLabel {
    const shapeJson = data.value;
    const label = new ImageCategoricalLabel(
      data.id,
      data.shape,
      data.categorySet,
      data.category,
      data.approvedBy,
      shapeJson,
    );

    return label;
  }
}

export default ImageCategoricalLabel;
