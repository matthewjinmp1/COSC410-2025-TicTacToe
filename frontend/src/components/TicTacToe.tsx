import React from "react"
import "./game.css"

type Player = 'X' | 'O';
interface Game {
  id: string;
  board: (Player | null)[];
  winner: Player | null;
  is_draw: boolean;
  status: string;
}

export default function TicTacToe() {
  var [mini_boards, set_mini_boards] = React.useState<Game[] | null>(null); 
  var [mega_board, set_mega_board] = React.useState<Game | null>(null); 
  var [player, set_player] = React.useState<Player>('X');
  var [active_board, set_active_board] = React.useState<number | null>(null);

  var api_base = "http://localhost:8000"; 

  async function createGame() { 
    var response = await fetch(api_base + "/tictactoe/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starting_player: "X" })
    })
    return response.json()
  }

  async function playMove(board_id: string, move_index: number) {
    var r = await fetch(api_base + "/tictactoe/" + board_id + "/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index: move_index, player: player})
    })

    return r.json()
  }

  React.useEffect(function() {

    async function load_mini_boards() {
      let games: Game[] = [];
      for (let i = 0; i < 9; i++) {
        let game = await createGame();
        games.push(game);
      }
      set_mini_boards(games);
    }
    load_mini_boards();

    async function load_mega_baord() {
      let game = await createGame();
      set_mega_board(game);
    }
    load_mega_baord();
    
  }, [])

  if (!mini_boards || !mega_board) return <div>Loading...</div>

  async function handleClick(board: number, move_index: number) {
    if (!mega_board || !mini_boards) return;
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

    if (new_state[move_index].winner || updated_mega_board.winner) {
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

  function reset() {

    async function load_mini_boards() {
      let games: Game[] = [];
      for (let i = 0; i < 9; i++) {
        let game = await createGame();
        games.push(game);
      }
      set_mini_boards(games);
    }
    load_mini_boards();

    async function load_mega_baord() {
      let game = await createGame();
      set_mega_board(game);
    }
    load_mega_baord();

    set_player('X');
    set_active_board(null);
  }

  function makeHandler(board: number, index: number) {
    return function() { 
      if (active_board === null || active_board == board) {
        handleClick(board, index) 
      }
    }
  }

  type MiniBoardProps = { board: number };
  function MiniBoard({ board }: MiniBoardProps) {
    if (!mini_boards || !mega_board) return;

    var cells = [];
    for (var i = 0; i < 9; i++) {
      cells.push(
        <button
          key={`${board}-${i}`}
          onClick={makeHandler(board, i)}
          className="square" 
          disabled={!!mega_board.winner || !!mini_boards[board].winner}
        >
          {mini_boards[board].board[i]}
        </button>
      )
    }

    return (
      <div className={`mini_board ${active_board === board ? 'red_outline' : ''}`}>
        {cells}
        {mini_boards[board].winner && (
        <div className="winner_overlay">
          {mini_boards[board].winner}
        </div>
      )}
      </div>
    )
  }

  function Status() {
    if (!mini_boards || !mega_board) return;

    if (mega_board.winner) {
      return <div className="center">{mega_board.status}</div>
    }
    
    return <div className="center">Current Player: {player}</div>
  }

  return (
    <div>
      <Status/>

      <div className="center">
        <div className="mega_board">

          {
            Array.from({length: 9}).map((element, index) => (
              <MiniBoard key={index} board={index} />
            ))
          }

      </div>

      </div>
      <div className="center">
        <button onClick={reset}>New Game</button>
      </div>
    </div>
  )
}
