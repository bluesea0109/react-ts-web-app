import Shape from './Shape';

export default class Rectangle extends Shape {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {
    super();
  }

  draw(ctx: any, zoom: number): void {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
    ctx.strokeStyle = 'white';
    ctx.rect(this.x * zoom, this.y * zoom, this.w * zoom, this.h * zoom);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
  }

  update(x: number, y: number, w: number, h: number): void {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  toArray(): number[] {
    return [this.x, this.y, this.w, this.h];
  }

  coordinates(): number[][] {
    const { x, y, w, h } = this;
    return [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
      [x, y],
    ];
  }

  get displayString(): string {
    return 'rectangle';
  }
}
