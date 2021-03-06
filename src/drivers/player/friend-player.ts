import { friendLayer, offscreen } from './../../utilities/constants';
import { Player } from './player';
import { sampleInterval } from '../../utilities/constants';
import { PlayerData } from '../../../@types/messages';

export class FriendPlayer extends Player {
  private playbackPointerPosition: [number, number] = [0, 0];
  private playbackRotation = 0;
  private playbackActionState: PlayerData['state'] = 'NOT_CUTTING';
  private retries = 0;
  constructor() {
    super();
    this.setLayer(friendLayer);
    this.startPlayingBackPlayerData();
  }

  private startPlayingBackPlayerData(): void {
    setTimeout(() => {
      this.tickPlayback();
    }, sampleInterval);
  }

  private tickPlayback() {
    const thisExists = this !== undefined;
    if (!thisExists) return;

    requestAnimationFrame(this.playbackPlayerData.bind(this));
    setTimeout(this.tickPlayback.bind(this), sampleInterval);
  }

  private playbackPlayerData() {
    const data = this.getPlayerData();
    if (this.retries > 15) {
      this.playbackPointerPosition = offscreen;
      return;
    }
    if (data === undefined) {
      this.retries++;
      return;
    }
    this.retries = 0;

    const { position, rotation, state } = data;

    this.playbackPointerPosition = position;
    this.playbackRotation = rotation;
    this.setState(state);
    this.playbackActionState = state;
  }

  beforeEachState(): void {
    this.setPointerPosition(this.playbackPointerPosition);
    this.setRotation(this.playbackRotation);
    this.setState(this.playbackActionState);
  }
}
