import { Camera, Vector3, Vector2 } from 'three';
import { Grid, Position2D } from '../types/types';

export const lerp = function (value1: number, value2: number, amount: number) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
};

export const arrayEqual = (array1: number[], array2: number[]) => {
  return array2.every((element, index) => array1[index] === element);
};

export const getWorldLimits = (camera: Camera | undefined) => {
  if (!camera) return { leftTop: new Vector3(0, 0, 0), rightBottom: new Vector3(1, 1, 0) };
  const getWorldPos = (xPos: number, yPos: number) => {
    const pos = new Vector3();
    const vec = new Vector3();
    vec.set((xPos / window.innerWidth) * 2 - 1, -(yPos / window.innerHeight) * 2 + 1, 0);
    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    const distance = -camera.position.z / vec.z;
    return pos.copy(camera.position).add(vec.multiplyScalar(distance));
  };

  return {
    leftTop: getWorldPos(0, 0),
    rightBottom: getWorldPos(window.innerWidth, window.innerHeight),
  };
};

export const mouseToWorld = (mouse: Vector2, camera: Camera) => {
  const vec = new Vector3(mouse.x, mouse.y, 0);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  const distance = -camera.position.z / vec.z;
  return new Vector3().copy(camera.position).add(vec.multiplyScalar(distance));
};

export type WorldLimits = ReturnType<typeof getWorldLimits>;

type ViewportDimensions = {
  width: number;
  height: number;
};

export const calculatePositions = function (grid: Grid, viewport: ViewportDimensions): Grid {
  return grid.map(
    ([xPos, yPos]) => relativeToWorld(new Vector2(xPos, yPos), viewport) as Position2D,
  );
};

export const relativeToWorld = function (
  { x, y }: Vector2,
  { width, height }: { width: number; height: number },
) {
  return [lerp(-width / 2.0, width / 2.0, x), lerp(height / 2.0, -height / 2.0, y)];
};
