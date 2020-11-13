import MultiShape from './MultiShape';
import Rectangle from './Rectangle';

export default class MultiRectangle extends MultiShape {
  rectangles: Rectangle[];
  currentRectangle: Rectangle | null;

  constructor(json?: string) {
    super();
    this.rectangles = [];
    this.currentRectangle = null;

    if (json) {
      this.loadJson(json);
    }
  }

  private loadJson(json: string): void {
    const feature = JSON.parse(json);
    this.rectangles = feature.geometry.coordinates.map(
      (coordinates: number[][]) => {
        const [upperLeft, , lowerRight] = coordinates;
        const [x, y] = upperLeft;
        const [xw, yh] = lowerRight;
        const w = xw - x;
        const h = yh - y;
        return new Rectangle(x, y, w, h);
      },
    );
  }

  deleteShape(i: number): void {
    this.rectangles.splice(i, 1);
  }

  getShapes(): Rectangle[] {
    return this.rectangles;
  }

  isRectangleStarted(): boolean {
    return this.currentRectangle !== null;
  }

  startRectangle(x: number, y: number, w: number, h: number): void {
    this.currentRectangle = new Rectangle(x, y, w, h);
  }

  endRectangle(): void {
    if (!this.currentRectangle) {
      throw new Error('no rectangle has been started');
    }
    this.rectangles.push(this.currentRectangle);
    this.currentRectangle = null;
  }

  updateCurrentRectangle(x: number, y: number, w: number, h: number): void {
    if (!this.currentRectangle) {
      throw new Error('no rectangle has been started');
    }
    this.currentRectangle.update(x, y, w, h);
  }

  draw(ctx: any, zoom: number): void {
    for (const rect of this.rectangles) {
      rect.draw(ctx, zoom);
    }

    if (this.currentRectangle) {
      this.currentRectangle.draw(ctx, zoom);
    }
  }

  toJson(): string {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: this.rectangles.map((r) => r.coordinates()),
      },
      properties: {
        type: 'MultiRectangle',
      },
    };
    return JSON.stringify(feature, null, 2);
  }
}
