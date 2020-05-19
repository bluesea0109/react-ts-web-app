import MultiShape from './MultiShape';
import Polygon from './Polygon';

export default class MultiPolygon extends MultiShape {
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
