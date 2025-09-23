import TicTacToe from "@/components/TicTacToe";
import React from "react"
import "./app.css"

type Player = 'X' | 'O';
interface Game {
  id: string;
  board: (Player | null)[];
  winner: Player | null;
  is_draw: boolean;
  status: string;
}

export default function App() {
  var [mini_boards, set_mini_boards] = React.useState<Game[] | null>(null); 
  var [mega_board, set_mega_board] = React.useState<Game | null>(null); 
  var [player, set_player] = React.useState<Player>('X');
  var [active_board, set_active_board] = React.useState<number | null>(null);

  const api_base = "http://localhost:8000"; 

  async function createGame() { 
    var response = await fetch(api_base + "/tictactoe/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starting_player: "X" })
    })
    return response.json()
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

  if (
    mini_boards === null || 
    mega_board === null
  ) {
    return <div>Loading...</div>; 
  } 

  function Status() {
    if (!mini_boards || !mega_board) return null;

    if (mega_board.winner) {
      return <div className="center">{mega_board.status}</div>
    }
    
    return <div className="center">Current Player: {player}</div>
  }

  return (
    <div data-testid="app">
      <Status/>

      <div className="center">
        <div className="mega_board">

          {
            Array.from({length: 9}).map((element, index) => (
              <TicTacToe key={index} 
                player={player}
                active_board={active_board}
                mega_board={mega_board}
                mini_boards={mini_boards}
                set_mini_boards={set_mini_boards}
                set_mega_board={set_mega_board}
                set_active_board={set_active_board}
                set_player={set_player}
                board={index} 
              />
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
