import isEqual from 'lodash/isEqual';
import { MultiShape, Shape } from './MultiShape';

class Polygon extends Shape {
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

    const [x , y] = this.points[0];
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

class MultiPolygon extends MultiShape {
  polygons: Polygon[];
  currentPolygon: Polygon | null;
  constructor(json?: string) {
    super();
    this.polygons = [];
    this.currentPolygon = null;
    if (json) {
      this.loadJson(json);
    }
  }

  deleteShape(i: number): void {
    this.polygons.splice(i, 1);
  }

  private loadJson(json: string): void {
    const feature = JSON.parse(json);
    this.polygons = feature.geometry.coordinates.map((points: number[][]) => {
      return new Polygon(points);
    });
  }

  getShapes(): Polygon[] {
    return this.polygons;
  }

  endPolygon = () => {
    if (this.currentPolygon == null) {
      throw new Error('no polygon has been started');
    }
    this.currentPolygon.close();
    this.polygons.push(this.currentPolygon);
    this.currentPolygon = null;
  }

  addPoint(point: number[]): void {
    if (this.currentPolygon == null) {
      this.currentPolygon = new Polygon();
    }
    this.currentPolygon.addPoint(point);
  }

  draw(ctx: any, zoom: number): void {

    for (const poly of this.polygons) {
      poly.draw(ctx, zoom);
    }

    if (this.currentPolygon) {
      this.currentPolygon.draw(ctx, zoom);
    }
  }

  coordinates = (): number[][][] => {
    return this.polygons.map(x => x.points);
  }

  toJson(): string {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: this.coordinates(),
      },
      properties: {
        type: 'MultiPolygon',
      },
    };
    return JSON.stringify(feature, null, 2);
  }
}

export default MultiPolygon;
