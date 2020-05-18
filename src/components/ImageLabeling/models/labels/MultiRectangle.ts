import { MultiShape, Shape } from "./MultiShape";

class Rectangle extends Shape {

  constructor(public x:number, public y:number, public w:number, public h:number) { 
    super();
  } 

  draw(ctx: any, zoom: number): void {
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
    ctx.strokeStyle = 'white';
    ctx.rect(this.x * zoom, this.y * zoom, this.w * zoom, this.h * zoom);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fill();
  }

  update(x: number, y: number, w:number, h:number) : void {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  toArray (): Array<number> {
    return [this.x, this.y, this.w, this.h];
  }

  coordinates = (): Array<Array<number>> => {
    const { x, y, w, h } = this;
    return [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  };

  get displayString(): string {
    return "rectangle";
  }
}

class MultiRectangle extends MultiShape { 
  rectangles: Array<Rectangle>;
  currentRectangle: Rectangle | null

  constructor(json?: string) { 
    super();
    this.rectangles = []
    this.currentRectangle = null

    if (json) {
      this.loadJson(json);
    }
  } 

  private loadJson(json: string): void {
    const feature = JSON.parse(json);
    this.rectangles = feature.geometry.coordinates.map((coordinates: Array<Array<number>>) => {
      const [upperLeft, , lowerRight, , ] = coordinates;
      const [x, y] = upperLeft;
      const [xw, yh] = lowerRight;
      const w = xw - x;
      const h = yh - y;
      return new Rectangle(x, y, w, h);
    });
  }

  deleteShape(i: number): void {
    this.rectangles.splice(i, 1);
  }

  getShapes(): Array<Rectangle> {
    return this.rectangles;
  }

  isRectangleStarted = () => {
    return this.currentRectangle != null;
  }

  startRectangle (x: number, y: number, w:number, h:number): void {
    this.currentRectangle = new Rectangle(x, y, w, h);
  }

  endRectangle(): void {
    if (!this.currentRectangle) {
      throw new Error("no rectangle has been started")
    }
    this.rectangles.push(this.currentRectangle);
    this.currentRectangle = null;
  }

  updateCurrentRectangle(x: number, y: number, w:number, h:number): void {
    if (!this.currentRectangle) {
      throw new Error("no rectangle has been started")
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
      type: "Feature",
      geometry: {
        type: "MultiPolygon",
        coordinates: this.rectangles.map(r => r.coordinates()),
      },
      properties: {
        type: "MultiRectangle",
      }
    };
    return JSON.stringify(feature, null, 2);
  }
}

export default MultiRectangle;