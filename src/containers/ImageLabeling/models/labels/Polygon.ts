import isEqual from 'lodash/isEqual';
import Shape from './Shape';

export default class Polygon extends Shape {
  constructor(public points: number[][] = []) {
    super();
  }

  get isClosed(): boolean {
    if (this.points.length < 3) {
      return false;
    }
    const first = this.points[0];
    const last = this.points[this.points.length - 1];
    return isEqual(first, last);
  }

  addPoint(point: number[]): void {
    if (this.isClosed) {
      throw new Error('The polygon is closed');
    }
    this.points.push(point);
  }

  removePoint(): void {
    if (this.points.length > 0) {
      this.points.pop();
    }
  }

  close(): void {
    if (this.points.length < 3) {
      throw new Error('Need at least 3 points to close the polygon');
    }

    const [x, y] = this.points[0];
    this.points.push([x, y]);
  }

  draw(ctx: any, zoom: number): void {
    ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    const points = this.points.map(([x, y]) => {
      return { x: x * zoom, y: y * zoom };
    });

    if (points && points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (const p of points.slice(1)) {
        const { x, y } = p;
        ctx.lineTo(x, y);
      }

      if (this.isClosed) {
        ctx.closePath();
      }
      ctx.stroke();
      ctx.fill();

      for (const { x, y } of points) {
        // draw dot
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.fill();
      }
    }
  }

  get displayString(): string {
    return 'polygon';
  }
}
