import React from "react"
import "./game.css"

type Player = 'X' | 'O';
type Board = number | null;
interface Game {
  id: string;
  board: (Player | null)[];
  winner: Player | null;
  is_draw: boolean;
  status: string;
}

type TicTacToeProps = {
  player: Player;
  active_board: Board;
  mega_board: Game | null;
  mini_boards: Game[] | null;
  set_mini_boards: React.Dispatch<React.SetStateAction<Game[] | null>>;
  set_mega_board: React.Dispatch<React.SetStateAction<Game | null>>;
  set_active_board: React.Dispatch<React.SetStateAction<number | null>>;
  set_player: React.Dispatch<React.SetStateAction<Player>>;
  board: Board;
};

export default function TicTacToe({
  player,
  active_board,
  mega_board,
  mini_boards,
  set_mini_boards,
  set_mega_board,
  set_active_board,
  set_player,
  board, 
}: TicTacToeProps) {

  const api_base = "http://localhost:8000"; 

  async function playMove(board_id: string, move_index: number) {
    var r = await fetch(api_base + "/tictactoe/" + board_id + "/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: move_index, player: player})
    })

    return r.json()
  }

  async function handleClick(board: Board, move_index: number) {
    // console.log('here');
    if (mini_boards == null || mega_board == null || board == null) return;
    if (!mini_boards[board] || mini_boards[board].winner || mini_boards[board].is_draw || mini_boards[board].board[move_index]) return;

    const updated_mini_board = await playMove(mini_boards[board].id, move_index); 

    const new_state = [...mini_boards];     
    new_state[board] = updated_mini_board;
    set_mini_boards(new_state); 

    let updated_mega_board = mega_board;
    if (updated_mini_board.winner) { 
      updated_mega_board = await playMove(mega_board.id, board); 
      set_mega_board(updated_mega_board);
    }

    if (new_state[move_index].winner || updated_mega_board.winner || new_state[move_index].is_draw) {
      set_active_board(null);   
    } else {
      set_active_board(move_index);             
    }

    if (player === 'X') {
      set_player('O');
    } else {
      set_player('X');
    }
  }

  function makeHandler(board: Board, index: number) {
    return function() { 
      if (active_board === null || active_board == board) {
        handleClick(board, index) 
      }
    }
  }

  if (
    mini_boards == null ||
    mega_board == null ||
    board == null ||              
    mini_boards[board] == null        
  ) {
    return;                
  }

  var cells = [];
  for (var i = 0; i < 9; i++) {
    cells.push(
      <button
        key={`${board}-${i}`}
        onClick={makeHandler(board, i)}
        className="square" 
        disabled={!!mega_board.winner || !!mini_boards[board].winner}
        aria-label={`${board}-${i}`}
      >
        {mini_boards[board].board[i]}
      </button>
    )
  }

  if (mini_boards[board].winner) {
    return (
      <div className="mini_board">
        <div className="winner_overlay">
          {mini_boards[board].winner}
        </div>
      </div>
    )
  }

  if (mini_boards[board].is_draw) {
    return (
      <div className="mini_board">
        <div className="draw_overlay">
          Draw
        </div>
      </div>
    )
  }

  return (
    <div className={`mini_board ${active_board === board ? 'red_outline' : ''}`}>
      {cells}
    </div>
  )
}
