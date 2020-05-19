import io from 'socket.io-client';
import type { Grid, HairLengths } from '../types/types';

type Vector2 = [number, number];

export class Socket {
  private static readonly EMIT_INTERVAL = 100;
  private lengths: number[] = [];
  private grid: Vector2[] = [];
  private rotations: number[] = [];

  public getLengths(): number[] {
    return this.lengths;
  }

  public getGrid(): Vector2[] {
    return this.grid;
  }

  public getRotations(): number[] {
    return this.rotations;
  }

  private myCuts: boolean[] = [];

  public constructor() {
    const socket = this.createSocket();
    this.attachSocketHandlers(socket);
    this.createSocketEmitters(socket);
  }

  private createSocket() {
    return process.env.NODE_ENV === 'production' ? io() : io('http://192.168.178.41:3001');
  }

  private attachSocketHandlers(socket: SocketIOClient.Socket) {
    const socketEventHandlers = {
      updateClientGrid: (grid: Grid) => {
        this.grid = grid;
      },
      updateClientGrowth: (growthSpeed: number) => {
        this.lengths = this.lengths.map((length) => Math.min(length + growthSpeed, 1));
      },
      updateClientLengths: (lengths: HairLengths) => {
        this.lengths = lengths;
      },
      updateClientRotations: (rotations: number[]) => {
        this.rotations = rotations;
      },
      updateClientCuts: (cuts: boolean[]) => {
        this.lengths = this.lengths.map((length, lengthIndex) => (cuts[lengthIndex] ? 0 : length));
      },
    };
    Object.entries(socketEventHandlers).forEach(([name, handler]) => {
      socket.on(name, handler);
    });
  }

  private createSocketEmitters(socket: SocketIOClient.Socket) {
    setInterval(() => {
      if (this.clientHasCut()) {
        this.updateServerCuts(socket);
        this.resetClientCuts();
      }
    }, Socket.EMIT_INTERVAL);
  }

  private clientHasCut() {
    return this.myCuts.some(Boolean);
  }

  private updateServerCuts(socket: SocketIOClient.Socket) {
    socket.emit('updateServerCuts', this.myCuts);
  }

  private resetClientCuts() {
    this.myCuts = this.myCuts.map(() => false);
  }

  updateCuts(cuts: boolean[]) {
    this.cutLengths(cuts);
    this.addNewCuts(cuts);
  }

  private cutLengths(cuts: boolean[]) {
    this.lengths = this.lengths.map((length, lengthIndex) => (cuts[lengthIndex] ? 0 : length));
  }

  private addNewCuts(cuts: boolean[]) {
    this.myCuts = cuts.map((currentCut, cutIndex) => currentCut || this.myCuts[cutIndex]);
  }
}

export const socket = new Socket();
