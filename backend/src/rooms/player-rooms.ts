import { RoomNames } from './room-names';
import { RoomClass } from './room-class';
import { IPlayer } from './i-player';

export interface PlayerRoomsOptions {
  playerCapacity: number;
  roomCapacity: number;
  roomNames: RoomNames;
}

export class PlayerRooms {
  private rooms: readonly RoomClass[] = [];
  private readonly playerCapacity: number;
  private readonly roomCapacity: number;
  private readonly roomNames: RoomNames;

  constructor({ playerCapacity, roomCapacity, roomNames }: PlayerRoomsOptions) {
    this.playerCapacity = playerCapacity;
    this.roomCapacity = roomCapacity;
    this.roomNames = roomNames;
  }

  addToNextRoom(player: IPlayer): void {
    this.throwIfFull(player);
    const [maybeChosenRoom] = this.findAvailableRooms();

    const roomCanFitPlayer = maybeChosenRoom !== undefined;
    if (roomCanFitPlayer) {
      this.addToRoom(maybeChosenRoom, player);
      return;
    }

    this.createRandomRoom(player);
  }

  addToNamedRoom(name: string, player: IPlayer): void {
    this.throwIfFull(player);
    this.throwIfNameInvalid(name);

    const maybeRoom = this.findRoomByName(name);
    const roomDoesNotExist = maybeRoom === undefined;

    if (roomDoesNotExist) {
      this.createNamedRoom(name, player);
      return;
    }

    if (maybeRoom?.isAvailable()) {
      this.addToRoom(maybeRoom, player);
      return;
    }

    this.addToNextRoom(player);
  }

  private throwIfFull(player: IPlayer) {
    if (this.isFull())
      throw new Error(
        `Cannot add player ${player.getId()}. PlayerRooms is at capacity ${this.playerCapacity}`,
      );
  }

  private throwIfNameInvalid(name: string) {
    if (!this.roomNames.isValidRoomName(name))
      throw new Error(`Room name ${name} is invalid. Cannot add player to room.`);
  }

  getRoomNameOfPlayer(player: IPlayer): string {
    return this.getRoomOfPlayer(player).name;
  }

  private getRoomOfPlayer(player: IPlayer): RoomClass {
    const maybeRoom = this.rooms.find((room) => room.hasPlayer(player));
    this.throwIfPlayerNotInRooms(player, maybeRoom);

    return maybeRoom!;
  }

  private throwIfPlayerNotInRooms(player: IPlayer, maybeRoom: RoomClass | undefined) {
    if (maybeRoom === undefined)
      throw new Error(`Cannot get room of player ${player.getId()}. Player is not in rooms`);
  }

  private findAvailableRooms = () => this.rooms.filter((room) => room.isAvailable());
  private findRoomByName = (name: string) => this.rooms.find((room) => room.getName() === name);

  private addToRoom(room: RoomClass, player: IPlayer): void {
    try {
      room.addPlayer(player);
    } catch (error) {
      console.error(error);
      this.createRandomRoom(player);
    }
  }

  private createRandomRoom(player: IPlayer): void {
    const name = this.roomNames.getFreeRandomRoomName();
    this.createNamedRoom(name, player);
  }

  private createNamedRoom(name: string, player: IPlayer) {
    const roomExists = this.isExistingRoomName(name);
    if (roomExists)
      throw new Error(
        `Cannot create room ${name} for player ${player.getId()}. Room exists already.`,
      );

    this.roomNames.checkOutRoom(name);
    const room = new RoomClass(name, player, this.roomCapacity);
    this.rooms = [...this.rooms, room];
  }

  private isExistingRoomName = (name: string) => {
    const maybeExistingRoom = this.findRoomByName(name);
    return maybeExistingRoom !== undefined;
  };

  removePlayer(player: IPlayer): void {
    const room = this.getRoomOfPlayer(player);
    room.removePlayer(player);

    if (room.isEmpty()) this.removeRoom(room);
  }

  private removeRoom(room: RoomClass) {
    const roomExists = this.isExistingRoom(room);
    if (!roomExists) throw new Error(`Cannot remove room ${room.getName()}. Room does not exist.`);

    this.rooms = this.rooms.filter((currentRoom) => currentRoom !== room);
    this.roomNames.checkInRoom(room.getName());
  }

  private isExistingRoom = (room: RoomClass) => {
    const maybeExistingRoom = this.rooms.find((currentRoom) => currentRoom === room);
    return maybeExistingRoom !== undefined;
  };

  private isFull = (): boolean => this.getPlayerCount() >= this.playerCapacity;
  getPlayerCount = (): number =>
    this.rooms.reduce((playerCount, currentRoom) => playerCount + currentRoom.getSize(), 0);
  getRoomCount = (): number => this.rooms.length;
}
