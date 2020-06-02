import { lerpTuple3, lerpTuple2, lerpTheta, relativeToWorld } from '../utilities/utilities';
import { offscreen } from '../utilities/constants';
import { Mesh, Vector2, Camera, Matrix4 } from 'three';
import React from 'react';

type PlayerState = 'NOT_CUTTING' | 'START_CUTTING' | 'CUTTING' | 'STOP_CUTTING';

export abstract class AbstractPlayer {
  protected ref: React.MutableRefObject<Mesh | undefined> | undefined;
  protected aspect = 1.0;
  protected rotation = 0;
  protected smoothedRotation = 0;
  protected camera: Camera | undefined;
  protected mouse: Vector2 | undefined;

  protected smoothedPosition: [number, number] = offscreen;
  protected worldPosition: [number, number, number] = [0, 0, 0];
  protected position: [number, number] = offscreen;
  protected scale: [number, number, number] = [1, 1, 1];

  protected playerState: PlayerState = 'STOP_CUTTING';

  updateFrame(
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ) {
    this.ref = ref;
    this.aspect = aspect;
    this.mouse = mouse;
    this.camera = camera;

    switch (this.playerState) {
      case 'NOT_CUTTING':
        this.playerState = this.updateNotCutting();

        break;
      case 'START_CUTTING':
        this.playerState = this.updateStartCutting();
        break;
      case 'CUTTING':
        this.playerState = this.updateCutting();
        break;
      case 'STOP_CUTTING':
        this.playerState = this.updateStopCutting();
        break;
    }
  }

  protected abstract updateNotCutting(): 'NOT_CUTTING' | 'START_CUTTING';
  protected abstract updateStartCutting(): 'START_CUTTING' | 'CUTTING';
  protected abstract updateCutting(): 'CUTTING' | 'STOP_CUTTING';
  protected abstract updateStopCutting(): 'STOP_CUTTING' | 'NOT_CUTTING';

  protected setPositionOffscreen() {
    this.position = [...offscreen] as [number, number];
    this.smoothedPosition = this.position;
  }

  protected updateScaleUp() {
    const targetScale = 1.1 * this.aspect;
    this.scale = [targetScale, targetScale, 1];
  }

  protected updateScaleDown() {
    const targetScale = 1.0 * this.aspect;
    const lerpRate = 0.1;

    this.scale = lerpTuple3(this.scale, [targetScale, targetScale, 1.0], lerpRate);
  }

  protected updatePosition() {
    const lerpRate = 0.1;
    this.smoothedPosition = lerpTuple2(this.smoothedPosition, this.position, lerpRate);

    if (this.camera)
      this.worldPosition = relativeToWorld(this.smoothedPosition, this.camera).toArray() as [
        number,
        number,
        number,
      ];
  }

  protected updateRotation() {
    this.smoothedRotation = lerpTheta(this.smoothedRotation, this.rotation, 0.1, Math.PI * 2);
  }

  protected setRazorTransform() {
    if (!this.ref?.current) return;
    const cursorOnTipOffset = -(2.1 / 2) * 0.5;

    this.ref.current.matrixAutoUpdate = false;

    this.ref.current.matrix.identity();
    const mat4: Matrix4 = new Matrix4();
    this.ref.current.matrix.multiply(mat4.makeTranslation(...this.worldPosition));
    this.ref.current.matrix.multiply(mat4.makeScale(...this.scale));
    this.ref.current.matrix.multiply(mat4.makeRotationZ(this.smoothedRotation));
    this.ref.current.matrix.multiply(mat4.makeTranslation(0, cursorOnTipOffset, 0));

    this.ref.current.matrixWorldNeedsUpdate = true;
  }
}
