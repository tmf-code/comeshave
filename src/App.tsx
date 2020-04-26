import React, { useState } from 'react';
import { Canvas } from 'react-three-fiber';

import './App.css';
import { Grid, Rotations } from './types/types';
import { socket } from './drivers/Socket';
import { Triangles } from './components/Triangles';

const App = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [rotations, setRotations] = useState<Rotations>([]);

  setInterval(() => {
    setGrid(socket.grid);
    setRotations(socket.rotations);
  }, 1000);

  return (
    <Canvas gl2={false} orthographic={false}>
      <Triangles grid={grid} rotations={rotations} />
    </Canvas>
  );
};

export default App;
