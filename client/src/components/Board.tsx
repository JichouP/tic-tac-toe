import React, { FC, useState } from 'react';
import { produce } from 'immer';
type BoardData = AllColor[];
const createBoard = (): BoardData => new Array(9).fill(0);
const cellType = { [0]: '', [1]: '●', [-1]: '○' };
type GameData = { board: BoardData; myColor: 1 | -1 };
type V2 = [number, number];
const add = (v1: V2, v2: V2): V2 => [v1[0] + v2[0], v1[1] + v2[1]];
type AllColor = 1 | 0 | -1;
/*const isWin = (board: BoardData): AllColor => {
  new Array(3).fill(0).map((_, i)=>new Array(3).fill(0).map((_, i)=>i))
}*/
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
export const Board: FC = () => {
  const [state, setState] = useState<GameData>({
    board: createBoard(),
    myColor: 1,
  });
  const on_click = (position: number) => {
    setState((s) =>
      produce(s, (draft) => {
        draft.board = putCell(draft.board, draft.myColor, position);
      })
    );
  };
  return (
    <table>
      <tbody>
        {dummyBoard.map((v) => (
          <tr>
            {v.map((w) => (
              <td onClick={() => on_click(w)}>{cellType[state.board[w]]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
