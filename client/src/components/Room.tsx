import axios from 'axios';
import { Board } from './Board';
import React, { FC, useState } from 'react';
import { SERVER_URL } from '../constant';
type User = {
  id: string;
  name: string;
  password: string;
};

type Table = (1 | 0 | -1)[];

type Room = {
  id: string;
  users: User[];
  table: Table;
};

export const Room: FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [password, setPassword] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  const getHeader = () => ({
    'Content-Type': 'application/json',
    'X-User': userName ?? '',
    'X-Password': password ?? '',
  });

  const getRoom = async () => {
    if (userName === null || password === null) {
      return false;
    }
    setRooms(
      await axios.get(SERVER_URL + '/room', {
        headers: getHeader(),
      })
    );
  };

  const joinRoom = async (id: string) => {
    if (userName === null || password === null) {
      return false;
    }
    setCurrentRoom(
      await axios.post(SERVER_URL + `/room/${id}/join`, {
        headers: getHeader(),
      })
    );
  };

  if (currentRoom !== null && userName !== null) {
    return <Board room={currentRoom} myName={userName} getHeader={getHeader} />;
  }

  if (!isLogin) {
    return (
      <div>
        <p>Login</p>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={userName ?? ''}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password ?? ''}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (userName === '' || password === '') {
              return false;
            }
            axios.post(
              SERVER_URL + '/register',
              {
                name: userName,
                password: password,
              },
              {
                headers: { 'Content-Type': 'application/json' },
              }
            );
            setIsLogin(true);
            getRoom();
          }}
        >
          OK
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Rooms</h1>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((r) => (
            <li
              onClick={() => {
                if (r.users.length > 1) {
                  return false;
                }
                joinRoom(r.id);
              }}
            >
              Room {r.id}
              <p>{r.users.length}人</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms.</p>
      )}
    </div>
  );
};
