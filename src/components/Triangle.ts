import { Position3D } from '../types/types';
import { Shape, ShapeGeometry } from 'three';
import { lerp } from './utilities';
import { maxLengthAsPercentWidth, maxWidthAsPercentWidth } from './constants';

const triangleGeometry = function (screenWidth: number) {
  const maxLength = lerp(0, screenWidth, maxLengthAsPercentWidth);
  const width = lerp(0, screenWidth, maxWidthAsPercentWidth);

  const makeTriangleShape = (position: Position3D = [0, 0, 0]) => {
    return new Shape()
      .moveTo(position[0], position[1])
      .lineTo(position[0] + width / 2.0, position[1] - maxLength)
      .lineTo(position[0] + width, position[1])
      .lineTo(position[0], position[1]);
  };

  const maxLengthHairShape = makeTriangleShape();
  const geo = new ShapeGeometry(maxLengthHairShape);
  geo.computeVertexNormals();
  geo.scale(0.5, 0.5, 0.5);

  return geo;
};

export { triangleGeometry };
