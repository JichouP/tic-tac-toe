import React, { FC, useEffect, useState } from 'react';
import { produce } from 'immer';
import styled from 'styled-components';
import axios from 'axios';
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

type BoardData = AllColor[];
const createBoard = (): BoardData => new Array(9).fill(0);
const cellType = { [0]: ' ', [1]: '●', [-1]: '○' };
type GameData = { board: BoardData; myColor: 1 | -1 };
type V2 = [number, number];
const add = (v1: V2, v2: V2): V2 => [v1[0] + v2[0], v1[1] + v2[1]];
type AllColor = 1 | 0 | -1;
const isWin = (board: BoardData): AllColor => {
  for (const p of [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ] as [number, number, number][]) {
    const s = p.map((v) => board[v]);
    if (s[0] === s[1] && s[1] === s[2] && s[0] !== 0) {
      return s[0];
    }
  }
  return 0;
};
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
  leaveRoom: () => any;
};

const BoardComponent: FC<Props> = ({
  className,
  room,
  myName,
  getHeader,
  leaveRoom,
}) => {
  const [state, setState] = useState<GameData>({
    board: room.table,
    myColor: room.users[0].name === myName ? 1 : -1,
  });
  // 強制更新用
  const [t, tk] = useState(1);
  const isMyTurn = (): boolean => {
    if (isWin(state.board) !== 0) {
      return false;
    }
    const sum = [0, 0];
    state.board.forEach((a) => {
      if (a === 1) {
        sum[0] += 1;
      } else if (a === -1) {
        sum[1] += 1;
      }
    });

    console.log('sum0');
    console.log(sum[0]);
    console.log('sum1');
    console.log(sum[1]);
    if (sum[1] < sum[0]) {
      return state.myColor === -1;
    }
    return state.myColor === 1;
  };
  useEffect(() => {
    if (isMyTurn()) {
      return;
    }
    axios
      .get(SERVER_URL + `/room/${room.id}`, {
        headers: getHeader(),
      })
      .then((e) => {
        setState(
          produce(state, (draft) => {
            draft.board = e.data.table;
          })
        );
      });
  });
  useEffect(() => {
    // 強制更新
    setTimeout(() => tk((v) => v + 1), 100);
  }, []);
  const on_click = (position: number) => {
    if (!isMyTurn()) {
      return false;
    }
    if (state.board[position] !== 0) {
      return false;
    }
    const newBoard = putCell(state.board, state.myColor, position);
    setState((s) =>
      produce(s, (draft) => {
        draft.board = newBoard;
      })
    );
    axios.post(
      SERVER_URL + `/room/${room.id}/table`,
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
      {isWin(state.board) !== 0 && (
        <>
          <p>{cellType[isWin(state.board)]} WIN!</p>
          <button
            onClick={() => {
              axios.post(SERVER_URL + `/room/${room.id}/leave`, undefined, {
                headers: getHeader(),
              });
              leaveRoom();
            }}
          >
            Back
          </button>
        </>
      )}
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
