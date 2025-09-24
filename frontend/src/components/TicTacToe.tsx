import React from "react";
import "./game.css";

type Player = "X" | "O";

interface Game {
  id: string;
  board: (Player | null)[];
  winner: Player | null;
  is_draw: boolean;
  status: string;
}

type Props = {
  game: Game;
  miniIndex: number; // used only for aria-labels like "0-1" to keep tests stable
  disabled: boolean; // parent decides if this mini-board is interactable (active or not)
  highlight: boolean; // outline when this is the active mini-board
  onCellClick: (cellIndex: number) => void;
};

export default function TicTacToe({
  game,
  miniIndex,
  disabled,
  highlight,
  onCellClick,
}: Props) {
  // Winner overlay (keeps visuals clean)
  if (game.winner) {
    return (
      <div className="mini_board">
        <div className="winner_overlay">{game.winner}</div>
      </div>
    );
  }

  const cells = [];
  for (let i = 0; i < 9; i++) {
    const cellDisabled = disabled || game.is_draw || !!game.board[i];
    cells.push(
      <button
        key={`${miniIndex}-${i}`}
        aria-label={`${miniIndex}-${i}`}
        className="square"
        disabled={cellDisabled}
        onClick={() => {
          if (!cellDisabled) onCellClick(i);
        }}
      >
        {game.board[i]}
      </button>
    );
  }

  return (
    <div className={`mini_board ${highlight ? "red_outline" : ""}`}>
      {cells}
    </div>
  );
}
