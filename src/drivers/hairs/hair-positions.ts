import { lerp } from '../../utilities/utilities';
import { desiredAspectRatio } from '../../utilities/constants';

class HairPositions {
  private positions: [number, number][];
  private screenPositions: [number, number][];
  private viewportWidth = desiredAspectRatio;
  private viewportHeight = 1.0;

  constructor(size: number) {
    const allZeros = [...new Array(size)].fill([0, 0]);
    this.positions = allZeros;
    this.screenPositions = allZeros;
  }

  setPositions(positions: [number, number][]) {
    this.positions = positions;
    this.convertRelativeToScreen();
  }

  getPositions() {
    return this.positions;
  }

  getScreenPositions() {
    return this.screenPositions;
  }

  setViewport(viewportWidth: number, viewportHeight: number) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.convertRelativeToScreen();
  }

  private convertRelativeToScreen() {
    const desiredViewportWidth = desiredAspectRatio * this.viewportHeight;

    this.screenPositions = this.positions.map(
      ([xPos, yPos]) =>
        this.convertPointRelativeToScreen(
          xPos,
          yPos,
          desiredViewportWidth,
          this.viewportHeight,
        ) as [number, number],
    );
  }

  private convertPointRelativeToScreen(
    xPos: number,
    yPos: number,
    viewportWidth: number,
    viewportHeight: number,
  ) {
    return [
      lerp(-viewportWidth / 2.0, viewportWidth / 2.0, xPos),
      lerp(viewportHeight / 2.0, -viewportHeight / 2.0, yPos),
    ];
  }
}

export { HairPositions };
