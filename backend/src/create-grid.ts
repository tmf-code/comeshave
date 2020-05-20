import { Vector2 } from './types';
import { jitterRange, widthPoints, heightPoints, rotationStart, rotationEnd } from './constants';

const randRange = (minimum: number, maximum: number) =>
  Math.random() * (maximum - minimum) + minimum;

const jitter = ([xPosition, yPosition]: Vector2, jitterRange: number) =>
  [
    xPosition + randRange(-jitterRange, jitterRange),
    yPosition + randRange(-jitterRange, jitterRange),
  ] as Vector2;

const getArrayCoordinateIDs = (arrayIndex: number, horizontalDesity: number) => [
  arrayIndex % horizontalDesity,
  Math.floor(arrayIndex / horizontalDesity),
];

const getXYPositions = (
  [indexX, indexY]: Vector2,
  horizontalDesity: number,
  verticalDensity: number,
) => [indexX / horizontalDesity, indexY / verticalDensity] as Vector2;

export type CreateGridArgs = {
  horizontalDesity: number;
  verticalDensity: number;
  randomJitterRange: number;
  minRotationAngle: number;
  maxRotationAngle: number;
};
const createGridWithInputs = ({
  horizontalDesity,
  verticalDensity,
  randomJitterRange,
  minRotationAngle,
  maxRotationAngle,
}: CreateGridArgs) => {
  const grid = [...new Array(horizontalDesity * verticalDensity)]
    .fill(0)
    .map((_, index) => getArrayCoordinateIDs(index, horizontalDesity))
    .map(([xPosition, yPosition]) =>
      getXYPositions([xPosition, yPosition], horizontalDesity, verticalDensity),
    )
    .map(([xPos, yPos]) => jitter([xPos, yPos], randomJitterRange));
  const lengths = grid.map(() => 0);

  const rotations: number[] = grid.map(() => randRange(minRotationAngle, maxRotationAngle));

  return { grid, lengths, rotations };
};

// Create grid
const createGrid = () => {
  return createGridWithInputs({
    horizontalDesity: widthPoints,
    verticalDensity: heightPoints,
    randomJitterRange: jitterRange,
    minRotationAngle: rotationStart,
    maxRotationAngle: rotationEnd,
  });
};

export { createGrid, createGridWithInputs };
