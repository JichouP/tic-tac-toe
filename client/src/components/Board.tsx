import React, { FC, useEffect, useState } from 'react';
import { produce } from 'immer';
import styled from 'styled-components';
import axios from 'axios';

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

type BoardData = AllColor[];
const createBoard = (): BoardData => new Array(9).fill(0);
const cellType = { [0]: ' ', [1]: '●', [-1]: '○' };
type GameData = { board: BoardData; myColor: 1 | -1 };
type V2 = [number, number];
const add = (v1: V2, v2: V2): V2 => [v1[0] + v2[0], v1[1] + v2[1]];
type AllColor = 1 | 0 | -1;
/*const isWin = (board: BoardData): boolean => {
  new Array(3).fill(0).map((_, i) => new Array(3).fill(0).map((_, i) => i));
};*/
const putCell = (
  board: BoardData,
  color: 1 | -1,
  position: number
): BoardData =>
  produce(board, (draft) => {
    draft[position] = color;
  });
const dummyBoard = new Array(3)
  .fill(0)
  .map((_, i) => new Array(3).fill(0).map((_, j) => i * 3 + j));

type Props = {
  className?: string;
  room: Room;
  myName: string;
  getHeader: () => any;
};

const BoardComponent: FC<Props> = ({ className, room, myName, getHeader }) => {
  const [state, setState] = useState<GameData>({
    board: room.table,
    myColor: room.users[0].name === myName ? 1 : -1,
  });
  const isMyTurn = (): boolean => {
    const sum = [0, 0];
    for (const a of state.board) {
      if (a === 1) {
        sum[0] += 1;
      } else if (a === -1) {
        sum[1] += 1;
      }
    }
    if (sum[1] < sum[0]) {
      return state.myColor === -1;
    }
    return state.myColor === 1;
  };
  useEffect(() => {
    const f = async () => {
      if (isMyTurn()) {
        setTimeout(f, 100);
        return;
      }
      const t = (state.board = (
        await axios.get(`/room/${room.id}`, { headers: getHeader() })
      ).data.table);
      setState(
        produce(state, (draft) => {
          draft.board = t;
        })
      );
      setTimeout(f, 100);
    };
    setTimeout(f, 100);
  });
  const on_click = (position: number) => {
    if (!isMyTurn()) {
      return false;
    }
    const newBoard = putCell(state.board, state.myColor, position);
    setState((s) =>
      produce(s, (draft) => {
        draft.board = newBoard;
      })
    );
    axios.post(
      `/room/${room.id}/table`,
      { table: newBoard },
      { headers: getHeader() }
    );
  };
  return (
    <div className={className}>
      <table>
        <tbody>
          {dummyBoard.map((v, i) => (
            <tr key={i}>
              {v.map((w) => (
                <td key={w} onClick={() => on_click(w)}>
                  {cellType[state.board[w]]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const Board = styled(BoardComponent)`
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  tr {
  }
  td {
    width: 50px;
    height: 50px;
    border: 1px solid black;
    font-size: 40px;
    text-align: center;
  }
`;
