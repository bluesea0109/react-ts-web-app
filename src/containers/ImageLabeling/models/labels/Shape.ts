
export default abstract class Shape {
  _isVisible = true;

  abstract draw(ctx: any, zoom: number): void;
  abstract get displayString(): string;

  get isVisible(): boolean {
    return this._isVisible;
  }
}
