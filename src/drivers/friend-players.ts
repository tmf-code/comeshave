import { Camera, Mesh } from 'three';
import { FriendPlayer } from './friend-player';

export class FriendPlayers {
  players: Record<
    string,
    { rotation: number; position: [number, number]; razor: FriendPlayer }
  > = {};

  updatePlayers(playerData: Record<string, { rotation: number; position: [number, number] }>) {
    Object.entries(playerData).forEach(([id, { rotation, position }]) => {
      if (this.players[id] === undefined) {
        this.players[id] = { rotation, position, razor: new FriendPlayer() };
      }

      const razor: FriendPlayer = this.players[id].razor;
      razor.serverUpdate(position, rotation);
    });
  }

  updateFrame(ref: React.MutableRefObject<Mesh | undefined>, camera: Camera) {
    Object.values(this.players).forEach((player) => {
      player.razor.updateFrame(ref, camera);
    });
  }
}
