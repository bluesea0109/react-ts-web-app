
export abstract class Shape {
  _isVisible = true;

  abstract draw(ctx: any, zoom: number): void;
  abstract get displayString(): string;

  get isVisible(): boolean {
    return this._isVisible;
  }
}

export abstract class MultiShape {
  abstract getShapes (): Shape[];
  abstract draw(ctx: any, zoom: number): void;
  abstract toJson(): string;
  abstract deleteShape(i: number): void;
}
