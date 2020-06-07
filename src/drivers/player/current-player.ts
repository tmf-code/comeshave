import { Mouse } from '../mouse/mouse';
import { AbstractPlayer } from './abstract-player';

export class CurrentPlayer extends AbstractPlayer {
  updateNotCutting(): 'NOT_CUTTING' | 'START_CUTTING' {
    this.setPositionOffscreen();
    this.updateScaleUp();
    this.setRotationToVertical();
    if (Mouse.isClicked() || Mouse.isSingleTouched()) return 'START_CUTTING';

    return 'NOT_CUTTING';
  }

  updateStartCutting(): 'START_CUTTING' | 'CUTTING' {
    this.smoothedPosition = this.mouse?.toArray() as [number, number];
    this.updateRazorTriangles();
    this.setRazorTransform();
    this.updateRotation();

    return 'CUTTING';
  }

  updateCutting(): 'CUTTING' | 'STOP_CUTTING' {
    this.position = this.mouse?.toArray() as [number, number];
    this.rotation = Mouse.getDirection();

    this.updateScaleDown();
    this.updateRotation();
    this.updatePosition();
    this.updateRazorTriangles();
    this.setRazorTransform();

    if (!Mouse.isClicked() && !Mouse.isSingleTouched()) {
      return 'STOP_CUTTING';
    }

    return 'CUTTING';
  }

  updateStopCutting(): 'STOP_CUTTING' | 'NOT_CUTTING' {
    this.setRotationToVertical();
    this.setPositionOffscreen();
    this.updateScaleUp();
    this.updatePosition();
    this.updateRotation();
    this.updateRazorTriangles();
    this.setRazorTransform();

    return 'NOT_CUTTING';
  }

  private setRotationToVertical() {
    Mouse.setDirectionToVertical();
    this.rotation = Mouse.getDirection();
    this.smoothedRotation = this.rotation;
  }

  getLocation(): { rotation: number; position: [number, number] } {
    return {
      rotation: this.rotation,
      position: this.position,
    };
  }
}
