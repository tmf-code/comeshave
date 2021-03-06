import { useState, useEffect, useMemo, useRef } from 'react';
import { TextureLoader, Mesh, Vector2, Camera } from 'three';
import React from 'react';
import razorSVG from '../images/razor.png';
import { useThree, useFrame } from 'react-three-fiber';

type CurrentPlayerRazorProps = {
  updateFrame: (
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ) => void;
};

const CurrentPlayerRazor = ({ updateFrame }: CurrentPlayerRazorProps): React.ReactElement => {
  const { mouse, camera, aspect } = useThree();
  const texture = useMemo(() => new TextureLoader().load(razorSVG), []);
  const [mouseUp, setMouseUp] = useState(true);

  useEffect(installUseEffects(setMouseUp), []);
  const ref = useRef<Mesh>();
  useFrame(() => updateFrame(ref, mouse, aspect, camera));

  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[1, 2.1]} />
      <meshBasicMaterial attach="material" transparent opacity={mouseUp ? 0 : 1}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
    </mesh>
  );
};

const installUseEffects = (
  setMouseUp: React.Dispatch<React.SetStateAction<boolean>>,
): React.EffectCallback => () => {
  const down = (event: MouseEvent | TouchEvent) => {
    const shouldClick = event.target && isCanvasClicked(event.target as HTMLElement);
    if (shouldClick) {
      setMouseUp(false);
    }
  };
  const up = () => setMouseUp(true);
  let touchCount = 0;
  const handleTouchStart = (touchEvent: TouchEvent) => {
    touchCount = touchEvent.touches.length;
    if (touchCount === 1) {
      down(touchEvent);
    } else {
      up();
    }
  };
  const handleTouchEnd = (touchEvent: TouchEvent) => {
    touchCount = touchEvent.touches.length;
    if (touchCount === 1) {
      down(touchEvent);
    } else {
      up();
    }
  };

  const isCanvasClicked = (target: HTMLElement) => {
    return target.tagName === 'CANVAS';
  };

  document.addEventListener('mousedown', down);
  document.addEventListener('mouseup', up);
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchend', handleTouchEnd);

  return () => {
    document.removeEventListener('mousedown', down);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('mouseup', up);
    document.removeEventListener('touchend', handleTouchEnd);
  };
};

export { CurrentPlayerRazor };
