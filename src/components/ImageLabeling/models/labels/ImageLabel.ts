import { IImageLabel } from '../../../../models/image-labeling-service';
import MultiPolygon from './MultiPolygon';
import MultiRectangle from './MultiRectangle';
import MultiShape from './MultiShape';
import Shape from './Shape';

export enum ImageLabelShapesEnum {
  BOX = 'box',
  POLYGON = 'polygon',
  NONE = 'none',
}

export const strToShapesEnum = (str: string): ImageLabelShapesEnum => {
  switch (str.toLowerCase()) {
    case 'box': return ImageLabelShapesEnum.BOX;
    case 'polygon': return ImageLabelShapesEnum.POLYGON;
    case 'none': return ImageLabelShapesEnum.NONE;
    default: throw new Error(`Unkown image label shape type "${str}"`);
  }
};

class ImageCategoricalLabel {
  shape: MultiShape | null;
  visible: boolean;
  open = false;
  modified = false;

  constructor(
    public id: number | null,
    public shapeType: ImageLabelShapesEnum,
    public categorySetId: number | null,
    public categorySetName: string | null,
    public category: string | null,
    shapeJson?: string,
    ) {

    switch (shapeType) {
      case ImageLabelShapesEnum.BOX: this.shape = new MultiRectangle(shapeJson); break;
      case ImageLabelShapesEnum.POLYGON: this.shape = new MultiPolygon(shapeJson); break;
      default: this.shape = null;
    }
    this.visible = true;
  }

  deleteShape (i: number): void {
    if (this.shape) { this.shape.deleteShape(i); }
    this.modified = true;
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

  static fromServerData(data: IImageLabel): ImageCategoricalLabel {
    const shapeJson = data.value;
    const label = new ImageCategoricalLabel(
      data.id,
      strToShapesEnum(data.shape),
      data.category?.categorySetId || null,
      data.category?.categorySetName || null,
      data.category?.name || null,
      shapeJson ? shapeJson : undefined,
    );

    return label;
  }
}

export default ImageCategoricalLabel;
