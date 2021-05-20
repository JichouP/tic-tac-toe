import { sha256 } from 'js-sha256';
import { v4 } from 'uuid';

type Table = (1 | 0 | -1)[];

type Room = {
  id: string;
  users: User[];
  table: Table;
};

export class Store {
  users: User[];
  rooms: Room[];
  constructor() {
    this.users = [];
    this.rooms = [];
  }
  createUser = (name: string, password: string): User => {
    const newUser: User = { id: v4(), name, password: sha256(password) };
    this.users.push(newUser);
    return newUser;
  };
  login = (
    name: string,
    password: string
  ): { id: string; name: string } | null => {
    const user = this.users.filter(
      (_user) => name === _user.name && _user.password === sha256(password)
    )[0];
    if (!user) {
      return null;
    }
    return { id: user.id, name: user.name };
  };

  getUser = (name: string): User => {
    return this.users.filter((user) => user.name === name)[0];
  };

  getRooms = (): Room[] => this.rooms;

  getRoom = (id: string): Room => this.rooms.filter((v) => v.id === id)[0];

  createRoom = (): Room => {
    const newRoom: Room = { id: v4(), users: [], table: new Array(9).fill(0) };
    this.rooms.push(newRoom);
    return newRoom;
  };
  joinRoom = (roomId: string, userId: string): Room => {
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId);
    const userIndex = this.users.findIndex((user) => user.id === userId);
    const room = this.rooms[roomIndex];
    const user = this.users[userIndex];
    this.rooms[roomIndex] = {
      ...room,
      users: [...new Set([...room.users, user])],
    };
    return this.rooms[roomIndex];
  };
  leaveRoom = (roomId: string, userId: string): Room => {
    const roomIndex = this.rooms.findIndex((room) => room.id === roomId);
    const room = this.rooms[roomIndex];
    const userIndex = room.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      delete room.users[userIndex];
      room.users = room.users.filter((v) => v !== undefined);
    }
    return room;
  };
  deleteRoom = (id: string): void => {
    const index = this.rooms.findIndex((room) => room.id === id);
    if (index !== -1) {
      delete this.rooms[index];
      this.rooms = this.rooms.filter((v) => v !== undefined);
    }
  };
  updateTable = (roomId: string, table: Table): Room => {
    const index = this.rooms.findIndex((room) => room.id === roomId);
    if (index !== -1) {
      this.rooms[index].table = table;
    }
    return this.rooms[index];
  };
}

const store = new Store();

export default store;
