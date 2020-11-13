import Shape from './Shape';

export default abstract class MultiShape {
  abstract getShapes(): Shape[];
  abstract draw(ctx: any, zoom: number): void;
  abstract toJson(): string;
  abstract deleteShape(i: number): void;
}
