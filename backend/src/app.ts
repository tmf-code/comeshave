import { Players } from './players/players';
import { widthPoints, heightPoints, jitterRange, rotationStart, rotationEnd } from './constants';
import { HairMapFactory } from './hair-map/hair-map-factory';
import { ServerSocket, ServerSocketCallbacks } from './server-socket';
import { makeProductionServer, makeDevelopmentServer } from './server';

let server;

if (process.env.NODE_ENV === 'production') {
  server = makeProductionServer();
  console.log(process.env.NODE_ENV);
} else {
  server = makeDevelopmentServer();
  console.log(process.env.NODE_ENV);
}

const hairMap = HairMapFactory.createFrom(
  widthPoints,
  heightPoints,
  jitterRange,
  rotationStart,
  rotationEnd,
);

const players = new Players(hairMap.getMapState.bind(hairMap));

const serverSocketCallbacks: ServerSocketCallbacks = {
  onPlayerConnected: (socket: SocketIO.Socket) => players.addPlayer(socket),
  onPlayerDisconnected: (playerId: string) => players.removePlayer(playerId),
  onEmitPlayerLocations: () => players.getPlayerLocations(),
  onEmitHairLengths: () => hairMap.getMapState().lengths,
  onReceiveCuts: (cuts: boolean[]) => hairMap.recieveCuts(cuts),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new ServerSocket(server, serverSocketCallbacks);

players.setRecieveCuts(socket.recieveCuts.bind(socket));
